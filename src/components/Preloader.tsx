import { useEffect, useState } from 'react';
import logo from '../../public/logo.png';

const STORAGE_KEY = 'tc_preloader_shown';

const Preloader = () => {
    const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY));
    const [fading, setFading]   = useState(false);

    useEffect(() => {
        if (!visible) return;
        const fadeTimer = setTimeout(() => setFading(true), 4500);
        const hideTimer = setTimeout(() => {
            setVisible(false);
            localStorage.setItem(STORAGE_KEY, '1');
        }, 5000);
        return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
            style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #0f2027 100%)' }}
        >
            {/* Cercles décoratifs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #aa5a9e, transparent)' }} />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #6fc7d9, transparent)' }} />
            </div>

            {/* Logo + texte */}
            <div className="relative flex flex-col items-center gap-6">
                <div className="relative">
                    {/* Halo animé */}
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                        style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)', animationDuration: '1.5s' }} />
                    <div className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl"
                        style={{ background: 'linear-gradient(135deg, #aa5a9e22, #6fc7d922)', border: '2px solid rgba(255,255,255,0.15)' }}>
                        <img src={logo} alt="TonCadeau" className="w-20 h-20 object-contain" />
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        TonCadeau<span className="font-light opacity-60">.net</span>
                    </h1>
                    <p className="text-white/50 text-sm mt-1 font-light">Créez des moments inoubliables</p>
                </div>

                {/* Barre de progression */}
                <div className="w-48 h-0.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                        className="h-full rounded-full"
                        style={{
                            background: 'linear-gradient(90deg, #aa5a9e, #6fc7d9)',
                            animation: 'preloader-bar 5s linear forwards',
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes preloader-bar {
                    from { width: 0%; }
                    to   { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default Preloader;
