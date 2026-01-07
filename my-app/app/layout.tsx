import type { Metadata } from "next";
import "./globals.css";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import NavSelect from "./components/NavSelect";
import UserSession from "./components/connection/UserSession";
import AdminNavButton from "./components/admin/AdminNavButton";
import { getPromotions } from "./actions/project";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Adaverse",
  description: "Group project by Guigui, Ursula, Flo et Xinzhu",
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  const rawSession = await auth.api.getSession({ headers: await headers() });
  const session = rawSession?.user
    ? {
      id: rawSession.user.id,
      name: rawSession.user.name,
      email: rawSession.user.email,
      image: rawSession.user.image // ← AJOUT
    }
    : null;

  // 🔥 Promotions chargées côté serveur (SSR)
  const promos = await getPromotions();

  return (
    <html lang="en">
      <body>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo/Titre style Ada */}
          <h1 className="text-5xl font-futura mr-auto">
            <a href="/">
              <span className="text-ada-dark font-bold">ada</span>
              <span className="text-ada-red font-normal text-5xl">verse</span>
            </a>
          </h1>

          <UserSession session={session} />

          {/* 🔥 NavSelect reçoit les promos directement */}
          <NavSelect promos={promos} />

          <AdminNavButton/>
        <Link href="/favorites" className="relative font-semibold text-ada-red px-4 py-2 bg-black/90  hover:bg-gray-800 transition">
  Favoris

</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}