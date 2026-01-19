// scripts/create-admin-proper.ts
import { hash } from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error'],
})

async function main() {
  const adminEmail = 'admin@ejemplo.com'
  const adminPassword = 'admin123'
  
  console.log('🎯 CREANDO USUARIO ADMINISTRADOR')
  console.log('══════════════════════════════════════')
  
  // 1. Primero, verificar si la tabla User existe
  try {
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'User'
      )
    `
    console.log('📊 Tabla User existe:', tableExists)
  } catch (error: any) {
    console.log('⚠️  Error verificando tabla:', error.message)
  }
  
  // 2. Listar todos los usuarios existentes
  try {
    const users = await prisma.user.findMany()
    console.log(`👥 Usuarios existentes: ${users.length}`)
    users.forEach((user: { email: any; name: any }) => {
      console.log(`   - ${user.email} (${user.name})`)
    })
  } catch (error: any) {
    console.log('⚠️  Error listando usuarios:', error.message)
  }
  
  // 3. Verificar si el usuario ya existe
  console.log('\n🔍 Buscando usuario admin...')
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingUser) {
    console.log('✅ Usuario admin YA EXISTE')
    console.log(`📧 Email: ${existingUser.email}`)
    console.log(`👤 Nombre: ${existingUser.name}`)
    console.log(`🔑 Password: ${existingUser.password?.substring(0, 30)}...`)
    console.log(`📏 Longitud password: ${existingUser.password?.length || 0}`)
    return
  }

  // 4. Crear nuevo usuario
  console.log('\n🔄 Creando nuevo usuario admin...')
  
  try {
    const hashedPassword = await hash(adminPassword, 12)
    console.log(`🔐 Hash generado: ${hashedPassword.substring(0, 30)}...`)
    
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrador',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('\n✅ USUARIO CREADO EXITOSAMENTE!')
    console.log('══════════════════════════════════════')
    console.log(`🆔 ID: ${user.id}`)
    console.log(`📧 Email: ${user.email}`)
    console.log(`👤 Nombre: ${user.name}`)
    console.log(`🎯 Rol: ${user.role}`)
    console.log(`🔑 Contraseña: ${adminPassword}`)
    console.log(`🔐 Hash (primeros 30 chars): ${hashedPassword.substring(0, 30)}...`)
    console.log(`📏 Longitud hash: ${hashedPassword.length}`)
    console.log('══════════════════════════════════════')
    
    // 5. Verificar que se puede recuperar
    console.log('\n🧪 Verificación...')
    const verifiedUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    console.log('Usuario recuperado:', verifiedUser ? '✅' : '❌')
    if (verifiedUser) {
      console.log('Hash empieza con $2 (bcrypt):', verifiedUser.password?.startsWith('$2') ? '✅' : '❌')
    }
    
  } catch (error: any) {
    console.error('\n❌ ERROR CREANDO USUARIO:', error.message)
    
    if (error.code === 'P2021') {
      console.log('\n💡 La tabla User no existe. Ejecuta:')
      console.log('   npx prisma migrate dev --name init')
      console.log('   npx prisma db push')
    } else if (error.code === 'P2003') {
      console.log('\n💡 Error de relación. Verifica tu schema.prisma')
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })