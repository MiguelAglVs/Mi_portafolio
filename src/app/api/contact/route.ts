// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import dns from 'dns/promises'

// Lista de dominios de correo válidos (puedes expandir esta lista)
const DOMINIOS_VALIDOS = [
  // Dominios principales
  'gmail.com', 'googlemail.com',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'yahoo.com', 'ymail.com', 'rocketmail.com',
  'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me',
  'aol.com',
  'zoho.com',
  
  // Dominios corporativos comunes
  'microsoft.com', 'apple.com', 'amazon.com', 'facebook.com',
  'twitter.com', 'linkedin.com', 'github.com',
  
  // Dominios de ISP comunes
  'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net',
  'btinternet.com', 'virginmedia.com', 'sky.com',
  
  // Dominios educativos
  'edu', // Todos los .edu
  'ac.uk', // Universidades UK
  'edu.au', // Universidades Australia
];

// Lista de dominios temporales/no válidos
const DOMINIOS_INVALIDOS = [
  'admin.com', 'example.com', 'test.com', 'mailinator.com',
  'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'yopmail.com', 'dispostable.com', 'trashmail.com',
  'fakeinbox.com', 'throwawaymail.com', 'temp-mail.org',
  'getairmail.com', 'maildrop.cc', 'tempail.com',
  'sharklasers.com', 'grr.la', 'guerrillamail.info',
  'emailondeck.com', 'spam4.me', 'fake-mail.com',
];

// Función para verificar si un dominio existe y tiene registros MX
async function verificarDominio(domain: string): Promise<boolean> {
  try {
    // Verificar si el dominio es uno de los válidos conocidos
    const dominioLimpio = domain.toLowerCase();
    
    // Si termina en .edu, .ac.uk, .edu.au, etc., aceptarlo
    if (DOMINIOS_VALIDOS.some(d => dominioLimpio.endsWith(d))) {
      return true;
    }
    
    // Verificar si está en la lista de inválidos
    if (DOMINIOS_INVALIDOS.some(d => dominioLimpio.includes(d))) {
      return false;
    }
    
    // Para otros dominios, verificar registros MX
    try {
      const mxRecords = await dns.resolveMx(dominioLimpio);
      return mxRecords && mxRecords.length > 0;
    } catch (dnsError) {
      console.log(`No se encontraron registros MX para ${dominioLimpio}`);
      return false;
    }
    
  } catch (error) {
    console.error(`Error verificando dominio ${domain}:`, error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validar campos requeridos
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Limpiar y validar datos
    const nombre = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const mensaje = data.message.trim();

    if (nombre.length < 2) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    if (mensaje.length < 10) {
      return NextResponse.json(
        { error: 'El mensaje debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email no válido' },
        { status: 400 }
      );
    }

    // Extraer dominio
    const domain = email.split('@')[1];
    
    // Verificar dominio
    const dominioValido = await verificarDominio(domain);
    
    if (!dominioValido) {
      return NextResponse.json(
        { 
          error: 'Por favor, usa un email válido (Gmail, Outlook, Yahoo, etc.)' 
        },
        { status: 400 }
      );
    }

    // Verificar si el email ya ha enviado muchos mensajes recientemente (opcional, para prevenir spam)
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);
    const messagesCount = await prisma.contactMessage.count({
      where: {
        email: email,
        createdAt: {
          gte: lastHour
        }
      }
    });

    if (messagesCount >= 3) {
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
        read: false,
        domain: domain // Guardar el dominio para análisis
      }
    });

    // Configurar transporter de nodemailer
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Variables de entorno de email no configuradas');
      // Aún guardamos el mensaje en DB
      return NextResponse.json(
        { 
          success: true, 
          message: 'Mensaje recibido. Te contactaré pronto.', 
          id: message.id 
        },
        { status: 201 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Enviar email de notificación a ti
    try {
      await transporter.sendMail({
        from: `"Formulario de Contacto" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: email,
        subject: `📬 Nuevo mensaje de ${nombre} (${domain})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
              Nuevo mensaje de contacto
            </h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;">
                <strong style="color: #555;">Nombre:</strong><br>
                ${nombre}
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #555;">Email:</strong><br>
                <a href="mailto:${email}" style="color: #4F46E5; text-decoration: none;">
                  ${email}
                </a>
                <br>
                <small style="color: #666;">Dominio: ${domain}</small>
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #555;">Mensaje:</strong><br>
                <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 5px; border-left: 4px solid #4F46E5; white-space: pre-line;">
                  ${mensaje.replace(/\n/g, '<br>')}
                </div>
              </p>
              <p style="margin: 10px 0; font-size: 12px; color: #666;">
                📊 ID: ${message.id} | 📅 ${new Date().toLocaleString()}
              </p>
            </div>
            <div style="margin-top: 20px; padding: 10px; background: #e8f4fd; border-radius: 5px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>Dominio verificado:</strong> ${domain} - ${DOMINIOS_VALIDOS.some(d => domain.includes(d)) ? '✅ Dominio conocido' : '🌐 Nuevo dominio'}
              </p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error enviando email de notificación:', emailError);
      // No fallamos el proceso si el email falla
    }

    // Enviar email de confirmación al usuario
    try {
      await transporter.sendMail({
        from: `"Miguel Angel" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `✅ Confirmación: Recibí tu mensaje`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #10B981; padding-bottom: 10px;">
              ¡Gracias por contactarme, ${nombre}!
            </h2>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0; color: #555;">
                He recibido tu mensaje y te responderé en las próximas 24-48 horas.
              </p>
              <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #10B981;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                  <strong>Tu mensaje:</strong>
                </p>
                <p style="margin: 0; color: #555; white-space: pre-line;">
                  ${mensaje.length > 300 ? mensaje.substring(0, 300) + '...' : mensaje}
                </p>
              </div>
            </div>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #475569; font-size: 14px;">
                <strong>📋 Detalles del mensaje:</strong>
              </p>
              <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 13px;">
                <li>Fecha: ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                <li>Hora: ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</li>
                <li>ID de referencia: CONT-${message.id.toString().padStart(6, '0')}</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Saludos,<br>
              <strong style="color: #333;">Miguel Angel</strong><br>
              <span style="color: #4f46e5;">Desarrollador Full Stack</span>
            </p>
            
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Este es un mensaje automático. Por favor, no respondas a este correo.<br>
                Si necesitas contactarme nuevamente, usa el formulario en mi portfolio.
              </p>
            </div>
          </div>
        `
      });
    } catch (confirmationError) {
      console.error('Error enviando email de confirmación:', confirmationError);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensaje enviado correctamente', 
        id: message.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}