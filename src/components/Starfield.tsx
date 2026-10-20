import React, { useEffect, useRef } from 'react';




export default function Starfield() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Fewer stars on small screens — hundreds of canvas path fills per
        // frame are a major mobile GPU cost during section transitions.
        const isSmall = window.matchMedia('(max-width: 767px)').matches;
        const STAR_COUNT = isSmall ? 220 : 800;

        const stars = Array.from({ length: STAR_COUNT }).map(() => ({
            x: (Math.random() - 0.5) * 3000,
            y: (Math.random() - 0.5) * 3000,
            z: Math.random() * 2000,
            size: Math.random() * 1.5 + 0.5,
        }));

        let animationFrameId: number;
        let lastScrollY = window.scrollY;
        let velocity = 0;

        const render = () => {
            // Calculate scroll velocity manually for smoothness
            const currentScrollY = window.scrollY;
            const scrollDiff = currentScrollY - lastScrollY;
            velocity = velocity * 0.9 + scrollDiff * 0.1; // smoothing
            lastScrollY = currentScrollY;

            ctx.fillStyle = 'rgba(10, 10, 10, 1)';
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            // Base speed + scroll velocity influence
            const speed = 1.5 + velocity * 0.8;

            stars.forEach((star) => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.z += 2000;
                } else if (star.z > 2000) {
                    star.z -= 2000;
                }

                const k = 1000.0 / star.z;
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    const depthScale = Math.max(0, (1 - star.z / 2000));
                    const size = star.size * depthScale * 3;
                    const shade = parseInt((depthScale * 255).toString());
                    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
                    if (size > 2) {
                        // Only near (large) stars get round paths; distant dots
                        // use fillRect, which is far cheaper on mobile GPUs.
                        ctx.beginPath();
                        ctx.arc(px, py, size, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        ctx.fillRect(px - size, py - size, size * 2, size * 2);
                    }
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        />
    );
}
