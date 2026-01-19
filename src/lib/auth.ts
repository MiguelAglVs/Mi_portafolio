// lib/auth.ts - VERSIÓN CORREGIDA
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcrypt"
import {prisma} from "./prisma"
import { Adapter } from "next-auth/adapters"

export const authOptions: NextAuthOptions = {
  // IMPORTANTE: Usar el adapter correctamente
  adapter: PrismaAdapter(prisma) as Adapter,
  
  session: {
    strategy: "jwt" // Usar JWT para session
  },
  
  // Configurar páginas
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/auth/new-user"
  },
  
  // Proveedor de credenciales
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "correo@ejemplo.com" 
        },
        password: { 
          label: "Contraseña", 
          type: "password" 
        }
      },
      async authorize(credentials) {
        console.log('🔐 authorize llamado con:', credentials?.email)
        
        // Validar que vengan credenciales
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Faltan credenciales')
          return null
        }

        try {
          // Buscar usuario
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            console.log('❌ Usuario no encontrado')
            return null
          }

          // Verificar contraseña
          const isValid = await compare(credentials.password, user.password || "")
          
          if (!isValid) {
            console.log('❌ Contraseña incorrecta')
            return null
          }

          console.log('✅ Login exitoso para:', user.email)
          
          // Retornar objeto de usuario (IMPORTANTE: incluir id, email, name)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image
          }
          
        } catch (error) {
          console.error('🔥 Error en authorize:', error)
          return null
        }
      }
    })
  ],
  
  // Callbacks
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log('🪙 jwt callback:', { token, user })
      
      // Agregar datos del usuario al token
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
      }
      
      return token
    },
    
    async session({ session, token }) {
      console.log('📋 session callback:', { session, token })
      
      // Agregar datos del token a la session
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
      }
      
      return session
    }
  },
  
  // Configuración adicional
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}