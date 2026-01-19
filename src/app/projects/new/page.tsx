// src/app/admin/projects/new/page.tsx (Crear)
"use client";

import ProjectForm from "@/components/dashboard/ProjectForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewProjectPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Proyecto</CardTitle>
          <CardDescription>
            Completa todos los campos para agregar un nuevo proyecto a tu
            portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm />
        </CardContent>
      </Card>
    </div>
  );
}
