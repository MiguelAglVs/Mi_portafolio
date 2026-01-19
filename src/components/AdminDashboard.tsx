"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  MessageSquare,
  Eye,
  EyeOff,
  Star,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Mail,
  CheckCircle,
} from "lucide-react";
import ProjectForm from "./dashboard/ProjectForm";
import { toast } from "sonner";

// Tipos para los datos
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  published: boolean;
  featured: boolean;
  technologies: string[];
  views: number;
  createdAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AdminStats {
  totalProjects: number;
  publishedProjects: number;
  totalMessages: number;
  unreadMessages: number;
}

interface AdminDashboardProps {
  projects: Project[];
  messages: ContactMessage[];
  stats: AdminStats;
}

export default function AdminDashboard({
  projects,
  messages,
  stats,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "messages"
  >("overview");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);
  const [localMessages, setLocalMessages] =
    useState<ContactMessage[]>(messages);
  const [localStats, setLocalStats] = useState<AdminStats>(stats);

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Función para marcar mensaje como leído
  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        // Actualizar estado local del mensaje
        setLocalMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, read: true } : msg,
          ),
        );

        // Actualizar estadísticas
        setLocalStats((prevStats) => ({
          ...prevStats,
          unreadMessages: Math.max(0, prevStats.unreadMessages - 1),
        }));

        toast.success("Mensaje marcado como leído");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al marcar como leído");
      }
    } catch (error) {
      console.error("Error marcando mensaje como leído:", error);
      toast.error("Error de conexión al marcar como leído");
    }
  };

  // Función para marcar mensaje como no leído
  const markAsUnread = async (messageId: string) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: false }),
      });

      if (response.ok) {
        // Actualizar estado local
        setLocalMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, read: false } : msg,
          ),
        );

        // Actualizar estadísticas
        setLocalStats((prevStats) => ({
          ...prevStats,
          unreadMessages: prevStats.unreadMessages + 1,
        }));

        toast.success("Mensaje marcado como no leído");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al cambiar estado");
      }
    } catch (error) {
      console.error("Error cambiando estado del mensaje:", error);
      toast.error("Error de conexión");
    }
  };

  // Función para eliminar proyecto
  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Actualizar estado local
        const deletedProject = localProjects.find((p) => p.id === projectId);
        setLocalProjects((prev) => prev.filter((p) => p.id !== projectId));

        // Actualizar estadísticas
        setLocalStats((prev) => ({
          ...prev,
          totalProjects: prev.totalProjects - 1,
          publishedProjects: deletedProject?.published
            ? prev.publishedProjects - 1
            : prev.publishedProjects,
        }));

        toast.success("Proyecto eliminado correctamente");
        setIsDeleteDialogOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al eliminar proyecto");
      }
    } catch (error) {
      console.error("Error eliminando proyecto:", error);
      toast.error("Error al eliminar proyecto");
    }
  };

  // Función para alternar estado de publicación
  const togglePublishStatus = async (
    projectId: string,
    currentStatus: boolean,
  ) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        // Actualizar estado local
        setLocalProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, published: !currentStatus } : p,
          ),
        );

        // Actualizar estadísticas
        setLocalStats((prev) => ({
          ...prev,
          publishedProjects: currentStatus
            ? prev.publishedProjects - 1
            : prev.publishedProjects + 1,
        }));

        toast.success(
          currentStatus
            ? "Proyecto ocultado correctamente"
            : "Proyecto publicado correctamente",
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al actualizar proyecto");
      }
    } catch (error) {
      console.error("Error actualizando proyecto:", error);
      toast.error("Error al actualizar proyecto");
    }
  };

  // Función para abrir diálogo de edición
  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  // Función para abrir diálogo de creación
  const handleCreateClick = () => {
    setSelectedProject(null);
    setIsCreateDialogOpen(true);
  };

  // Función cuando se cierra el diálogo de creación
  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    setSelectedProject(null);
  };

  // Función cuando se cierra el diálogo de edición
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedProject(null);
  };

  // Función cuando se guarda exitosamente
  const handleFormSuccess = () => {
    // Recargar la página para ver los cambios
    window.location.reload();
  };

  return (
    <div className="space-y-6 py-6 px-6">
      {/* Header */}
      <div className="flex justify-between items-center">

        {/* Diálogo para CREAR proyecto */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
              <DialogDescription>
                Completa todos los campos para agregar un nuevo proyecto a tu
                portfolio
              </DialogDescription>
            </DialogHeader>
            <ProjectForm
              project={null} // Sin proyecto = modo creación
              onSuccess={handleFormSuccess}
              onCancel={handleCreateDialogClose}
              isDialog={true}
            />
          </DialogContent>
        </Dialog>

        {/* Diálogo para EDITAR proyecto */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Proyecto</DialogTitle>
              <DialogDescription>
                Modifica los campos del proyecto y guarda los cambios
              </DialogDescription>
            </DialogHeader>
            {selectedProject && (
              <ProjectForm
                project={selectedProject} // Con proyecto = modo edición
                onSuccess={handleFormSuccess}
                onCancel={handleEditDialogClose}
                isDialog={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "overview" | "projects" | "messages")
        }
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 g">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 size={16} /> Resumen
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Package size={16} /> Proyectos ({localProjects.length})
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare size={16} /> Mensajes ({localMessages.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab Resumen */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Proyectos Recientes */}
            <Card>
              <CardHeader>
                <CardTitle>Proyectos Recientes</CardTitle>
                <CardDescription>
                  Los últimos proyectos agregados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localProjects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-800"
                    >
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-gray-500">
                          /{project.slug}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.featured && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Star size={12} /> Destacado
                          </Badge>
                        )}
                        <Badge
                          variant={project.published ? "default" : "secondary"}
                        >
                          {project.published ? "Publicado" : "Borrador"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mensajes Recientes */}
            <Card>
              <CardHeader>
                <CardTitle>Mensajes Recientes</CardTitle>
                <CardDescription>
                  Últimos mensajes de contacto recibidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localMessages.slice(0, 5).map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 border rounded-lg  hover:bg-gray-800 ${
                        !message.read ? "bg-black-50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{message.name}</div>
                          <div className="text-sm text-gray-500">
                            {message.email}
                          </div>
                        </div>
                        {!message.read && (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800"
                          >
                            Nuevo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm mt-2 line-clamp-2">
                        {message.message}
                      </p>
                      <div className="text-xs text-gray-400 mt-2">
                        {formatDate(message.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Proyectos */}
        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestión de Proyectos</CardTitle>
                <CardDescription>
                  Administra todos tus proyectos desde aquí
                </CardDescription>
              </div>
              <Button
                className="flex items-center gap-2"
                onClick={handleCreateClick}
              >
                <Plus size={16} />
                Nuevo Proyecto
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Tecnologías</TableHead>
                    <TableHead>Vistas</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-gray-800">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{project.title}</span>
                          <span className="text-xs text-gray-500">
                            /{project.slug}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={
                              project.published ? "default" : "secondary"
                            }
                            className="w-fit"
                          >
                            {project.published ? (
                              <span className="flex items-center gap-1">
                                <Eye size={12} /> Publicado
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <EyeOff size={12} /> Borrador
                              </span>
                            )}
                          </Badge>
                          {project.featured && (
                            <Badge variant="outline" className="w-fit">
                              <Star size={12} className="mr-1" /> Destacado
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{project.views}</span>
                      </TableCell>
                      <TableCell>{formatDate(project.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              togglePublishStatus(project.id, project.published)
                            }
                          >
                            {project.published ? (
                              <>
                                <EyeOff size={14} className="mr-1" />
                                Ocultar
                              </>
                            ) : (
                              <>
                                <Eye size={14} className="mr-1" />
                                Publicar
                              </>
                            )}
                          </Button>

                          {/* Botón Editar */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(project)}
                          >
                            <Edit size={14} />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedProject(project);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {localProjects.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No hay proyectos aún</p>
                  <p className="text-sm">
                    <Button
                      variant="link"
                      onClick={handleCreateClick}
                      className="p-0 h-auto"
                    >
                      Crea tu primer proyecto
                    </Button>{" "}
                    para comenzar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Mensajes */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Mensajes de Contacto</CardTitle>
              <CardDescription>Gestiona los mensajes recibidos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estado</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localMessages.map((message) => (
                    <TableRow
                      key={message.id}
                      className={`hover:bg-gray-800 ${
                        !message.read ? "bg-gray" : ""
                      }`}
                    >
                      <TableCell>
                        {message.read ? (
                          <Badge variant="outline" className="bg-gray-800">
                            <CheckCircle size={12} className="mr-1" /> Leído
                          </Badge>
                        ) : (
                          <Badge variant="default" className="bg-blue-600">
                            <Mail size={12} className="mr-1" /> Nuevo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {message.name}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${message.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {message.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          <p className="line-clamp-2">{message.message}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(message.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!message.read ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(message.id)}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle size={14} />
                              Marcar como leído
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="flex items-center gap-1"
                            >
                              <CheckCircle size={14} />
                              Leído
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {localMessages.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare
                    size={48}
                    className="mx-auto mb-4 opacity-50"
                  />
                  <p className="text-lg font-medium">No hay mensajes aún</p>
                  <p className="text-sm">Los mensajes aparecerán aquí</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Confirmación para Eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar proyecto?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="p-4 border rounded-lg bg-black-50 mb-4">
              <p className="font-medium">{selectedProject.title}</p>
              <p className="text-sm text-gray-500 mt-1">
                Creado el {formatDate(selectedProject.createdAt)}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedProject.technologies.slice(0, 5).map((tech, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedProject(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedProject) {
                  deleteProject(selectedProject.id);
                }
              }}
            >
              <Trash2 size={16} className="mr-2" />
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
