// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validaciones (mantén las que ya tienes)
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Email no válido' },
        { status: 400 }
      )
    }

    // Guardar en base de datos
    const message = await prisma.contactMessage.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
        read: false
      }
    })

    // Configurar Nodemailer con Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // 1. Email para ti (notificación)
    await transporter.sendMail({
      from: `"Formulario de Contacto" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Te llega a tu Gmail
      replyTo: data.email, // Para responder directamente
      subject: `📬 Nuevo mensaje de ${data.name} - ${data.email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #2563eb;">Nuevo mensaje de contacto</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p><strong>👤 Nombre:</strong> ${data.name}</p>
            <p><strong>📧 Email:</strong> ${data.email}</p>
            <p><strong>📝 Mensaje:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #3b82f6;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
            <p>📅 ${new Date().toLocaleString('es-ES')}</p>
            <p>🆔 ID: ${message.id}</p>
            <p>🔗 <a href="#" style="color: #3b82f6;">Ver en panel de administración</a></p>
          </div>
        </div>
      `,
      text: `
Nuevo mensaje de contacto

Nombre: ${data.name}
Email: ${data.email}
Mensaje:
${data.message}

Fecha: ${new Date().toLocaleString('es-ES')}
ID: ${message.id}
      `.trim()
    })

    // 2. (OPCIONAL) Email de confirmación al usuario
    await transporter.sendMail({
      from: `"${data.name}" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: '✅ Hemos recibido tu mensaje',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">¡Gracias por contactarme, ${data.name}!</h2>
          <p>He recibido tu mensaje correctamente y te responderé lo antes posible.</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #86efac;">
            <p><strong>Resumen de tu mensaje:</strong></p>
            <p style="font-style: italic;">"${data.message.substring(0, 150)}${data.message.length > 150 ? '...' : ''}"</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 8px;">
            <p><strong>📧 Mi email:</strong> ${process.env.GMAIL_USER}</p>
            <p><strong>⏱️ Tiempo de respuesta:</strong> 24-48 horas hábiles</p>
          </div>
          
          <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
            Este es un mensaje automático de confirmación. No respondas a este email.
          </p>
        </div>
      `
    })

    console.log('✅ Mensaje procesado correctamente:', {
      id: message.id,
      name: message.name,
      email: message.email,
      notificationSent: true,
      confirmationSent: true
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Mensaje enviado correctamente. Te responderé pronto.',
        id: message.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('❌ Error al procesar mensaje:', error)
    
    // Error más específico
    let errorMessage = 'Error interno del servidor'
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        errorMessage = 'Error de configuración del email. Contacta al administrador.'
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'Error de conexión. Revisa tu configuración de email.'
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}