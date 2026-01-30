// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

// Lista de dominios válidos (proveedores principales REALES)
const PROVEEDORES_VALIDOS = [
  // Google
  'gmail.com', 'googlemail.com',
  // Microsoft
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  // Yahoo
  'yahoo.com', 'ymail.com', 'rocketmail.com',
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  // Otros reales
  'protonmail.com', 'proton.me', 'tutanota.com', 'tuta.io',
  'aol.com', 'zoho.com', 'mail.com', 'gmx.com', 'gmx.net',
  'yandex.com', 'yandex.ru', 'mail.ru', 'bk.ru', 'list.ru',
  'inbox.ru', 'rambler.ru'
];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validaciones básicas
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
        { error: 'Formato de email no válido' },
        { status: 400 }
      )
    }

    // Validar nombre
    const nombre = data.name.trim();
    if (nombre.length < 2) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    if (nombre.length > 100) {
      return NextResponse.json(
        { error: 'El nombre es demasiado largo (máximo 100 caracteres)' },
        { status: 400 }
      );
    }

    // Validar mensaje
    const mensaje = data.message.trim();
    if (mensaje.length < 10) {
      return NextResponse.json(
        { error: 'El mensaje debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    if (mensaje.length > 2000) {
      return NextResponse.json(
        { error: 'El mensaje es demasiado largo (máximo 2000 caracteres)' },
        { status: 400 }
      );
    }

    // Validar email: DEBE SER DE UN PROVEEDOR VÁLIDO
    const email = data.email.trim().toLowerCase();
    const dominio = email.split('@')[1];
    
    if (!dominio) {
      return NextResponse.json(
        { error: 'Email no válido' },
        { status: 400 }
      );
    }

    // Verificar si el dominio está en la lista de proveedores válidos
    if (!PROVEEDORES_VALIDOS.includes(dominio)) {
      return NextResponse.json(
        { 
          error: 'Por favor, usa un email de un proveedor válido como Gmail, Outlook, Yahoo, etc.' 
        },
        { status: 400 }
      );
    }

    // Prevenir spam: verificar límite de mensajes por hora
    const unaHoraAtras = new Date(Date.now() - 60 * 60 * 1000);
    const mensajesRecientes = await prisma.contactMessage.count({
      where: {
        email: email,
        createdAt: {
          gte: unaHoraAtras
        }
      }
    });

    if (mensajesRecientes >= 3) {
      return NextResponse.json(
        { error: 'Has enviado muchos mensajes recientemente. Por favor, espera un momento.' },
        { status: 429 }
      );
    }

    // Guardar en base de datos
    const message = await prisma.contactMessage.create({
      data: {
        name: nombre,
        email: email,
        message: mensaje,
        read: false
      }
    })

    console.log(`✅ Mensaje recibido de: ${nombre} <${email}>`);

    // Verificar que las variables de entorno estén configuradas
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('⚠️ Mensaje guardado pero email no enviado (credenciales faltantes)');
      
      return NextResponse.json(
        {
          success: true,
          message: 'Mensaje recibido. Te contactaré pronto.',
          id: message.id
        },
        { status: 201 }
      )
    }

    // Configurar Nodemailer con Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      }
    })

    // 1. Email para ti (notificación)
    try {
      await transporter.sendMail({
        from: `"Formulario de Contacto" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: email,
        subject: `📬 Nuevo mensaje de ${nombre} (${dominio})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">
              Nuevo mensaje de contacto
            </h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="background: #3b82f6; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 18px;">
                  ${nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style="margin: 0; color: #1e293b;">${nombre}</h3>
                  <p style="margin: 5px 0 0 0; color: #64748b;">
                    <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                  </p>
                </div>
              </div>
              
              <div style="margin-top: 15px;">
                <h4 style="color: #475569; margin: 0 0 10px 0; font-size: 16px;">Mensaje:</h4>
                <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-line;">
                    ${mensaje.replace(/\n/g, '<br>')}
                  </p>
                </div>
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px;">
              <p style="margin: 0 0 10px 0; color: #475569; font-weight: 500;">
                Información:
              </p>
              <table style="width: 100%; font-size: 12px; color: #64748b;">
                <tr>
                  <td style="padding: 3px 0;">ID:</td>
                  <td style="padding: 3px 0; font-family: monospace;">${message.id}</td>
                </tr>
                <tr>
                  <td style="padding: 3px 0;">Fecha:</td>
                  <td style="padding: 3px 0;">${new Date().toLocaleString('es-ES')}</td>
                </tr>
                <tr>
                  <td style="padding: 3px 0;">Proveedor:</td>
                  <td style="padding: 3px 0;">
                    <span style="color: #10b981; font-weight: 500;">
                      ${dominio} ✅
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="margin-top: 25px; text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 25px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Responder ahora
              </a>
            </div>
          </div>
        `,
        text: `
NUEVO MENSAJE DE CONTACTO

Nombre: ${nombre}
Email: ${email}
Proveedor: ${dominio} ✅

MENSAJE:
${mensaje}

INFORMACIÓN:
• ID: ${message.id}
• Fecha: ${new Date().toLocaleString('es-ES')}

────────────────────────────
Responder a: ${email}
        `.trim()
      });
      
      console.log('✅ Email de notificación enviado');
    } catch (emailError) {
      console.error('❌ Error enviando email de notificación:', emailError);
    }

    // 2. Email de confirmación al usuario
    try {
      await transporter.sendMail({
        from: `"Miguel Angel" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `✅ Confirmación: Recibí tu mensaje, ${nombre}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 25px;">
              <div style="width: 60px; height: 60px; background: #10b981; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                <span style="color: white; font-size: 24px;">✓</span>
              </div>
              <h1 style="color: #047857; margin: 0 0 10px 0; font-size: 24px;">
                ¡Mensaje recibido!
              </h1>
              <p style="color: #64748b; font-size: 16px;">
                Hola <strong style="color: #1e293b;">${nombre}</strong>,<br>
                he recibido tu mensaje correctamente.
              </p>
            </div>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #86efac; margin-bottom: 25px;">
              <h2 style="color: #065f46; margin: 0 0 15px 0; font-size: 18px;">
                Resumen de tu mensaje
              </h2>
              
              <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #10b981;">
                <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-line; font-style: italic;">
                  "${mensaje.length > 200 ? mensaje.substring(0, 200) + '...' : mensaje}"
                </p>
              </div>
            </div>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
              <h3 style="color: #334155; margin: 0 0 10px 0; font-size: 16px;">¿Qué pasa ahora?</h3>
              <div style="display: flex; align-items: flex-start; margin-bottom: 10px;">
                <div style="background: #3b82f6; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 10px; flex-shrink: 0;">1</div>
                <div>
                  <p style="margin: 0 0 3px 0; color: #1e293b; font-size: 14px;">Revisaré tu mensaje</p>
                  <p style="margin: 0; color: #64748b; font-size: 12px;">Analizaré tu propuesta o consulta.</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; margin-bottom: 10px;">
                <div style="background: #8b5cf6; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 10px; flex-shrink: 0;">2</div>
                <div>
                  <p style="margin: 0 0 3px 0; color: #1e293b; font-size: 14px;">Prepararé una respuesta</p>
                  <p style="margin: 0; color: #64748b; font-size: 12px;">Te enviaré una respuesta detallada.</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <div style="background: #10b981; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 10px; flex-shrink: 0;">3</div>
                <div>
                  <p style="margin: 0 0 3px 0; color: #1e293b; font-size: 14px;">Mantente atento</p>
                  <p style="margin: 0; color: #64748b; font-size: 12px;">Revisa tu correo en los próximos días.</p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px;">
                Este es un mensaje automático de confirmación.<br>
                No respondas directamente a este email.
              </p>
              
              <div style="display: inline-flex; gap: 10px;">
                <a href="mailto:${process.env.GMAIL_USER}" style="display: inline-block; background: #3b82f6; color: white; padding: 8px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                  Contactar nuevamente
                </a>
              </div>
              
              <p style="margin: 20px 0 0 0; color: #94a3b8; font-size: 12px;">
                ID: CONT-${message.id.toString().padStart(6, '0')}<br>
                Fecha: ${new Date().toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        `,
        text: `
CONFIRMACIÓN DE RECEPCIÓN

¡Hola ${nombre}!

✅ He recibido tu mensaje correctamente.

RESUMEN DE TU MENSAJE:
"${mensaje.length > 200 ? mensaje.substring(0, 200) + '...' : mensaje}"

DETALLES:
• Remitente: ${nombre} <${email}>
• Fecha de recepción: ${new Date().toLocaleString('es-ES')}
• ID de referencia: CONT-${message.id.toString().padStart(6, '0')}

PROCESO:
1. Revisaré tu mensaje detenidamente
2. Prepararé una respuesta específica para ti
3. Te enviaré mi respuesta a este mismo email

TIEMPO DE RESPUESTA:
Normalmente respondo en 24-48 horas hábiles.

MI EMAIL PARA CONTACTO:
${process.env.GMAIL_USER}

────────────────────────────
Este es un mensaje automático de confirmación.
No respondas directamente a este email.

Saludos,
Miguel Angel
        `.trim()
      });
      
      console.log('✅ Email de confirmación enviado a:', email);
    } catch (confirmationError) {
      console.error('❌ Error enviando email de confirmación:', confirmationError);
    }

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
    
    let errorMessage = 'Error interno del servidor'
    
    if (error instanceof Error) {
      if (error.message.includes('Unknown argument')) {
        errorMessage = 'Error en el sistema. Por favor, contacta al administrador.';
      } else if (error.message.includes('Invalid') || error.message.includes('valid')) {
        errorMessage = error.message;
      } else if (error.message.includes('prisma') || error.message.includes('database')) {
        errorMessage = 'Error en la base de datos. Por favor, intenta más tarde.';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}