import { type FileComponentProps } from "@/components/ui/file-component";
import { useEffect, useState } from "react";

export default function useAudioList() {
  const [audioFiles, setAudioFiles] = useState<FileComponentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const url = "http://localhost:5106";

  useEffect(() => {
    fetch(`${url}/api/audio/getall`)
      .then((res) => res.json())
      .then((data) => {
        setAudioFiles(data);
        setLoading(false);
      });

      console.log(audioFiles)
  }, []);

  return { audioFiles, loading };
}
