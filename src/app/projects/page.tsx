// src/app/projects/page.tsx - DEBE SER Server Component (sin 'use client')
// src/app/projects/page.tsx - Server Component
import Link from "next/link";
import { Calendar, Eye, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/ProjectCard";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  content: string | null;
  published: boolean;
  featured: boolean;
  technologies: string[];
  views: number;
  createdAt: Date;
}

interface ProjectsPageProps {
  searchParams: Promise<{
    search?: string;
    tech?: string;
  }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  const search = params.search;
  const tech = params.tech;

  // Construir query
  const where: any = {
    published: true,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  if (tech) {
    where.technologies = {
      has: tech,
    };
  }

  // Obtener proyectos
  const projects = await prisma.project.findMany({
    where,
    orderBy: {
      createdAt: "desc",
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
  });

  // Obtener todas las tecnologías únicas para filtros
  const allTechnologies = Array.from(
    new Set(projects.flatMap((p) => p.technologies)),
  ).sort();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mis Proyectos</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Una colección completa de mis trabajos, desde aplicaciones web hasta
            soluciones backend.
          </p>
        </div>

        {/* Formulario de búsqueda - Usando Server Component sin acción */}
        <div className="mb-12">
          <form action="/projects" method="GET">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="search"
                  placeholder="Buscar proyectos..."
                  className="pl-10"
                  defaultValue={search || ""}
                />
              </div>
              <Button type="submit" className="md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </form>

          {/* Filtros por tecnología */}
          <div className="flex flex-wrap gap-2">
            <Button variant={tech ? "outline" : "default"} size="sm" asChild>
              <Link href="/projects">Todas</Link>
            </Button>
            {allTechnologies.slice(0, 10).map((technology) => (
              <Button
                key={technology}
                variant={tech === technology ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link href={`/projects?tech=${encodeURIComponent(technology)}`}>
                  {technology}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Grid de proyectos */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
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
                  views: project.views,
                  featured: project.featured,
                  createdAt: project.createdAt,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">
              No se encontraron proyectos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              {search || tech
                ? "Intenta con otros términos de búsqueda o tecnologías"
                : "Aún no hay proyectos publicados. ¡Vuelve pronto!"}
            </p>
            {(search || tech) && (
              <Button asChild>
                <Link href="/projects">Ver todos los proyectos</Link>
              </Button>
            )}
          </div>
        )}

        {/* Estadísticas */}
        {projects.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {projects.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Proyectos
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {projects.filter((p) => p.featured).length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Destacados
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {allTechnologies.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Tecnologías
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {projects
                    .reduce((acc, p) => acc + p.views, 0)
                    .toLocaleString()}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Vistas totales
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
