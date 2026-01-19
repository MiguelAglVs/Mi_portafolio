import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// PUT: Actualizar perfil
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { name, imageUrl } = await request.json()

    // Validar nombre
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      )
    }

    // Validar URL de imagen (si se proporciona)
    if (imageUrl && imageUrl.trim() !== '') {
      try {
        const url = new URL(imageUrl.trim())
        
        // Solo permitir HTTP/HTTPS
        if (!['http:', 'https:'].includes(url.protocol)) {
          return NextResponse.json(
            { error: 'La URL debe ser HTTP o HTTPS' },
            { status: 400 }
          )
        }
        
        // Verificar que sea una URL de imagen común
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
        const hasValidExtension = validExtensions.some(ext => 
          imageUrl.toLowerCase().endsWith(ext)
        )
        
        // Aceptar también URLs comunes de servicios de imágenes
        const commonImagePaths = ['/image/', '/photo/', '/avatar/', '/profile/', '/img/']
        const hasCommonPath = commonImagePaths.some(path => 
          imageUrl.toLowerCase().includes(path)
        )
        
        if (!hasValidExtension && !hasCommonPath) {
          return NextResponse.json(
            { error: 'La URL no parece ser de una imagen válida' },
            { status: 400 }
          )
        }
      } catch {
        return NextResponse.json(
          { error: 'La URL de la imagen no es válida' },
          { status: 400 }
        )
      }
    }

    // Actualizar usuario en la base de datos
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        name: name.trim(),
        image: imageUrl ? imageUrl.trim() : null // Guardar null si está vacío
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser
    })

  } catch (error) {
    console.error('Error actualizando perfil:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET: Obtener información del perfil
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)

  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}