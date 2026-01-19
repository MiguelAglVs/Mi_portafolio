"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  Folder,
  UserCircle,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { href: "/", label: "Inicio", icon: <Home size={16} /> },
    { href: "/projects", label: "Proyectos", icon: <Folder size={16} /> },
    { href: "/about", label: "Sobre mí", icon: <UserCircle size={16} /> },
    { href: "/contact", label: "Contacto", icon: <User size={16} /> },
  ];

  // Verificar autenticación y rol
  const isAuthenticated = !!session;
  const isAdmin =
    session?.user?.role === "ADMIN" ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Obtener iniciales para el avatar
  const getUserInitials = () => {
    if (!session?.user?.name) return "U";
    return session.user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Determinar si hay imagen de perfil
  const hasProfileImage =
    session?.user?.image && session.user.image.trim() !== "";

  // Determinar color del avatar según el rol
  const getAvatarFallbackClass = () => {
    if (isAdmin) {
      return "bg-gradient-to-br from-purple-500 to-pink-500 text-white";
    }
    return "bg-gradient-to-br from-blue-500 to-cyan-500 text-white";
  };

  // Determinar color del badge según el rol
  const getRoleBadge = () => {
    if (!session?.user?.role) return null;

    const roleColors = {
      ADMIN:
        "bg-purple-500 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-700",
      USER: "bg-blue-500 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-700",
      EDITOR:
        "bg-green-500 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-700",
    };

    const colorClass =
      roleColors[session.user.role as keyof typeof roleColors] ||
      roleColors.USER;

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full border ${colorClass}`}>
        {session.user.role}
      </span>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Miguel Vargas
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Auth & Menu */}
          <div className="flex items-center gap-4">
            {/* User dropdown */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                        {hasProfileImage ? (
                          <AvatarImage
                            src={session.user.image}
                            alt={session.user.name || "Usuario"}
                            className="object-cover"
                            onError={(e) => {
                              // Si la imagen falla al cargar, mostrar las iniciales
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : null}
                        <AvatarFallback className={getAvatarFallbackClass()}>
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            {hasProfileImage ? (
                              <AvatarImage
                                src={session.user.image}
                                alt={session.user.name || "Usuario"}
                                className="object-cover"
                              />
                            ) : null}
                            <AvatarFallback
                              className={getAvatarFallbackClass()}
                            >
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {session.user?.name || "Usuario"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {session.user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          {getRoleBadge()}
                          {hasProfileImage && (
                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                              <ImageIcon size={12} />
                              <span>Foto activa</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="cursor-pointer w-full flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <User size={16} className="mr-2" />
                          <span>Mi Perfil</span>
                        </div>
                        {!hasProfileImage && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            Agregar foto
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>

                    {/* OPCIÓN ADMIN EN EL DROPDOWN (solo para ADMIN) */}
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer w-full">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <Settings
                                  size={16}
                                  className="mr-2 text-purple-600 dark:text-purple-400"
                                />
                                <span className="font-medium">Panel Admin</span>
                              </div>

                            </div>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut size={16} className="mr-2" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="gap-2">
                  <User size={16} />
                  Iniciar sesión
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {/* Opción Admin en menú móvil (solo para ADMIN) */}
              {isAuthenticated && isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <Settings size={16} />
                  <span className="font-medium">Panel Admin</span>
                  <span className="ml-auto px-2 py-0.5 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full">
                    Admin
                  </span>
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {hasProfileImage ? (
                          <AvatarImage
                            src={session.user.image}
                            alt={session.user.name || "Usuario"}
                            className="object-cover"
                          />
                        ) : null}
                        <AvatarFallback className={getAvatarFallbackClass()}>
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">
                            {session.user?.name || "Usuario"}
                          </p>
                          {getRoleBadge()}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                        {hasProfileImage && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
                            <ImageIcon size={10} />
                            <span>Foto de perfil activa</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <User size={16} />
                    <div className="flex items-center justify-between w-full">
                      <span>Mi Perfil</span>
                      {!hasProfileImage && (
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          Agregar foto
                        </span>
                      )}
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10"
                >
                  <User size={16} />
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
