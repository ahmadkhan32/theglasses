import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { upsertUserProfile } from '../services/api/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async ({ email, password, name, phone }) => {
        try {
            const { data, error } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    data: { name, phone } 
                }
            });
            
            if (error) {
                if (error.status === 429) {
                    throw new Error("Too many registration attempts. Please wait 60 seconds and try again.");
                }
                throw error;
            }

            // Immediately create the public profile if user exists (even if unconfirmed)
            if (data.user) {
                await upsertUserProfile({ 
                    id: data.user.id, 
                    email: data.user.email,
                    name, 
                    phone 
                });
            }
            return data;
        } catch (err) {
            console.error('Registration failed:', err.message);
            throw err;
        }
    };

    const signIn = async ({ email, password }) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            
            if (error) {
                if (error.status === 400) {
                    throw new Error("Invalid email or password. Please confirm your email if required by your settings.");
                }
                throw error;
            }
            return data;
        } catch (err) {
            console.error('Sign-in failed:', err.message);
            throw err;
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const value = { user, session, loading, signUp, signIn, signOut, isAdmin: user?.user_metadata?.role === 'admin' };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
