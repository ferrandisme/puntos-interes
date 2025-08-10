"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthModals, UserMenu } from "@/components/auth";
import { useSession } from "@/utils/auth-client";

export default function Header() {
  const { openLogin, openRegister, AuthModalsComponent } = useAuthModals();
  const { data: session, isPending } = useSession();

  return (
    <>
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  PuntosInteres
                </span>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Descubre sitios únicos
                </p>
              </div>
            </Link>

            <div className="flex items-center space-x-3">
              {isPending ? (
                // Loading holder:
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              ) : session?.user ? (
                // Auth:
                <>
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    ¡Hola, {session.user.name}!
                  </span>
                  <UserMenu user={session.user} />
                </>
              ) : (
                // login/register
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex"
                    onClick={openLogin}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    onClick={openRegister}
                  >
                    Registro
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModalsComponent />
    </>
  );
}
