import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener un proyecto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID de proyecto no proporcionado' },
        { status: 400 }
      )
    }

    console.log('🔍 GET /api/projects/', id)

    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      console.error('❌ Proyecto no encontrado:', id)
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })

  } catch (error) {
    console.error('❌ Error al obtener proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar proyecto completo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID de proyecto no proporcionado' },
        { status: 400 }
      )
    }

    const data = await request.json()

    console.log('📝 PUT /api/projects/', id, 'Datos recibidos:', {
      ...data,
      content: data.content ? `${data.content.substring(0, 50)}...` : 'vacío',
      imageUrl: data.imageUrl ? 'imagen proporcionada' : 'sin imagen'
    })

    // Validar datos requeridos
    if (!data.title || !data.slug) {
      return NextResponse.json(
        { error: 'Título y slug son requeridos' },
        { status: 400 }
      )
    }

    // Validar que el proyecto exista
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      console.error('❌ Proyecto no encontrado:', id)
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    // Si el slug cambió, verificar que no esté en uso
    if (data.slug && data.slug !== existingProject.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug: data.slug }
      })

      if (slugExists && slugExists.id !== id) {
        console.error('❌ Slug ya está en uso:', data.slug)
        return NextResponse.json(
          { error: 'El slug ya está en uso por otro proyecto' },
          { status: 400 }
        )
      }
    }

    // Actualizar proyecto
    const project = await prisma.project.update({
      where: { id },
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
        updatedAt: new Date()
      }
    })

    console.log('✅ Proyecto actualizado:', {
      id: project.id,
      title: project.title,
      slug: project.slug
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Proyecto actualizado correctamente',
        project 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Error al actualizar proyecto:', error)
    
    // Mensaje de error más específico
    let errorMessage = 'Error interno del servidor'
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        errorMessage = 'El slug ya está en uso por otro proyecto'
      } else if (error.message.includes('Record to update not found')) {
        errorMessage = 'Proyecto no encontrado'
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar parcialmente
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID de proyecto no proporcionado' },
        { status: 400 }
      )
    }

    const data = await request.json()

    console.log('📝 PATCH /api/projects/', id, 'Datos recibidos:', data)

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(data.published !== undefined && { published: data.published }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        updatedAt: new Date()
      }
    })

    console.log('✅ Proyecto actualizado parcialmente:', project.id)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Proyecto actualizado',
        project 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Error al actualizar proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar proyecto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID de proyecto no proporcionado' },
        { status: 400 }
      )
    }

    console.log('🗑️ DELETE /api/projects/', id)

    // Verificar que el proyecto exista
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      console.error('❌ Proyecto no encontrado:', id)
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    await prisma.project.delete({
      where: { id }
    })

    console.log('✅ Proyecto eliminado:', id)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Proyecto eliminado correctamente' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Error al eliminar proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}