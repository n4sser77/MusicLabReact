import { type FileComponentProps } from "@/components/ui/file-component";
import api from "@/lib/api";

import { useEffect, useState, createContext, type ReactNode, useContext } from "react";

type AudioPlayerListType = {
  audioFiles: FileComponentProps[];
  loading: boolean;
  error: boolean;
};
const AudioListContext = createContext<AudioPlayerListType>({
  audioFiles: [],
  loading: false,
  error:false
});

export const AudioListProvider = ({ children }: { children: ReactNode }) => {
  const [audioFiles, setAudioFiles] = useState<FileComponentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true); // start loading before fetching

      try {
        const res = await api.get(`audio/getall`);
        console.log("API response status:", res.status);
        console.log("API response data:", res.data);

        if (res.status === 200) {
          setAudioFiles(res.data);
        } else {
          setAudioFiles([]);
        }
      } catch (error) {
        setAudioFiles([]);
        console.error("Failed to fetch audio files:", error);
        setError(true);
      } finally {
        setLoading(false); // stop loading after fetch completes
      }
    };

    getData();
  }, []);

  return (
    <AudioListContext value={{ audioFiles, loading, error }}>
      {children}
    </AudioListContext>
  );
};

export const useAudioList = () => {
   return useContext(AudioListContext)
};
