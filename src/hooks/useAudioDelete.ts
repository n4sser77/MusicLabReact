// useDeleteAudio.ts
import api from "@/lib/api";
import { useAudioList } from "@/contexts/AudioListContext";

export const useDeleteAudio = () => {
  const { triggerRefetch } = useAudioList(); // Assuming you add this setter to the context value

  const deleteFile = async (fileId: number) => {
    try {
      await api.delete(`/audios/${fileId}`);
      // Optimistically trigger update
      triggerRefetch();
    } catch (error) {
      console.error("Failed to delete audio file:", error);
      // You could handle a rollback or show a toast notification here
    }
  };

  return { deleteFile };
};

