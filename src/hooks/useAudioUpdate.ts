import type { EditableAudioData } from "@/components/EditAudioDialog";
import { useAudioList } from "@/contexts/AudioListContext";
import api from "@/lib/api";

import { useState } from "react";

export default function useAudioUpdate() {
  
  const [error, setError] = useState<Error | undefined>(undefined);
  const { triggerRefetch } = useAudioList();

  const updateFile = async (trackData: EditableAudioData) => {
    
    setError(undefined);

    const dataToSend = {
      title: trackData.title,
      bpm: trackData.bpm,
      genre: trackData.genre,
    };

    try {
      const res = await api.put(`/audios/${trackData.id}`, dataToSend);

      

      triggerRefetch();

      return res.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("An unknown error occurred during update."));
      }

      
      throw err;
    }
  };

  return { updateFile, error };
}
