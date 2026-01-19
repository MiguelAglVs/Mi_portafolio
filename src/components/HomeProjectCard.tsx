// src/components/HomeProjectCard.tsx
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Code,
  Github,
  ExternalLink,
  Rocket,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProjectImage from "./ProjectImage";

interface HomeProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    technologies: string[];
    featured: boolean;
  };
}

// Funciones internas del componente (no se pasan como props)
const getProjectIcon = (technologies: string[]) => {
  if (
    technologies.some(
      (tech) => tech.includes("React Native") || tech.includes("Mobile"),
    )
  ) {
    return <Rocket className="h-5 w-5" />;
  } else if (
    technologies.some(
      (tech) => tech.includes("Design") || tech.includes("UI/UX"),
    )
  ) {
    return <Palette className="h-5 w-5" />;
  }
  return <Code className="h-5 w-5" />;
};

const getProjectCategory = (technologies: string[]) => {
  if (
    technologies.some(
      (tech) => tech.includes("React Native") || tech.includes("Mobile"),
    )
  ) {
    return "Mobile Development";
  } else if (
    technologies.some(
      (tech) => tech.includes("Node.js") || tech.includes("Backend"),
    )
  ) {
    return "Backend Development";
  } else if (
    technologies.some(
      (tech) => tech.includes("Design") || tech.includes("UI/UX"),
    )
  ) {
    return "UI/UX Design";
  }
  return "Web Development";
};

export default function HomeProjectCard({ project }: HomeProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Imagen del proyecto */}
      <div className="relative h-48 overflow-hidden">
        <ProjectImage
          src={project.imageUrl}
          alt={project.title}
          className="hover:scale-105 transition-transform duration-300"
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
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
            {getProjectIcon(project.technologies)}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {getProjectCategory(project.technologies)}
            </Badge>
          </div>
        </div>
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {project.description || "Sin descripción"}
        </CardDescription>
      </CardHeader>

      <CardContent className="grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech: string) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>

        {/* Enlaces a GitHub y Demo */}
        <div className="flex gap-3 mb-4">
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

        <div className="mt-auto">
          <Button variant="ghost" className="w-full" asChild>
            <Link href={`/projects/${project.slug}`} className="justify-center">
              Ver detalles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
