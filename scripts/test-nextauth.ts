// scripts/test-nextauth.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error'],
})

async function testNextAuthFlow() {
  console.log('🧪 TESTING NEXTAUTH FLOW')
  console.log('══════════════════════════════════════')
  
  // Simular el authorize function
  const authorize = async (credentials: any) => {
    console.log('\n1. 📥 Credenciales recibidas:', credentials)
    
    if (!credentials?.email || !credentials?.password) {
      console.log('❌ Faltan credenciales')
      return null
    }

    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    })

    console.log('2. 👤 Usuario de DB:', user ? 'Encontrado' : 'No encontrado')
    
    if (!user || !user.password) {
      console.log('❌ Usuario no encontrado')
      return null
    }

    const isValid = await compare(credentials.password, user.password)
    console.log(`3. 🔐 Bcrypt compare: ${isValid}`)

    if (!isValid) {
      console.log('❌ Contraseña incorrecta')
      return null
    }

    console.log('4. ✅ Usuario autorizado')
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  }

  // Probar con credenciales correctas
  console.log('\n🔐 CASO 1: Credenciales correctas')
  const user1 = await authorize({
    email: 'admin@ejemplo.com',
    password: 'admin123'
  })
  console.log('Resultado:', user1 ? '✅ Éxito' : '❌ Fallo')

  // Probar con credenciales incorrectas
  console.log('\n🔐 CASO 2: Credenciales incorrectas')
  const user2 = await authorize({
    email: 'admin@ejemplo.com',
    password: 'wrongpassword'
  })
  console.log('Resultado:', user2 ? '✅ Éxito' : '❌ Fallo')

  // Probar con email incorrecto
  console.log('\n🔐 CASO 3: Email incorrecto')
  const user3 = await authorize({
    email: 'wrong@email.com',
    password: 'admin123'
  })
  console.log('Resultado:', user3 ? '✅ Éxito' : '❌ Fallo')
}

testNextAuthFlow()
  .catch(console.error)
  .finally(() => prisma.$disconnect())