"use client";

import { useState } from "react";
import {
  Send,
  Mail,
  User,
  MessageSquare,
  Loader2,
  CheckCircle,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", message: "" });

        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      } else {
        throw new Error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctame</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            ¿Tienes un proyecto en mente o quieres colaborar? Estoy aquí para
            escucharte y ayudarte a hacerlo realidad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envíame un mensaje</CardTitle>
                <CardDescription>
                  Completa el formulario y me pondré en contacto contigo lo
                  antes posible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSuccess ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                      <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">
                      ¡Mensaje enviado!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Gracias por contactarme. Te responderé en las próximas
                      24-48 horas.
                    </p>
                    <Button
                      className="mt-6"
                      onClick={() => setIsSuccess(false)}
                    >
                      Enviar otro mensaje
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Nombre
                          </div>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Tu nombre"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </div>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Mensaje
                        </div>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Cuéntame sobre tu proyecto, idea o consulta..."
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="min-h-[150px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Enviar mensaje
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Normalmente respondo en menos de 24 horas.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Información de contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      miguelaglvs@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Respuesta rápida</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      24-48 horas hábiles
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  ¿Qué puedo hacer por ti?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Desarrollo de aplicaciones web
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Consultoría técnica
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Mantenimiento de proyectos existentes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Optimización de performance
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
