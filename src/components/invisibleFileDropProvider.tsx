import { useEffect, useState, type ReactNode } from "react";
import useAudioUpload from "@/hooks/useAudioUpload";
import { getToken, getUserIdFromToken } from "@/utils/token";

interface InvisibleFileDropProviderProps {
  children: ReactNode;
}

export function InvisibleFileDropProvider({
  children,
}: InvisibleFileDropProviderProps) {
  const { uploadFile } = useAudioUpload();
  const tokenFromStorage = getToken();

  const [userId] = useState<string | null>(
    tokenFromStorage ? getUserIdFromToken() : null
  );
  useEffect(() => {
    if (!userId) {
      console.warn(
        "InvisibleFileDropProvider: userId is null. File uploads will be disabled."
      );
      return;
    }

    function handleDrop(e: DragEvent) {
      e.preventDefault();
      if (!e.dataTransfer) return;

      const files = e.dataTransfer.files;
      if (!files.length) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!userId) {
          return;
        }
        uploadFile(file, userId).then((data) => {
          if (data) console.log(`Uploaded file: ${file.name}`);
        });
      }
    }

    function handleDragOver(e: DragEvent) {
      e.preventDefault();
    }

    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragOver);

    return () => {
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragOver);
    };
  }, [uploadFile, userId]);

  return <>{children}</>;
}
