import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clara Odontologia Integrada | Seu sorriso, do seu jeito",
  description: "Odontologia acolhedora, tecnologia de ponta e um plano feito para você. Agende sua avaliação na Clara Odontologia Integrada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
