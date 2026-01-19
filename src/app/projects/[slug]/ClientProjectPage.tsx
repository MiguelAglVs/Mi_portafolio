// src/app/projects/[slug]/ClientProjectPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Eye,
  Github,
  ExternalLink,
  ArrowLeft,
  Code,
  Copy,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  technologies: string[];
  views: number;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientProjectPageProps {
  project: Project;
  // ¡NO recibir formatDate como prop!
}

// Función INTERNA para formatear fechas
const formatDate = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ClientProjectPage({ project }: ClientProjectPageProps) {
  const [copied, setCopied] = useState(false);

  // Formatear fechas usando la función interna
  const formattedCreatedAt = formatDate(project.createdAt);
  const formattedUpdatedAt = project.updatedAt
    ? formatDate(project.updatedAt)
    : null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Enlace copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Error al copiar el enlace");
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Mira este proyecto: ${project.title}`);
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Botón volver */}
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a proyectos
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Columna izquierda: Contenido principal */}
          <div className="lg:col-span-2">
            {/* Imagen principal */}
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              {project.imageUrl ? (
                <div className="relative w-full h-80 md:h-96">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' text-anchor='middle' dy='.3em' fill='%236b7280'%3E" +
                        encodeURIComponent(project.title.substring(0, 30)) +
                        "%3C/tspan%3E%3Ctspan x='50%25' dy='1.2em'%3EImagen no disponible%3C/tspan%3E%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-80 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-8">
                  <div className="w-24 h-24 mb-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <Code className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                  </div>
                  <p className="text-xl text-gray-500 dark:text-gray-400 text-center">
                    Sin imagen para este proyecto
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 text-center">
                    Este proyecto no tiene una imagen asociada
                  </p>
                </div>
              )}
            </div>

            {/* Título y descripción */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {project.title}
                </h1>
                {project.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                    Destacado
                  </Badge>
                )}
              </div>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                {project.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Publicado: {formattedCreatedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{project.views.toLocaleString()} vistas</span>
                </div>
                {formattedUpdatedAt &&
                  project.updatedAt.getTime() !==
                    project.createdAt.getTime() && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Actualizado: {formattedUpdatedAt}</span>
                    </div>
                  )}
              </div>
            </div>

            {/* Contenido detallado */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {project.content ? (
                <div className="border-t pt-8 mt-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Sobre este proyecto
                  </h2>
                  <div
                    className="whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: project.content.replace(/\n/g, "<br>"),
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900/30">
                  <Code className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">
                    Este proyecto aún no tiene contenido detallado.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    El autor podría agregar más información próximamente.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha: Información lateral */}
          <div className="space-y-6">
            {/* Tecnologías */}
            <div className="p-6 border rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5" />
                Tecnologías utilizadas
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-sm px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                {project.technologies.length} tecnología
                {project.technologies.length !== 1 ? "s" : ""} utilizada
                {project.technologies.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Enlaces */}
            <div className="p-6 border rounded-xl shadow-sm space-y-4">
              <h3 className="text-lg font-semibold mb-4">
                Enlaces del proyecto
              </h3>

              {project.githubUrl && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    <Github className="h-4 w-4" />
                    <span>Ver código en GitHub</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                </Button>
              )}

              {project.liveUrl && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Ver demo en vivo</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                </Button>
              )}

              {!project.githubUrl && !project.liveUrl && (
                <div className="text-center py-4">
                  <ExternalLink className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500 text-sm">
                    No hay enlaces externos disponibles para este proyecto.
                  </p>
                </div>
              )}
            </div>

            {/* Estadísticas adicionales */}
            <div className="p-6 border rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Vistas totales
                  </span>
                  <span className="font-semibold">
                    {project.views.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Estado
                  </span>
                  <Badge variant={project.published ? "default" : "secondary"}>
                    {project.published ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tecnologías
                  </span>
                  <span className="font-semibold">
                    {project.technologies.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="p-6 border rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Compartir</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "¡Copiado!" : "Copiar enlace"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleShareTwitter}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir en Twitter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
