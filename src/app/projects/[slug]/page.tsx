// src/app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Eye, Github, ExternalLink, ArrowLeft, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { incrementViews } from '@/lib/actions'
import { Metadata } from 'next'
import ClientProjectPage from './ClientProjectPage'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

// Función para generar metadata dinámica
export async function generateMetadata(
  { params }: ProjectPageProps
): Promise<Metadata> {
  const { slug } = await params
  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      imageUrl: true,
    },
  })

  if (!project) {
    return {
      title: 'Proyecto no encontrado',
    }
  }

  return {
    title: `${project.title} - Mi Portfolio`,
    description: project.description || 'Proyecto de mi portfolio',
    openGraph: {
      title: project.title,
      description: project.description || 'Proyecto de mi portfolio',
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  }
}

// Generar rutas estáticas
export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  })

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Desestructurar params correctamente
  const { slug } = await params
  
  if (!slug) {
    notFound()
  }

  const project = await prisma.project.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      imageUrl: true,
      githubUrl: true,
      liveUrl: true,
      technologies: true,
      views: true,
      featured: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!project || !project.published) {
    notFound()
  }

  // Incrementar vistas
  await incrementViews(project.id)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Pasar los datos al componente cliente
  return <ClientProjectPage project={project} />
}