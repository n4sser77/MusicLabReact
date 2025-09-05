import { useAudioList } from "@/contexts/AudioListContext";
import api from "@/lib/api";

import { useState } from "react";

export default function useAudioUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<
    ReferenceError | TypeError | SyntaxError | undefined
  >(undefined);
  const { triggerRefetch } = useAudioList();

  const uploadFile = async (file: File, userId: string) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Use file name as title, other fields empty or defaults
      formData.append("title", file.name);
      formData.append("userId", userId);
      formData.append("bpm", "0");
      formData.append("genre", "");
      formData.append("filepath", file.name);
      formData.append("waveFormImageBase64", "");

      // public int Id { get; set; }
      // public string Title { get; set; }
      // public int? Bpm { get; set; }
      // public string? Genre { get; set; }
      // public string FilePath { get; set; }
      // public string WaveFormImageBase64 { get; set; }
      // public int UserId { get; set; }

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await api.post("files/uploadfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploading(false);
      triggerRefetch();
      return res.data;
    } catch (err: unknown) {
      if (err instanceof ReferenceError) {
        setError(err);
      }

      setUploading(false);
      return null;
    }
  };

  return { uploadFile, uploading, error };
}
