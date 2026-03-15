import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { ImportantDate, AppNotification } from '../types/index';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getNextOccurrence(dateStr: string, recurring: boolean): Date | null {
    const [year, month, day] = dateStr.split('-').map(Number);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!recurring) {
        const d = new Date(year, month - 1, day);
        return d >= today ? d : null;
    }
    // Recurring: try current year, then next
    let d = new Date(today.getFullYear(), month - 1, day);
    if (d < today) d = new Date(today.getFullYear() + 1, month - 1, day);
    return d;
}

function computeNotifications(dates: ImportantDate[]): AppNotification[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result: AppNotification[] = [];

    for (const d of dates) {
        const next = getNextOccurrence(d.date, d.recurring);
        if (!next) continue;
        const daysUntil = Math.round((next.getTime() - today.getTime()) / 86_400_000);
        if (daysUntil >= 0 && daysUntil <= d.reminder_days) {
            result.push({
                id: `${d.id}-${next.getFullYear()}`,
                dateId: d.id,
                title: d.title,
                type: d.type,
                daysUntil,
                occurrenceDate: next.toISOString().split('T')[0],
            });
        }
    }
    // Sort: closest first
    return result.sort((a, b) => a.daysUntil - b.daysUntil);
}

const STORAGE_KEY = 'tc_seen_notif_ids';

function getSeenIds(): Set<string> {
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')); }
    catch { return new Set(); }
}

function saveSeenIds(ids: Set<string>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

// ── Context ───────────────────────────────────────────────────────────────────

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    markAllRead: () => void;
    importantDates: ImportantDate[];
    addDate: (d: Omit<ImportantDate, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
    updateDate: (id: string, d: Partial<ImportantDate>) => Promise<void>;
    deleteDate: (id: string) => Promise<void>;
    loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
    const [notifications, setNotifications]   = useState<AppNotification[]>([]);
    const [seenIds, setSeenIds]               = useState<Set<string>>(getSeenIds);
    const [loading, setLoading]               = useState(false);

    // Fetch dates when user changes
    useEffect(() => {
        if (!user) { setImportantDates([]); setNotifications([]); return; }
        setLoading(true);
        supabase
            .from('important_dates')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: true })
            .then(({ data }) => {
                const dates = (data ?? []) as ImportantDate[];
                setImportantDates(dates);
                setNotifications(computeNotifications(dates));
                setLoading(false);
            });
    }, [user]);

    const unreadCount = notifications.filter(n => !seenIds.has(n.id)).length;

    const markAllRead = useCallback(() => {
        const newSeen = new Set(seenIds);
        notifications.forEach(n => newSeen.add(n.id));
        setSeenIds(newSeen);
        saveSeenIds(newSeen);
    }, [notifications, seenIds]);

    const refresh = (dates: ImportantDate[]) => {
        setImportantDates(dates);
        setNotifications(computeNotifications(dates));
    };

    const addDate = useCallback(async (d: Omit<ImportantDate, 'id' | 'user_id' | 'created_at'>) => {
        if (!user) return;
        const { data, error } = await supabase
            .from('important_dates')
            .insert([{ ...d, user_id: user.id }])
            .select()
            .single();
        if (!error && data) {
            const updated = [...importantDates, data as ImportantDate];
            refresh(updated);
        }
    }, [user, importantDates]);

    const updateDate = useCallback(async (id: string, d: Partial<ImportantDate>) => {
        const { data, error } = await supabase
            .from('important_dates')
            .update(d)
            .eq('id', id)
            .select()
            .single();
        if (!error && data) {
            const updated = importantDates.map(x => x.id === id ? data as ImportantDate : x);
            refresh(updated);
        }
    }, [importantDates]);

    const deleteDate = useCallback(async (id: string) => {
        const { error } = await supabase.from('important_dates').delete().eq('id', id);
        if (!error) {
            const updated = importantDates.filter(x => x.id !== id);
            refresh(updated);
        }
    }, [importantDates]);

    return (
        <NotificationContext.Provider value={{
            notifications, unreadCount, markAllRead,
            importantDates, addDate, updateDate, deleteDate, loading,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
    return ctx;
};
