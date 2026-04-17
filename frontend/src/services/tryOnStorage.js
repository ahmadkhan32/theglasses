import { supabase } from './supabaseClient';

const dataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);
  return response.blob();
};

export const uploadTryOnPreview = async ({ dataUrl, frameId, userId }) => {
  const blob = await dataUrlToBlob(dataUrl);
  const stamp = Date.now();
  const safeFrame = frameId || 'frame';
  const owner = userId || 'guest';
  const filePath = `${owner}/${safeFrame}-${stamp}.png`;

  const { data, error } = await supabase.storage
    .from('tryon-previews')
    .upload(filePath, blob, {
      contentType: 'image/png',
      upsert: false,
    });

  if (error) throw error;

  const { data: publicData } = supabase.storage
    .from('tryon-previews')
    .getPublicUrl(filePath);

  return {
    path: data?.path || filePath,
    publicUrl: publicData?.publicUrl || null,
  };
};