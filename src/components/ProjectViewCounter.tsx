"use client"

import { useEffect, useRef } from "react"

interface Props {
  slug: string
}

export default function ProjectViewCounter({ slug }: Props) {
  const countedRef = useRef(false)

  useEffect(() => {
    if (countedRef.current) return
    countedRef.current = true

    fetch(`/api/projects/views/${slug}`, {
      method: "POST"
    }).catch(() => {})
  }, [slug])

  return null
}
