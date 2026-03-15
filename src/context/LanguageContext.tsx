import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations, type Lang, type T } from '../i18n/translations';

interface LanguageContextType {
    lang:    Lang;
    setLang: (lang: Lang) => void;
    t:       T;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLangState] = useState<Lang>(() => {
        const stored = localStorage.getItem('tc_lang');
        return (stored === 'fr' || stored === 'en') ? stored : 'fr';
    });

    const setLang = (l: Lang) => {
        setLangState(l);
        localStorage.setItem('tc_lang', l);
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as T }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLang = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
    return ctx;
};
