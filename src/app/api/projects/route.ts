import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Obtener la sesión
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Validar datos requeridos
    if (!data.title || !data.slug) {
      return NextResponse.json(
        { error: 'Título y slug son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el slug ya existe
    const existingProject = await prisma.project.findUnique({
      where: { slug: data.slug }
    })

    if (existingProject) {
      return NextResponse.json(
        { error: 'El slug ya está en uso' },
        { status: 400 }
      )
    }

    // Crear proyecto y conectar al usuario logueado
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        content: data.content || '',
        imageUrl: data.imageUrl || '',
        githubUrl: data.githubUrl || '',
        liveUrl: data.liveUrl || '',
        technologies: data.technologies || [],
        published: data.published || false,
        featured: data.featured || false,
        user: {
          connect: {
            email: session.user.email
          }
        }
      }
    })

    return NextResponse.json(
      { 
        success: true,
        message: 'Proyecto creado correctamente',
        project
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error al crear proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
