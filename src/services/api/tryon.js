import { supabase } from '../supabaseClient';

// ─── Upload preview PNG to Supabase Storage ─────────────────────────────────
export const uploadTryOnPreview = async (canvasRef) => {
    return new Promise((resolve, reject) => {
        const canvas = canvasRef.current;
        if (!canvas) return reject(new Error('No canvas'));

        canvas.toBlob(async (blob) => {
            if (!blob) return reject(new Error('Canvas toBlob failed'));
            const fileName = `preview-${Date.now()}.png`;

            const { data, error } = await supabase.storage
                .from('tryon-previews')
                .upload(fileName, blob, { contentType: 'image/png', upsert: false });

            if (error) return reject(error);

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('tryon-previews')
                .getPublicUrl(data.path);

            resolve(urlData.publicUrl);
        }, 'image/png');
    });
};

// ─── Save session metadata to DB ────────────────────────────────────────────
export const saveTryOnSession = async ({ userId, glasses, size, rotation, opacity, previewUrl }) => {
    const { data, error } = await supabase
        .from('tryon_sessions')
        .insert([{
            user_id: userId || null,
            glasses_id: glasses.id,
            glasses_label: glasses.label,
            glasses_size: Math.round(size),
            glasses_rotation: Math.round(rotation),
            glasses_opacity: opacity,
            preview_url: previewUrl,
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ─── Get sessions for a logged-in user ──────────────────────────────────────
export const getUserSessions = async (userId) => {
    if (!userId) return [];
    const { data, error } = await supabase
        .from('tryon_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) throw error;
    return data;
};

// ─── Delete a session ────────────────────────────────────────────────────────
export const deleteTryOnSession = async (sessionId) => {
    const { error } = await supabase
        .from('tryon_sessions')
        .delete()
        .eq('id', sessionId);

    if (error) throw error;
};
