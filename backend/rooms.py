import json
import random
import string

from fastapi import WebSocket


class Player:
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.ready = False


class Room:
    def __init__(self, code):
        self.code = code
        self.players = []
        self.status = "waiting"
        self.result = None
        self.rematch_requests = set()

    def add_player(self, name):
        pid = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
        p = Player(id=pid, name=name)
        self.players.append(p)
        return p

    def get_player(self, player_id):
        for p in self.players:
            if p.id == player_id:
                return p
        return None

    def is_full(self):
        return len(self.players) >= 2

    def all_ready(self):
        return all(p.ready for p in self.players)

    def role(self, player_id):
        for i, p in enumerate(self.players):
            if p.id == player_id:
                return "player1" if i == 0 else "player2"
        return "player1"


rooms = {}


def generate_code():
    chars = string.ascii_lowercase + string.digits
    while True:
        code = "".join(random.choices(chars, k=4))
        if code not in rooms:
            return code


class ConnectionManager:
    def __init__(self):
        self.connections = {}

    async def connect(self, room_code, player_id, ws):
        await ws.accept()
        if room_code not in self.connections:
            self.connections[room_code] = {}
        self.connections[room_code][player_id] = ws

    def disconnect(self, room_code, player_id):
        conns = self.connections.get(room_code)
        if conns:
            conns.pop(player_id, None)
            if not conns:
                del self.connections[room_code]

    async def broadcast(self, room_code, message):
        conns = self.connections.get(room_code)
        if not conns:
            return
        data = json.dumps(message)
        for ws in list(conns.values()):
            try:
                await ws.send_text(data)
            except Exception:
                pass

    async def send_to_other(self, room_code, sender_id, message):
        conns = self.connections.get(room_code)
        if not conns:
            return
        data = json.dumps(message)
        for pid, ws in list(conns.items()):
            if pid != sender_id:
                try:
                    await ws.send_text(data)
                except Exception:
                    pass


manager = ConnectionManager()
