import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

const ICONS = {
    success: CheckCircle,
    error:   XCircle,
    info:    Info,
};

const STYLES = {
    success: { bar: 'bg-emerald-500', icon: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    error:   { bar: 'bg-red-500',     icon: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-100' },
    info:    { bar: '',               icon: 'text-[#aa5a9e]',   bg: 'bg-white',      border: 'border-slate-100' },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    }, []);

    const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast container */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map(t => {
                    const Icon = ICONS[t.type];
                    const s    = STYLES[t.type];
                    return (
                        <div
                            key={t.id}
                            className={`pointer-events-auto flex items-start gap-3 w-80 rounded-2xl border ${s.bg} ${s.border} shadow-xl px-4 py-3.5 animate-slide-in`}
                        >
                            {/* Colored left bar for info/gradient */}
                            {t.type === 'info' && (
                                <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
                                    style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)', position: 'absolute' }} />
                            )}
                            <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${s.icon}`} />
                            <p className="flex-1 text-sm font-medium text-slate-800 leading-snug">{t.message}</p>
                            <button
                                onClick={() => remove(t.id)}
                                className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0 mt-0.5">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};
