import { supabase } from '../supabaseClient';

// Fetch all try-on glasses frames from Supabase
export const getGlasses = async () => {
    const { data, error } = await supabase
        .from('glasses')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

// Upload a glasses PNG to Supabase Storage, then insert DB row
export const uploadGlass = async ({ file, name, category }) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `glass-${Date.now()}.${fileExt}`;
    const storagePath = `public/${fileName}`;

    // 1. Upload to 'glasses' bucket
    const { error: upErr } = await supabase.storage
        .from('glasses')
        .upload(storagePath, file, { contentType: file.type, upsert: false });

    if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

    // 2. Get public URL
    const { data: urlData } = supabase.storage
        .from('glasses')
        .getPublicUrl(storagePath);

    const imageUrl = urlData.publicUrl;

    // 3. Insert row into DB
    const { data, error: dbErr } = await supabase
        .from('glasses')
        .insert([{ name, category, image_url: imageUrl }])
        .select()
        .single();

    if (dbErr) throw new Error(`DB insert failed: ${dbErr.message}`);
    return data;
};

// Delete a glasses frame from DB and Storage
export const deleteGlass = async (id, imageUrl) => {
    // Delete from DB
    const { error: dbErr } = await supabase.from('glasses').delete().eq('id', id);
    if (dbErr) throw dbErr;

    // Try to delete from storage (best effort)
    if (imageUrl) {
        const match = imageUrl.match(/glasses\/public\/([^?#]+)/);
        if (match) {
            await supabase.storage.from('glasses').remove([`public/${match[1]}`]).catch(console.warn);
        }
    }
};
