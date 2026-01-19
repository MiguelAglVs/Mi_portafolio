// src/app/page.tsx - Server Component
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code, Palette, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import HomeProjectCard from "@/components/HomeProjectCard";

// Habilidades estáticas
const skills = [
  "Next.js",
  "React",
  "Php",
  "Python",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "Oracle DB",
  "Prisma",
  "Git",
  "REST APIs",
  "Authentication",
  "Responsive Design",
];

export default async function Home() {
  // Obtener proyectos directamente desde la base de datos
  let projects = [];

  try {
    projects = await prisma.project.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        githubUrl: true,
        liveUrl: true,
        content: true,
        published: true,
        featured: true,
        technologies: true,
        views: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });
  } catch (error) {
    console.error("Error cargando proyectos:", error);
    projects = [];
  }

  // MOSTRAR los últimos 3 proyectos
  const recentProjects = projects.slice(0, 3);
  const allProjects = projects;
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section Mejorada */}
      <div className="bg-gray dark:bg-black-70">
        <section className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Columna Izquierda - Texto */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Desarrollador Full Stack
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Creo experiencias digitales{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    intuitivas y eficientes
                  </span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Especializado en desarrollo web moderno con foco en
                  usabilidad, performance y código mantenible. Transformo ideas
                  en soluciones digitales.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Link href="/projects" className="gap-2">
                      Ver Proyectos{" "}
                      {allProjects.length > 0 && `(${allProjects.length})`}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">Contactar</Link>
                  </Button>
                </div>
              </div>

              {/* Columna Derecha - Imagen */}
              <div className="relative">
                <div className="relative w-full max-w-lg mx-auto">
                  {/* Marco decorativo */}
                  <div className="absolute -inset-4 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl" />

                  {/* Contenedor de la imagen con efectos */}
                  <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-linear-to-br from-gray-900 to-black">
                    <div className="absolute inset-0 bg-linear-to-t from-black-50 to-transparent z-10" />



                    {/* Overlay con efecto de vidrio */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent z-20">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold">TU</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">
                            [Tu Nombre]
                          </h3>
                          <p className="text-gray-300 text-sm">
                            Full Stack Developer
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Elementos decorativos flotantes */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-blue-500/20 animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-purple-500/20 animate-pulse delay-1000" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Proyectos Recientes */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {recentProjects.length > 0
                ? "Proyectos Recientes"
                : "Mis Proyectos"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {recentProjects.length > 0
                ? "Mis trabajos más recientes"
                : "Próximamente mostraré mis proyectos aquí"}
            </p>
          </div>

          {recentProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentProjects.map((project) => (
                  <HomeProjectCard
                    key={project.id}
                    project={{
                      id: project.id,
                      title: project.title,
                      slug: project.slug,
                      description: project.description,
                      imageUrl: project.imageUrl,
                      githubUrl: project.githubUrl,
                      liveUrl: project.liveUrl,
                      technologies: project.technologies,
                      featured: project.featured,
                    }}
                  />
                ))}
              </div>

              {allProjects.length > 3 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/projects" className="gap-2">
                      Explorar todos los proyectos ({allProjects.length})
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Code className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No hay proyectos aún
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Estoy trabajando en nuevos proyectos. ¡Vuelve pronto para ver
                mis trabajos!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Habilidades */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tecnologías</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Herramientas y tecnologías que utilizo regularmente
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors hover:shadow-md"
                >
                  <span className="font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas - Solo mostrar si hay proyectos */}
      {allProjects.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                En Números
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Algunas métricas de mi trabajo
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {allProjects.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Proyectos Publicados
                </div>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {featuredProjects.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Proyectos Destacados
                </div>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {skills.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Tecnologías
                </div>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {projects
                    .reduce((acc, project) => acc + project.views, 0)
                    .toLocaleString()}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Vistas Totales
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enfoque */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mi Enfoque</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Principios que guían mi trabajo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Código Limpio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Escribo código mantenible, bien documentado y siguiendo las
                  mejores prácticas de la industria.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Optimizo cada aspecto para lograr aplicaciones rápidas y
                  eficientes que brinden la mejor experiencia.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Experiencia de Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Diseño interfaces intuitivas y accesibles que resuelven
                  problemas reales de los usuarios.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Estoy disponible para colaborar en nuevos proyectos y desafíos
            interesantes.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact" className="gap-2">
              Iniciar conversación
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
