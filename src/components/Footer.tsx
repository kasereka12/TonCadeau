import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Heart, ArrowRight } from 'lucide-react';
import logo from '../../public/logo.png';

const Footer = () => {
    const year = new Date().getFullYear();

    const links = [
        { to: '/',              label: 'Accueil' },
        { to: '/products',      label: 'Produits' },
        { to: '/compose-gift',  label: 'Composer un cadeau' },
        { to: '/supplier',      label: 'Devenir fournisseur' },
        { to: '/register',      label: 'Créer un compte' },
    ];

    const socials = [
        { icon: Facebook,  href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Twitter,   href: '#', label: 'Twitter' },
    ];

    const contact = [
        { icon: Mail,    text: 'contact@toncadeau.net' },
        { icon: Phone,   text: '+212 6 00 00 00 00' },
        { icon: MapPin,  text: 'Casablanca, Maroc' },
    ];

    return (
        <footer
            style={{ background: 'linear-gradient(160deg, #1a0a1e 0%, #0f1a2e 60%, #0a1a1a 100%)' }}
            className="text-white relative overflow-hidden"
        >
            {/* Decorative glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(170,90,158,0.12) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(111,199,217,0.1) 0%, transparent 70%)' }} />

            {/* Top accent line */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #aa5a9e, #6fc7d9, transparent)' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-16">

                    {/* Brand col */}
                    <div className="md:col-span-5">
                        <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
                            <img src={logo} alt="TonCadeau" className="h-10 w-auto" />
                            <span className="text-xl font-bold text-white group-hover:text-white/80 transition-colors">
                                TonCadeau<span className="font-light opacity-60">.net</span>
                            </span>
                        </Link>

                        <p className="text-white/45 text-sm leading-relaxed max-w-sm mb-6">
                            La plateforme de référence pour composer et offrir des cadeaux personnalisés.
                            Des produits de qualité, sélectionnés avec soin pour créer des moments inoubliables.
                        </p>

                        {/* Newsletter mini */}
                        <div className="flex gap-2 max-w-sm">
                            <input
                                type="email"
                                placeholder="Votre email…"
                                className="flex-1 bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#aa5a9e]/50 transition-all"
                            />
                            <button
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}
                            >
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-white/25 text-xs mt-2">Offres exclusives, pas de spam.</p>

                        {/* Socials */}
                        <div className="flex gap-2 mt-6">
                            {socials.map(({ icon: Icon, href, label }) => (
                                <a key={label} href={href} aria-label={label}
                                    className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/25 hover:bg-white/12 transition-all duration-200">
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block md:col-span-1" />

                    {/* Links col */}
                    <div className="md:col-span-3">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-5">Navigation</h3>
                        <ul className="space-y-3">
                            {links.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-sm text-white/55 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-[#aa5a9e] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact col */}
                    <div className="md:col-span-3">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-5">Contact</h3>
                        <ul className="space-y-4">
                            {contact.map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                        style={{ background: 'linear-gradient(135deg, rgba(170,90,158,0.2), rgba(111,199,217,0.2))' }}>
                                        <Icon className="h-3.5 w-3.5 text-[#6fc7d9]" />
                                    </div>
                                    <span className="text-sm text-white/55 group-hover:text-white/80 transition-colors">{text}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Trust badge */}
                        <div className="mt-8 p-4 rounded-2xl border border-white/8"
                            style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <p className="text-xs text-white/35 leading-relaxed">
                                🔒 Paiements sécurisés · Livraison suivie · Satisfaction garantie
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="border-t border-white/8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-white/30">
                        © {year} TonCadeau.net — Tous droits réservés
                    </p>
                    <p className="text-xs text-white/20 flex items-center gap-1">
                        Fait avec <Heart className="h-3 w-3 text-[#aa5a9e] fill-[#aa5a9e]" /> au Maroc
                    </p>
                    <div className="flex gap-4">
                        {['Confidentialité', 'CGU', 'Cookies'].map(t => (
                            <a key={t} href="#" className="text-xs text-white/25 hover:text-white/55 transition-colors">{t}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
