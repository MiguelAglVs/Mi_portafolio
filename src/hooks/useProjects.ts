'use client'

import { useQuery } from '@tanstack/react-query'

// Hook para obtener proyectos
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('🔄 Hook: Fetching projects from /api/projects...')

      try {
        const response = await fetch('/api/projects', {
          headers: {
            'Cache-Control': 'no-cache' // Desactiva cache para debugging
          }
        })

        console.log('📥 Hook: Response status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Hook: Error response:', errorText)
          throw new Error(`Error ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        console.log(`✅ Hook: ${data.length} proyectos recibidos`)
        return data

      } catch (error) {
        console.error('🔥 Hook: Fetch error:', error)
        throw error
      }
    },
    retry: 1, // Solo reintentar una vez
    staleTime: 30 * 1000, // 30 segundos
  })
}