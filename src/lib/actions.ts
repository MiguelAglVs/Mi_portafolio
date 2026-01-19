// src/lib/actions.ts
'use server'

import { prisma } from '@/lib/prisma'

export async function incrementViews(projectId: string) {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data: {
        views: {
          increment: 1,
        },
      },
    })
  } catch (error) {
    console.error('Error incrementando vistas:', error)
  }
}