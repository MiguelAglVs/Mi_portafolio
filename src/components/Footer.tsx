import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo y derechos */}
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-xl font-bold">
              Miguel Vargas
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              © {currentYear} Todos los derechos reservados.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="mb-6 md:mb-0">
            <h3 className="font-semibold mb-3">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/projects"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Proyectos
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sobre mí
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="font-semibold mb-3">Conéctate</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/MiguelAglVs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/miguelvargas-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:miguelaglvs@gmail.com"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright inferior */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Desarrollado con Next.js, Tailwind CSS y Prisma.</p>
          <p className="mt-1">Hosteado en Vercel.</p>
        </div>
      </div>
    </footer>
  );
}
