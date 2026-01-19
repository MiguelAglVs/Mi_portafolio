// src/components/ProjectCard.tsx
'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Eye, Github, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ProjectImage from './ProjectImage'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    slug: string
    description: string | null
    imageUrl: string | null
    githubUrl: string | null
    liveUrl: string | null
    technologies: string[]
    views: number
    featured: boolean
    createdAt: Date
  }
}

// Función interna para formatear fechas
const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Imagen del proyecto */}
      <div className="relative h-48 overflow-hidden">
        <ProjectImage 
          src={project.imageUrl}
          alt={project.title}
        />
        {project.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
              Destacado
            </Badge>
          </div>
        )}
      </div>

      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="line-clamp-1 text-lg">
            {project.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye className="h-4 w-4" />
            <span>{project.views}</span>
          </div>
        </div>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {project.description || "Sin descripción"}
        </CardDescription>
      </CardHeader>

      <CardContent className="grow">
        <div className="space-y-4">
          {/* Tecnologías */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>

          {/* Enlaces a GitHub y Demo */}
          <div className="flex gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Demo</span>
              </a>
            )}
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(project.createdAt)}</span>
          </div>

          {/* Botón */}
          <Button className="w-full mt-auto" asChild>
            <Link
              href={`/projects/${project.slug}`}
              className="gap-2"
            >
              Ver detalles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}