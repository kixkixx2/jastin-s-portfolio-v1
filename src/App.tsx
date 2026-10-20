import React, { useState } from 'react';
import { ReactLenis } from 'lenis/react';
import { LayoutGroup, AnimatePresence } from 'motion/react';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import Scene from './components/Scene';
import Chatbot from './components/Chatbot';

export default function App() {
    const [loading, setLoading] = useState(true);

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
            <div className="bg-noise"></div>
            <CustomCursor />

            <LayoutGroup>
                <AnimatePresence>
                    {loading && <Preloader onComplete={() => setLoading(false)} />}
                </AnimatePresence>

                <main className="relative z-10 w-full overflow-hidden">
                    {!loading && <Scene />}
                </main>
            </LayoutGroup>

            {/* Chatbot widget — fixed, always above everything */}
            {!loading && <Chatbot />}
        </ReactLenis>
    );
}
