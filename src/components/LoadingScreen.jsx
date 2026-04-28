"use client";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 20);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-background z-[9999] flex items-center justify-center">
            <div className="text-center">
                {/* Logo/Brand */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full border-2 border-primary rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* Reemplaza con tu logo */}
                        <div className="w-16 h-16 bg-primary rounded-lg"></div>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-64 mx-auto">
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Texto */}
                <div className="mt-6">
                    <p className="text-foreground font-medium">Cargando...</p>
                </div>
            </div>
        </div>
    );
}
