import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Campuslands AI Academy | Formación Práctica en IA para Equipos y Empresas",
  description:
    "Ayudamos a empresas, equipos y profesionales a pasar de usar herramientas a integrar la IA en sus procesos y resultados. Misiones prácticas en Santander y virtual.",
  openGraph: {
    title: "Campuslands AI Academy | Misión de Adopción IA",
    description:
      "Te explicamos lo complejo de forma simple y después te mostramos cómo hacerlo.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#050507] text-[#DCD6EA] font-sans selection:bg-[#7026E8] selection:text-white overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
