import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata = {
  title: "Пинг-Понг",
  description: "Пинг-понг с друзьями. Онлайн, без регистрации.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
