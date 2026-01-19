"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Heart,
  Globe,
  Award,
  Users,
  Calendar,
  ChevronRight,
  ExternalLink,
  FileText,
  Download,
  Sparkles,
  ArrowRight,
  Palette,
  Rocket,
} from "lucide-react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("about");

  // Datos de experiencia profesional
  const experiences = [
    {
      id: 1,
      company: "Misioneros Urbanos De Jesucristo",
      position: "Desarrollador Web Full Stack",
      period: "2023 - 2024",
      description: `Sitio web publicado y funcionando que aumentó el alcance de la organización.
Sistema de ingreso seguro usado por administradores y colaboradores.
Mejoras al funcionamiento general del sitio que lo hicieron más rápido y estable.
Diseño adaptable que permitió una navegación fácil en celular y computador.`,
      technologies: ["Php", "Laravel", "MySQL", "Git", "Bootstrap"],
    },
    {
      id: 2,
      company: "Sodexo",
      position: "Analista de datos",
      period: "2024 - 2024",
      description: `Organización completa de información de activos para
facilitar control interno.
Tableros usados por el equipo y jefes para entender
operaciones y tomar decisiones.
Reportes más claros y confiables con menos errores y
mejor presentación.`,
      technologies: [
        "Excel",
        "Power BI",
        "SQL",
        "Google Sheets",
        "Microsoft Excel",
      ],
    },
    {
      id: 3,
      company: "Teleperformance",
      position: "Soporte Técnico",
      period: "2025 - 2026",
      description: `Comentarios positivos y buenos resultados en atención al
cliente.
Metas de rendimiento cumplidas y superadas de manera
constante.
Solución de solicitudes sin necesidad de escalar a otros
equipos.`,
      technologies: [],
    },
  ];

  // Datos de educación
  const education = [
    {
      id: 1,
      institution: "Politécnico Colombiano Jaime Isaza Cadavid",
      degree: "Técnico Prof. en prog. de sistemas de información",
      period: "2022 - En curso",
    },
    {
      id: 2,
      institution: "Tecnologico de Antioquia",
      degree: "Tecnólogo en diseño y desarrolló web",
      period: "2019 - En pausa",
    },
  ];

  // Habilidades técnicas
  const skills = {
    frontend: [
      { name: "HTML / CSS", level: 80 },
      { name: "JavaScript", level: 70 },
      { name: "React", level: 55 },
      { name: "Tailwind CSS", level: 75 },
      { name: "Responsive Design", level: 75 },
    ],
    backend: [
      { name: "Node.js", level: 60 },
      { name: "MySQL / PostgreSQL", level: 55 },
      { name: "APIs REST", level: 65 },
      { name: "Autenticación", level: 50 },
      { name: "Prisma / ORM", level: 45 },
    ],
    tools: [
      { name: "Git", level: 70 },
      { name: "Soporte técnico", level: 85 },
      { name: "Análisis de datos", level: 75 },
      { name: "Docker", level: 35 },
      { name: "Testing básico", level: 40 },
    ],
  };

  // Intereses y hobbies
  const interests = [
    {
      icon: <Code className="w-5 h-5" />,
      name: "Aprendizaje constante",
      description:
        "Me gusta seguir aprendiendo nuevas tecnologías y mejorar mis habilidades",
      color: "from-blue-600 to-blue-400",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      name: "Comunidad Tech",
      description: "Sigo tutoriales, foros y comparto lo que voy aprendiendo",
      color: "from-purple-600 to-purple-400",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      name: "Soporte y ayuda",
      description:
        "Disfruto resolver problemas técnicos y apoyar a otros cuando puedo",
      color: "from-green-600 to-green-400",
    },
    {
      icon: <Award className="w-5 h-5" />,
      name: "Proyectos personales",
      description:
        "Creo proyectos pequeños para experimentar y practicar mis conocimientos",
      color: "from-orange-600 to-orange-400",
    },
  ];

  // Estadísticas personales
  const stats = [
    {
      label: "Años aprendiendo",
      value: "3+",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Proyectos personales",
      value: "10+",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Colaboraciones",
      value: "5+",
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Tecnologías exploradas",
      value: "8+",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section Mejorada */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Columna Izquierda - Imagen */}
            <div className="order-2 lg:order-1">
              <div className="relative max-w-md mx-auto lg:mx-0">
                {/* Marco decorativo */}
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-transparent rounded-3xl blur-xl" />

                {/* Contenedor de la imagen con efecto fotográfico */}
                <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-black">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10" />

                  {/* Imagen */}
                  <Image
                    src="/images/me/portrait.jpg"
                    alt="Retrato profesional"
                    width={500}
                    height={650}
                    priority
                    className="w-full h-auto object-cover contrast-105"
                    style={{
                      aspectRatio: "5/6.5",
                      objectPosition: "center 20%",
                      filter: "grayscale(100%) contrast(110%)",
                    }}
                  />

                  {/* Overlay con información */}
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="backdrop-blur-sm bg-black/40 p-4 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">
                            Disponible para proyectos
                          </h3>
                          <p className="text-gray-300 text-sm">
                            Trabajo remoto y presencial
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elementos decorativos */}
                <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-spin-slow" />
                <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-spin-slow delay-1000" />
              </div>
            </div>

            {/* Columna Derecha - Información */}
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Desarrollador Full Stack
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                  Hola, soy{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Miguel Vargas
                  </span>
                </h1>
              </div>

              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Apasionado por crear experiencias digitales intuitivas y
                eficientes. Especializado en desarrollo web moderno con foco en
                usabilidad, performance y código mantenible.
              </p>

              {/* Información de contacto */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Medellín, Colombia
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a
                      href="mailto:miguelaglvs@gmail.com"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      miguelaglvs@gmail.com
                    </a>
                  </div>
                </div>

                {/* Redes sociales */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href="https://github.com/MiguelAglVs"
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href="https://linkedin.com/in/miguelvargas-dev"
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/contact" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Contactar
                    </Link>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <a
                      href="/Miguel_Vargas_CV.pdf"
                      download="Miguel_Vargas_CV.pdf"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      CV
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas - Mismo diseño que el home */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">En Números</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Algunas métricas de mi trayectoria profesional
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow"
              >
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contenido principal con Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Mi Trayectoria
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                Descubre más sobre mi experiencia, habilidades y proyectos
              </p>

              <TabsList className="inline-flex">
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Sobre Mí
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Experiencia
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Habilidades
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab: Sobre Mí */}
            <TabsContent value="about" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Mi Historia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <p>
                        Empecé a interesarme por el desarrollo web hace un
                        tiempo, motivado por la curiosidad de entender cómo
                        funcionan las páginas y aplicaciones que usamos a
                        diario.
                      </p>
                      <p>
                        He participado en proyectos personales y colaborativos
                        que me han permitido aprender sobre HTML, CSS y
                        JavaScript, además de familiarizarme con buenas
                        prácticas y trabajo en equipo.
                      </p>
                      <p>
                        Me enfoco en seguir creciendo día a día, mejorar mis
                        habilidades y aportar con compromiso e ideas frescas
                        para crear soluciones funcionales y útiles para los
                        usuarios.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Educación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {education.map((edu) => (
                        <div
                          key={edu.id}
                          className="border-l-2 border-blue-500 pl-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold">{edu.degree}</h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                {edu.institution}
                              </p>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {edu.period}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {edu.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Intereses - Mismo estilo que la sección de enfoque del home */}
              <div className="max-w-5xl mx-auto">
                <h3 className="text-2xl font-bold text-center mb-8 pt-8">
                  Mis Intereses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {interests.map((interest, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                          <div
                            className={`h-12 w-12 rounded-full bg-gradient-to-r ${interest.color} flex items-center justify-center mx-auto`}
                          >
                            <div className="text-white">{interest.icon}</div>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-2">
                              {interest.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {interest.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab: Experiencia */}
            <TabsContent
              value="experience"
              className="space-y-6 max-w-4xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Experiencia Profesional</CardTitle>
                  <CardDescription>
                    Mi trayectoria y roles a lo largo de los años
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="relative pl-8 pb-8 last:pb-0"
                      >
                        {/* Línea vertical */}
                        <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                        {/* Punto */}
                        <div className="py-2" />

                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold">
                                {exp.position}
                              </h3>
                              <p className="text-lg text-gray-600 dark:text-gray-400">
                                {exp.company}
                              </p>
                            </div>
                            <Badge variant="outline" className="mt-2 sm:mt-0">
                              <Calendar className="w-3 h-3 mr-1" />
                              {exp.period}
                            </Badge>
                          </div>

                          <p className="text-gray-700 dark:text-gray-300">
                            {exp.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {exp.technologies.map((tech, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="font-normal"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Habilidades */}
            <TabsContent value="skills" className="space-y-8 max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Frontend */}
                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle>Frontend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {skills.frontend.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${skill.level}%`,
                                backgroundImage:
                                  "linear-gradient(to right, #2563eb, #7c3aed)",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Backend */}
                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                      <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle>Backend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {skills.backend.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${skill.level}%`,
                                backgroundImage:
                                  "linear-gradient(to right, #7c3aed, #db2777)",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Herramientas */}
                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                      <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle>Herramientas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {skills.tools.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${skill.level}%`,
                                backgroundImage:
                                  "linear-gradient(to right, #059669, #2563eb)",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enfoque - Mismo diseño que el home */}
              <div>
                <h3 className="text-2xl font-bold text-center mb-8 pt-8">
                  Mi Enfoque
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                        <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle>Código Limpio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400">
                        Me enfoco en escribir código claro y fácil de entender.
                        Uso buenas prácticas y siempre busco aprender mejores
                        formas de desarrollar.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                        <Rocket className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle>Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400">
                        Intento que mis proyectos funcionen de forma fluida.
                        Optimizo lo que puedo y sigo aprendiendo a mejorar el
                        rendimiento paso a paso.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <Palette className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <CardTitle>Experiencia de Usuario</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400">
                        Me gusta crear interfaces sencillas y cómodas de usar.
                        Pienso en lo que necesita el usuario y trato de que cada
                        interacción sea clara.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Final - Igual que el home */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Estoy disponible para colaborar en nuevos proyectos y desafíos
            interesantes. Hablemos sobre cómo puedo ayudarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/contact" className="gap-2">
                Iniciar conversación
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/projects" className="gap-2">
                Ver Proyectos
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
