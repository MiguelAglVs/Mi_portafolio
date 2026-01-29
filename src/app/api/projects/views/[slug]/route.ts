import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  if (!slug) {
    return NextResponse.json(
      { error: "Slug no proporcionado" },
      { status: 400 }
    )
  }

  const project = await prisma.project.update({
    where: { slug },
    data: {
      views: {
        increment: 1
      }
    },
    select: {
      views: true
    }
  })

  return NextResponse.json({ views: project.views })
}
