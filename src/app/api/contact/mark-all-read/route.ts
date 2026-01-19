import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Marcar todos los mensajes como leídos
    await prisma.contactMessage.updateMany({
      where: { read: false },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marcando todos como leídos:', error);
    return NextResponse.json(
      { error: 'Error al marcar todos los mensajes como leídos' },
      { status: 500 }
    );
  }
}