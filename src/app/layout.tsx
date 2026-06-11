import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/shared/query-provider";
import { Provider } from "@/components/ui/provider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Sistema de Biblioteca",
  description: "Gerenciamento moderno de livros, membros e empréstimos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${roboto.variable} antialiased w-full overflow-x-hidden`}
    >
      <body suppressHydrationWarning className="w-full min-h-screen">
        <QueryProvider>
          <Provider>
            {children}
          </Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
