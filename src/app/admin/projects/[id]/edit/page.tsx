// src/app/admin/projects/[id]/edit/page.tsx (Editar)
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProjectForm from '@/components/dashboard/ProjectForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/projects/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Proyecto no encontrado')
        }
        
        const data = await response.json()
        setProject(data.project)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar proyecto')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Cargando proyecto...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="mb-6">{error}</p>
        <Button onClick={() => router.push('/admin/projects')}>
          Volver a proyectos
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Editar Proyecto</CardTitle>
          <CardDescription>
            Modifica los campos del proyecto y guarda los cambios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm project={project} />
        </CardContent>
      </Card>
    </div>
  )
}