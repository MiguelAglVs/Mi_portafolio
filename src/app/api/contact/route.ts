// src/app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import dns from 'dns/promises'
import net from 'net'

async function emailExiste(email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1]
    const mx = await dns.resolveMx(domain)
    if (!mx || mx.length === 0) return false

    const mxHost = mx.sort((a, b) => a.priority - b.priority)[0].exchange

    return await new Promise<boolean>((resolve) => {
      const socket = net.createConnection(25, mxHost)
      let step = 0

      socket.setTimeout(8000)

      socket.on('data', (data) => {
        const response = data.toString()

        if (step === 0 && response.startsWith('220')) {
          socket.write(`HELO ${domain}\r\n`)
          step++
        } else if (step === 1 && response.startsWith('250')) {
          socket.write(`MAIL FROM:<test@${domain}>\r\n`)
          step++
        } else if (step === 2 && response.startsWith('250')) {
          socket.write(`RCPT TO:<${email}>\r\n`)
          step++
        } else if (step === 3) {
          socket.end()
          resolve(response.startsWith('250'))
        }
      })

      socket.on('error', () => resolve(false))
      socket.on('timeout', () => {
        socket.destroy()
        resolve(false)
      })
    })
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

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

    const valido = await emailExiste(data.email)
    if (!valido) {
      return NextResponse.json(
        { error: 'El correo no existe o no puede recibir mensajes' },
        { status: 400 }
      )
    }

    const message = await prisma.contactMessage.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
        read: false
      }
    })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })

    try {
      await transporter.sendMail({
        from: `"Formulario de Contacto" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: data.email,
        subject: `📬 Nuevo mensaje de ${data.name}`,
        html: `
          <h2>Nuevo mensaje</h2>
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        `
      })
    } catch {
      return NextResponse.json(
        { error: 'El mensaje se guardó pero no se pudo enviar el correo' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Mensaje enviado correctamente', id: message.id },
      { status: 201 }
    )

  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}