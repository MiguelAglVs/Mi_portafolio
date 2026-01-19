import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Desenvolver los params
    const params = await context.params;
    const messageId = params.id;

    // Obtener datos del body
    const body = await request.json();
    const { read } = body;

    // Validar que el ID exista
    if (!messageId) {
      return NextResponse.json(
        { error: 'ID de mensaje requerido' },
        { status: 400 }
      );
    }

    // Validar que read sea un booleano
    if (typeof read !== 'boolean') {
      return NextResponse.json(
        { error: 'El campo "read" debe ser un booleano' },
        { status: 400 }
      );
    }

    // Verificar si el mensaje existe
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!existingMessage) {
      return NextResponse.json(
        { error: 'Mensaje no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el mensaje en la base de datos
    const updatedMessage = await prisma.contactMessage.update({
      where: { id: messageId },
      data: { read },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error actualizando mensaje:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}