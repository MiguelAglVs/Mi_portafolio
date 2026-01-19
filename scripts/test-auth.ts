// scripts/test-auth.ts
import { compare } from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error'],
})

async function testAuth() {
  const email = 'admin@ejemplo.com'
  const password = 'admin123'
  
  console.log('🧪 TEST DE AUTENTICACIÓN DIRECTA')
  console.log('══════════════════════════════════════')
  
  // 1. Obtener usuario
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  console.log('👤 Usuario encontrado:', user ? '✅' : '❌')
  if (!user) {
    console.log('❌ Usuario no existe')
    return
  }
  
  console.log(`📧 Email: ${user.email}`)
  console.log(`🔑 Hash almacenado: ${user.password?.substring(0, 30)}...`)
  
  // 2. Probar bcrypt compare
  if (!user.password) {
    console.log('❌ Usuario no tiene password')
    return
  }
  
  try {
    console.log('\n🔐 Probando bcrypt compare...')
    const isValid = await compare(password, user.password)
    console.log(`✅ Resultado bcrypt.compare: ${isValid}`)
    
    if (!isValid) {
      console.log('\n💡 Posibles problemas:')
      console.log('1. La contraseña en la DB no es "admin123"')
      console.log('2. El hash está corrupto')
      console.log('3. Problema con bcrypt')
    }
    
    return isValid
    
  } catch (error: any) {
    console.log('❌ Error en bcrypt:', error.message)
    return false
  }
}

async function main() {
  const result = await testAuth()
  console.log('\n══════════════════════════════════════')
  console.log(`🎯 RESULTADO FINAL: ${result ? '✅ ÉXITO' : '❌ FALLO'}`)
  
  if (result) {
    console.log('✅ El problema está en NextAuth, no en bcrypt')
  }
}

main()
  .finally(() => prisma.$disconnect())