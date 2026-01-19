import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminDashboard from "@/components/AdminDashboard";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  MessageSquare,
  Eye,
  EyeOff,
  Plus,
  BarChart,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  // Obtener datos completos del usuario incluyendo la imagen
  const userData = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });

  // Obtener datos con Promise.all para mejor performance
  const [projects, messages, stats] = await Promise.all([
    prisma.project.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 20, // Mostrar más mensajes
    }),
    Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]),
  ]);

  const adminStats = {
    totalProjects: stats[0],
    publishedProjects: stats[1],
    totalMessages: stats[2],
    unreadMessages: stats[3],
  };

  // Calcular porcentajes
  const publishedPercentage =
    adminStats.totalProjects > 0
      ? Math.round(
          (adminStats.publishedProjects / adminStats.totalProjects) * 100,
        )
      : 0;

  const readPercentage =
    adminStats.totalMessages > 0
      ? Math.round(
          ((adminStats.totalMessages - adminStats.unreadMessages) /
            adminStats.totalMessages) *
            100,
        )
      : 0;

  // Obtener iniciales para el avatar
  const getUserInitials = (name?: string | null) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header mejorado con imagen de perfil */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              {/* Avatar del admin con imagen */}

              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Panel de Administración
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Gestiona tu portfolio, proyectos y mensajes de contacto
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild className="gap-2">
                <Link href="/">
                  <Eye className="h-4 w-4" />
                  Ver Portfolio
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="gap-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400"
              ></Button>
            </div>
          </div>

          {/* Cards de estadísticas mejoradas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 border-blue-100 dark:border-blue-800/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Proyectos Totales
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold">
                      {adminStats.totalProjects}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {adminStats.publishedProjects} publicados
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {publishedPercentage}%
                    </div>
                    <div className="text-xs text-gray-500">Publicados</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 border-green-100 dark:border-green-800/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Proyectos Publicados
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                    <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold">
                      {adminStats.publishedProjects}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {adminStats.totalProjects - adminStats.publishedProjects}{" "}
                      en borrador
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {publishedPercentage}%
                    </div>
                    <div className="text-xs text-gray-500">Del total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900 border-purple-100 dark:border-purple-800/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Mensajes Totales
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                    <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold">
                      {adminStats.totalMessages}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {adminStats.unreadMessages} sin leer
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {readPercentage}%
                    </div>
                    <div className="text-xs text-gray-500">Leídos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-900 border-amber-100 dark:border-amber-800/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Mensajes Sin Leer
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                    <EyeOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold">
                      {adminStats.unreadMessages}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {adminStats.totalMessages - adminStats.unreadMessages}{" "}
                      leídos
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {100 - readPercentage}%
                    </div>
                    <div className="text-xs text-gray-500">Sin leer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Bar con información del admin */}
          <div className="mb-10 p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                  <BarChart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Resumen de Actividad
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sesión activa como{" "}
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {userData?.name || "Administrador"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <div className="text-sm text-gray-500">Proyectos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{messages.length}</div>
                  <div className="text-sm text-gray-500">Mensajes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {publishedPercentage}%
                  </div>
                  <div className="text-sm text-gray-500">Publicación</div>
                </div>

                {/* Información del admin */}
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <Avatar className="h-8 w-8">
                    {userData?.image ? (
                      <AvatarImage
                        src={userData.image}
                        alt={userData.name || "Admin"}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {getUserInitials(userData?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[120px]">
                      {userData?.name}
                    </p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Component */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border shadow-sm overflow-hidden">
          <AdminDashboard
            projects={projects}
            messages={messages}
            stats={adminStats}
          />
        </div>

        {/* Footer del admin con imagen */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                {userData?.image ? (
                  <AvatarImage
                    src={userData.image}
                    alt={userData.name || "Admin"}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {getUserInitials(userData?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {userData?.name || "Administrador"}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{userData?.email}</span>
                  <span className="px-2 py-0.5 bg-purple-500 text-white dark:bg-purple-900 dark:text-purple-300 text-xs rounded-full">
                    ADMIN
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link href="/profile">
                  <User className="h-4 w-4" />
                  Perfil
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Link href="/api/auth/signout">
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Panel de administración • Versión 1.0.0</p>
                <p className="mt-1">
                  Última actividad:{" "}
                  {new Date().toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
