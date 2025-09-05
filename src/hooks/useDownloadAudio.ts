import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useState } from "react";

export const useDownloadAudio = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorDownloading, setErrorDownloading] = useState<
    ReferenceError | TypeError | SyntaxError | undefined
  >();
  const { getSignedUrl } = useAuth();

  const downloadFile = async ( fileName: string) => {
    setIsDownloading(true);

    try {
      // 1. Make an authenticated GET request using the pre-configured 'api' instance.
      // We set 'responseType: "blob"' to instruct axios to handle the binary data correctly.

      const sigendUrl = await getSignedUrl(fileName);

      const response = await api.get(sigendUrl, {
        responseType: "blob",
      });

      // 2. The response.data is already a Blob.
      const blob = response.data;

      // 3. Create a temporary URL for the blob.
      const blobUrl = URL.createObjectURL(blob);

      // 4. Create a temporary anchor element to trigger the download.
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;

      // 5. Programmatically click the link to start the download.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 6. Clean up the temporary URL to free up memory.
      URL.revokeObjectURL(blobUrl);
    } catch (e: unknown) {
      console.error("Download failed:", e);
      if (e instanceof ReferenceError) setErrorDownloading(e);
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadFile, isDownloading, errorDownloading };
};
