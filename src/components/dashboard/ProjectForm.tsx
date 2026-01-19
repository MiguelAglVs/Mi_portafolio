// src/components/dashboard/ProjectForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ProjectFormProps {
  project?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  isDialog?: boolean;
}

export default function ProjectForm({
  project,
  onSuccess,
  onCancel,
  isDialog = false,
}: ProjectFormProps) {
  const queryClient = useQueryClient();

  const [technologies, setTechnologies] = useState<string[]>(
    project?.technologies || [],
  );
  const [newTech, setNewTech] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    description: project?.description || "",
    content: project?.content || "",
    imageUrl: project?.imageUrl || "",
    githubUrl: project?.githubUrl || "",
    liveUrl: project?.liveUrl || "",
    published: project?.published || false,
    featured: project?.featured || false,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        slug: project.slug || "",
        description: project.description || "",
        content: project.content || "",
        imageUrl: project.imageUrl || "",
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        published: project.published || false,
        featured: project.featured || false,
      });
      setTechnologies(project.technologies || []);
    }
  }, [project]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const url = project?.id ? `/api/projects/${project.id}` : "/api/projects";

      const method = project?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al guardar el proyecto");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });

      toast.success(data.message || "Proyecto guardado correctamente");

      if (!project?.id) {
        setFormData({
          title: "",
          slug: "",
          description: "",
          content: "",
          imageUrl: "",
          githubUrl: "",
          liveUrl: "",
          published: false,
          featured: false,
        });
        setTechnologies([]);
      }

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al guardar el proyecto");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar que no sea base64
    if (formData.imageUrl && formData.imageUrl.startsWith("data:image")) {
      toast.error(
        "Por favor usa una URL válida, no pegues imágenes directamente",
      );
      setIsLoading(false);
      return;
    }

    const data = {
      ...formData,
      technologies: technologies,
    };

    mutation.mutate(data);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const addTechnology = () => {
    const tech = newTech.trim();
    if (tech && !technologies.includes(tech)) {
      setTechnologies([...technologies, tech]);
      setNewTech("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Validar si la URL es válida para mostrar preview
  const isValidImageUrl = (url: string) => {
    return (
      url &&
      (url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("/"))
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título del Proyecto *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Mi Proyecto Increíble"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="mi-proyecto-increible"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">
            Usa guiones bajos. Ej: mi-proyecto-react
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción Corta</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Breve descripción del proyecto..."
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido Detallado (Markdown)</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder={`# Sobre el proyecto\n\nDescribe aquí tu proyecto en detalle...\n\n## Características\n- Característica 1\n- Característica 2`}
          rows={isDialog ? 4 : 6}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          Usa Markdown para formatear el contenido
        </p>
      </div>

      {/* Sección de URLs */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de la Imagen *</Label>
            <div className="space-y-2">
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                required
                disabled={isLoading}
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ExternalLink className="h-3 w-3" />
                <span>Usa Google Drive, Imgur, etc.</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">URL de GitHub</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={handleInputChange}
              placeholder="https://github.com/usuario/proyecto"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="liveUrl">URL del Demo</Label>
            <Input
              id="liveUrl"
              name="liveUrl"
              type="url"
              value={formData.liveUrl}
              onChange={handleInputChange}
              placeholder="https://demo-proyecto.vercel.app"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Preview de la imagen */}
        {formData.imageUrl && isValidImageUrl(formData.imageUrl) && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <p className="text-sm font-medium mb-2">
              Vista previa de la imagen:
            </p>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-48 h-48 border rounded-lg overflow-hidden bg-white">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Si la imagen no carga, mostrar placeholder
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==";
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">URL de la imagen:</p>
                <div className="p-2 bg-white border rounded text-sm break-all">
                  <a
                    href={formData.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {formData.imageUrl}
                  </a>
                </div>
                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <p>
                    <strong>Consejos:</strong>
                  </p>
                  <p>
                    • <strong>Google Drive:</strong> Cambia "view" por "preview"
                    en la URL
                  </p>
                  <p>
                    • <strong>Imgur:</strong> Usa el enlace directo a la imagen
                  </p>
                  <p>
                    • <strong>Cloudinary:</strong> URL directa a la imagen
                  </p>
                  <p>
                    • <strong>Assets del proyecto:</strong> Guarda en /public y
                    usa /ruta/imagen.jpg
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de error si es base64 */}
        {formData.imageUrl && formData.imageUrl.startsWith("data:image") && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800">
              ⚠️ Error en la URL de la imagen
            </p>
            <p className="text-sm text-red-600 mt-1">
              Has pegado una imagen directamente. Por favor:
            </p>
            <ul className="text-sm text-red-600 mt-2 space-y-1 list-disc list-inside">
              <li>Sube la imagen a Google Drive, Imgur o similar</li>
              <li>Obtén el enlace directo a la imagen</li>
              <li>Pega la URL en el campo de arriba</li>
            </ul>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
              className="mt-2 text-sm text-red-800 font-medium hover:underline"
            >
              Limpiar campo
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label>Tecnologías</Label>
        <div className="flex gap-2">
          <Input
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            placeholder="Ej: React, Next.js, TypeScript"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTechnology();
              }
            }}
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={addTechnology}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="gap-1">
              {tech}
              <button
                type="button"
                onClick={() => removeTechnology(tech)}
                className="ml-1 hover:text-red-500"
                disabled={isLoading}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <Label htmlFor="published" className="font-medium">
              Publicado
            </Label>
            <p className="text-xs text-gray-500">
              Visible en el portfolio público
            </p>
          </div>
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) =>
              handleSwitchChange("published", checked)
            }
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <Label htmlFor="featured" className="font-medium">
              Destacado
            </Label>
            <p className="text-xs text-gray-500">
              Mostrar en la página principal
            </p>
          </div>
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) =>
              handleSwitchChange("featured", checked)
            }
            disabled={isLoading}
          />
        </div>
      </div>

      <div
        className={`flex gap-3 ${isDialog ? "justify-end" : "pt-6 border-t"}`}
      >
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {project?.id ? "Actualizar Proyecto" : "Crear Proyecto"}
        </Button>
      </div>
    </form>
  );
}
