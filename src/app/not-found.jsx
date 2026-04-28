'use client';

import Link from "next/link";

export default function NotFound() {

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Número 404 */}
      <div className="mb-8">
        <span className="text-primary text-[7rem] md:text-[10rem] font-bold select-none">
          404
        </span>
      </div>

      {/* Contenido */}
      <div className="text-center max-w-md">
        <h2 className="text-foreground text-2xl md:text-3xl font-semibold mb-4">
          Página no encontrada
        </h2>
        <p className="text-muted-foreground mb-8">
          La página que buscas no existe o ha sido movida.
        </p>

        {/* Botón */}
        <Link href="/">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-8 rounded-lg transition-all duration-300">
            Volver al inicio
          </button>
        </Link>
      </div>
    </div>
  );
}
