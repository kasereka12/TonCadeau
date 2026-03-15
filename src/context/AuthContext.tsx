import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthTokenResponsePassword, AuthResponse } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<AuthTokenResponsePassword>
    signUp: (email: string, password: string, metadata: Record<string, string>) => Promise<AuthResponse>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = (email: string, password: string): Promise<AuthTokenResponsePassword> => {
        return supabase.auth.signInWithPassword({ email, password })
    }

    const signUp = (email: string, password: string, metadata: Record<string, string>): Promise<AuthResponse> => {
        return supabase.auth.signUp({ email, password, options: { data: metadata } })
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        localStorage.removeItem('tc_preloader_shown')
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
