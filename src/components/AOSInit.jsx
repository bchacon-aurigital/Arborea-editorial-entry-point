"use client";

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInit() {
    useEffect(() => {
        const timer = setTimeout(() => {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true,
                offset: 100,
                delay: 0,
                disable: false,
                initClassName: '',
                animatedClassName: 'aos-animate',
                useClassNames: false,
                disableMutationObserver: false,
                debounceDelay: 50,
                throttleDelay: 99,
            });
            AOS.refresh();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
