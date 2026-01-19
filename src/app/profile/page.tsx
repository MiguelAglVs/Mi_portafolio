"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    imageUrl: "",
  });

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Cargar datos del usuario cuando haya sesión
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      loadProfileData();
    }
  }, [status, session]);

  const loadProfileData = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const userData = await response.json();
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          imageUrl: userData.image || "",
        });
      }
    } catch (error) {
      console.error("Error cargando datos del perfil:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileData.name.trim(),
          imageUrl: profileData.imageUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar perfil");
      }

      // Actualizar la sesión
      await update({
        ...session,
        user: {
          ...session?.user,
          name: profileData.name.trim(),
          image: profileData.imageUrl.trim(),
        },
      });

      setSuccess("Perfil actualizado correctamente");

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      setError(error.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const validateImageUrl = (url: string) => {
    if (!url) return true; // URL vacía es válida (usará avatar por defecto)

    try {
      const urlObj = new URL(url);
      // Verificar que sea una URL HTTP/HTTPS
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        return false;
      }
      // Verificar extensiones comunes de imagen
      const validExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];
      const hasValidExtension = validExtensions.some((ext) =>
        url.toLowerCase().endsWith(ext),
      );

      // También aceptar URLs que no terminen con extensión (pueden ser de CDNs)
      return (
        hasValidExtension ||
        url.includes("/image/") ||
        url.includes("/photo/") ||
        url.includes("/avatar/")
      );
    } catch {
      return false; // No es una URL válida
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const getUserInitials = () => {
    if (!session?.user?.name) return "U";
    return session.user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isImageUrlValid = validateImageUrl(profileData.imageUrl);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Botón de volver */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Vista previa del perfil */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-lg">
                    {profileData.imageUrl && isImageUrlValid ? (
                      <AvatarImage
                        src={profileData.imageUrl}
                        alt={session.user.name || "Usuario"}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">
                  {profileData.name || "Usuario"}
                </CardTitle>
                <CardDescription className="flex justify-center mt-2">
                  <Badge variant="outline" className="capitalize">
                    {session.user.role?.toLowerCase() || "usuario"}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="font-medium truncate">
                        {profileData.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>Esta es la vista previa de cómo se verá tu perfil</p>
                  </div>

                  {/* Botón para panel admin (solo visible para ADMIN) */}
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" className="block w-full">
                      <Button
                        variant="default"
                        className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Ir al panel de administración
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Editar perfil */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Editar Perfil</CardTitle>
                <CardDescription>
                  Actualiza tu información personal y foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">
                      Información Personal
                    </TabsTrigger>
                    <TabsTrigger value="image">Foto de Perfil</TabsTrigger>
                  </TabsList>

                  {/* Pestaña de Información Personal */}
                  <TabsContent value="profile" className="space-y-6 pt-6">
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Error</p>
                          <p className="text-xs">{error}</p>
                        </div>
                      </div>
                    )}

                    {success && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">¡Éxito!</p>
                          <p className="text-xs">{success}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre completo</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Tu nombre"
                              className="pl-10"
                              value={profileData.name}
                              onChange={handleChange}
                              required
                              autoComplete="name"
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Este nombre aparecerá cuando envíes mensajes de
                            contacto
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              className="pl-10 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                              value={profileData.email}
                              readOnly
                              disabled
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            El email no puede ser modificado
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          className="gap-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Guardar cambios
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => loadProfileData()}
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  {/* Pestaña de Foto de Perfil */}
                  <TabsContent value="image" className="space-y-6 pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <ImageIcon className="h-4 w-4" />
                        <span>Inserta la URL de una imagen de internet</span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">URL de la imagen</Label>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="imageUrl"
                            name="imageUrl"
                            type="url"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="pl-10 font-mono text-sm"
                            value={profileData.imageUrl}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            URL de una imagen en internet (JPG, PNG, GIF, WebP,
                            SVG)
                          </p>
                          {profileData.imageUrl && !isImageUrlValid && (
                            <p className="text-xs text-red-500">
                              URL no válida o no es una imagen
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Ejemplos de dónde obtener imágenes */}
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          ¿Dónde conseguir imágenes?
                        </h4>
                        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                          <li>
                            • <strong>Google Imágenes:</strong> Haz clic derecho
                            y "Copiar dirección de la imagen"
                          </li>
                          <li>
                            • <strong>Pinterest:</strong> Abre la imagen y copia
                            su URL
                          </li>
                          <li>
                            • <strong>Servicios de hosting:</strong> Imgur,
                            Cloudinary, etc.
                          </li>
                          <li>
                            • <strong>Redes sociales:</strong> Instagram,
                            Facebook (públicas)
                          </li>
                        </ul>
                      </div>

                      {/* Vista previa de la imagen */}
                      {profileData.imageUrl && isImageUrlValid && (
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Vista previa:</h4>
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full overflow-hidden border">
                              <img
                                src={profileData.imageUrl}
                                alt="Vista previa"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "";
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                                {profileData.imageUrl}
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                ✓ URL válida
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4 pt-4">
                        <Button
                          onClick={handleSubmit}
                          className="gap-2"
                          disabled={
                            loading ||
                            (profileData.imageUrl && !isImageUrlValid)
                          }
                        >
                          {loading ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Guardar imagen
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setProfileData({ ...profileData, imageUrl: "" })
                          }
                          disabled={loading}
                        >
                          Eliminar imagen
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                      ¿Cómo funciona?
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                        <span>
                          Subes solo la URL de una imagen que ya existe en
                          internet
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                        <span>
                          La imagen se carga directamente desde su fuente
                          original
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                        <span>
                          No almacenamos la imagen en nuestro servidor
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                        <span>
                          Asegúrate de usar una URL pública y permanente
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
