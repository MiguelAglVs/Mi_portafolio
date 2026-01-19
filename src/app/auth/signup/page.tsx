"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
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

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario");
      }

      // Registro exitoso
      setSuccess("¡Cuenta creada exitosamente! Redirigiendo al login...");

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>Regístrate para acceder a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Juan Pérez"
                    className="pl-10"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/auth/signin"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
