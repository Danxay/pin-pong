from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rooms import Room, generate_code, manager, rooms

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PlayerNameBody(BaseModel):
    player_name: str


@app.post("/api/rooms")
async def create_room(body: PlayerNameBody):
    code = generate_code()
    room = Room(code=code)
    player = room.add_player(body.player_name)
    rooms[code] = room
    return {"room_code": code, "player_id": player.id}


@app.get("/api/rooms/{code}")
async def get_room(code: str):
    room = rooms.get(code.lower())
    if not room:
        raise HTTPException(404, "Room not found")
    return {
        "code": room.code,
        "status": room.status,
        "players": [{"id": p.id, "name": p.name, "ready": p.ready} for p in room.players],
    }


@app.post("/api/rooms/{code}/join")
async def join_room(code: str, body: PlayerNameBody):
    room = rooms.get(code.lower())
    if not room:
        raise HTTPException(404, "Room not found")
    if room.is_full():
        raise HTTPException(400, "Room is full")
    player = room.add_player(body.player_name)
    return {"room_code": code, "player_id": player.id}


@app.get("/api/rooms/{code}/result")
async def get_result(code: str):
    room = rooms.get(code.lower())
    if not room or not room.result:
        raise HTTPException(404, "Result not found")
    return room.result


def _room_msg(room):
    return {
        "type": "room_update",
        "players": [{"id": p.id, "name": p.name, "ready": p.ready} for p in room.players],
        "status": room.status,
    }


@app.websocket("/ws/{room_code}")
async def ws_endpoint(ws: WebSocket, room_code: str, player_id: str = Query(...)):
    room_code = room_code.lower()
    room = rooms.get(room_code)
    if not room:
        await ws.close(code=4004)
        return

    player = room.get_player(player_id)
    if not player:
        await ws.close(code=4003)
        return

    await manager.connect(room_code, player_id, ws)

    role = room.role(player_id)
    await ws.send_text('{"type":"your_role","role":"' + role + '"}')
    await manager.broadcast(room_code, _room_msg(room))

    try:
        while True:
            data = await ws.receive_json()
            t = data.get("type")

            if t == "player_ready":
                player.ready = True
                await manager.broadcast(room_code, _room_msg(room))

                if room.is_full() and room.all_ready() and room.status == "waiting":
                    room.status = "playing"
                    await manager.broadcast(room_code, {"type": "game_start"})

            elif t == "paddle_move":
                await manager.send_to_other(room_code, player_id, {
                    "type": "paddle_move",
                    "role": role,
                    "y": data.get("y", 50),
                })

            elif t == "game_state":
                await manager.send_to_other(room_code, player_id, data)

            elif t == "match_end":
                room.result = data.get("result")
                room.status = "finished"
                room.rematch_requests = set()
                await manager.broadcast(room_code, data)

            elif t == "rematch_request":
                room.rematch_requests.add(player_id)
                await manager.send_to_other(room_code, player_id, {"type": "rematch_request"})
                if len(room.rematch_requests) >= 2:
                    room.status = "waiting"
                    room.result = None
                    room.rematch_requests = set()
                    for p in room.players:
                        p.ready = False
                    await manager.broadcast(room_code, {"type": "rematch_start"})

    except WebSocketDisconnect:
        manager.disconnect(room_code, player_id)
        await manager.broadcast(room_code, {
            "type": "player_disconnected",
            "player_id": player_id,
            "player_name": player.name,
        })
