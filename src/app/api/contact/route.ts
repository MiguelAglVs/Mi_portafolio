// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import dns from 'dns/promises'

// Función mejorada para validar emails
async function validarEmail(email: string): Promise<boolean> {
  try {
    // 1. Validación básica de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return false
    }

    // 2. Extraer dominio
    const domain = email.split('@')[1]
    
    // 3. Verificar si el dominio tiene registros MX
    let mxRecords
    try {
      mxRecords = await dns.resolveMx(domain)
    } catch {
      return false
    }
    
    if (!mxRecords || mxRecords.length === 0) {
      return false
    }

    // 4. En producción, no intentamos conexión SMTP directa
    // En su lugar, confiamos en la validación MX y dejamos que nodemailer maneje los errores
    // Las conexiones SMTP directas son bloqueadas en muchos entornos serverless
    
    return true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar campos requeridos
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Email no válido' },
        { status: 400 }
      )
    }

    // Validar email (versión simplificada para producción)
    const emailValido = await validarEmail(data.email)
    if (!emailValido) {
      // En producción, podemos ser más permisivos con esta validación
      // ya que muchos proveedores bloquean verificaciones SMTP
      console.log(`Email ${data.email} no pasó validación MX, pero continuamos...`)
      // No retornamos error, continuamos con el proceso
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

    // Configurar transporter de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })

    // Enviar email de notificación
    try {
      await transporter.sendMail({
        from: `"Formulario de Contacto" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: data.email,
        subject: `📬 Nuevo mensaje de ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
              Nuevo mensaje de contacto
            </h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;">
                <strong style="color: #555;">Nombre:</strong><br>
                ${data.name}
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #555;">Email:</strong><br>
                <a href="mailto:${data.email}" style="color: #4F46E5; text-decoration: none;">
                  ${data.email}
                </a>
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #555;">Mensaje:</strong><br>
                <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 5px; border-left: 4px solid #4F46E5;">
                  ${data.message.replace(/\n/g, '<br>')}
                </div>
              </p>
            </div>
            <p style="color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
              Este mensaje fue enviado desde el formulario de contacto de tu portfolio.
            </p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Error enviando email:', emailError)
      // No fallamos el proceso completo si el email no se puede enviar
      // Solo registramos el error pero continuamos
    }

    // También enviar email de confirmación al usuario (opcional)
    try {
      await transporter.sendMail({
        from: `"Miguel Angel" <${process.env.GMAIL_USER}>`,
        to: data.email,
        subject: `✅ Confirmación: Recibí tu mensaje`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #10B981; padding-bottom: 10px;">
              ¡Gracias por contactarme!
            </h2>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0; color: #555;">
                Hola <strong>${data.name}</strong>,
              </p>
              <p style="margin: 10px 0; color: #555;">
                He recibido tu mensaje y te responderé en las próximas 24-48 horas.
              </p>
              <p style="margin: 10px 0; color: #555;">
                <strong>Resumen de tu mensaje:</strong><br>
                <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 5px; border-left: 4px solid #10B981;">
                  ${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}
                </div>
              </p>
            </div>
            <div style="background: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #6B7280;">
              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                <strong>Nota:</strong> Esta es una confirmación automática. Si necesitas agregar algo más a tu mensaje, 
                simplemente responde a este correo.
              </p>
            </div>
            <p style="color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
              Saludos,<br>
              <strong>Miguel Angel</strong><br>
              <a href="https://tudominio.com" style="color: #4F46E5; text-decoration: none;">tudominio.com</a>
            </p>
          </div>
        `
      })
    } catch (confirmationError) {
      console.error('Error enviando email de confirmación:', confirmationError)
      // Solo registramos el error
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensaje enviado correctamente', 
        id: message.id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en contacto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}