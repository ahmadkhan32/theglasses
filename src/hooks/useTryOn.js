import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import {
    saveTryOnSession,
    getUserSessions,
    uploadTryOnPreview,
    deleteTryOnSession,
} from '../services/api/tryon';

const useTryOn = (canvasRef) => {
    const [saving, setSaving] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Get current user
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data?.user?.id || null);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id || null);
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    // Fetch sessions when user logs in
    const fetchSessions = useCallback(async () => {
        if (!userId) { setSessions([]); return; }
        setSessionsLoading(true);
        try {
            const data = await getUserSessions(userId);
            setSessions(data);
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
        } finally {
            setSessionsLoading(false);
        }
    }, [userId]);

    useEffect(() => { fetchSessions(); }, [fetchSessions]);

    // Save a new session
    const saveSession = useCallback(async ({ glasses, size, rotation, opacity }) => {
        setSaving(true);
        setError(null);
        setSuccessMsg(null);
        try {
            // 1. Upload canvas preview to Supabase Storage
            let previewUrl = null;
            try {
                previewUrl = await uploadTryOnPreview(canvasRef);
            } catch (uploadErr) {
                console.warn('Preview upload failed (Storage may not be set up yet):', uploadErr.message);
            }

            // 2. Save session row to DB
            const session = await saveTryOnSession({
                userId,
                glasses,
                size,
                rotation,
                opacity,
                previewUrl,
            });

            setSessions((prev) => [session, ...prev]);
            setSuccessMsg('Session saved! 🎉');
            setTimeout(() => setSuccessMsg(null), 3000);
            return session;
        } catch (err) {
            setError(err.message || 'Failed to save session');
            setTimeout(() => setError(null), 4000);
            throw err;
        } finally {
            setSaving(false);
        }
    }, [canvasRef, userId]);

    // Delete a session
    const deleteSession = useCallback(async (sessionId) => {
        try {
            await deleteTryOnSession(sessionId);
            setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        } catch (err) {
            setError(err.message);
        }
    }, []);

    return {
        saving,
        sessions,
        sessionsLoading,
        error,
        successMsg,
        userId,
        saveSession,
        deleteSession,
        refetchSessions: fetchSessions,
    };
};

export default useTryOn;
