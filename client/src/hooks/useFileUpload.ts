import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const uploadFile = async (file: File, bucketName: string = 'data-files') => {
    if (!session?.user?.id) {
      setError('User not authenticated');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      // Create a unique file path using user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) throw error;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        path: data.path,
        url: urlData.publicUrl,
        fileName: file.name,
        size: file.size,
        type: file.type
      };
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (filePath: string, bucketName: string = 'data-files') => {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    error
  };
}