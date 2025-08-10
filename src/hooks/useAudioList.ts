import { type FileComponentProps } from "@/components/ui/file-component";
import api from "@/lib/api";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";

// Init Supabase client (replace with your env or config)

export default function useAudioList(userId: string | null) {
  const [audioFiles, setAudioFiles] = useState<FileComponentProps[]>([]);
  const [loading, setLoading] = useState(true);
  //   const url = "http://localhost:5106";

  //   useEffect(() => {
  //     fetch(`${url}/api/audio/getall`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setAudioFiles(data);
  //         setLoading(false);
  //       });

  //     console.log(audioFiles);
  //   }, []);

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
      } finally {
        setLoading(false); // stop loading after fetch completes
      }
    };

    getData();
  }, []); // empty dependency array to run once on mount only

  //   // ✅ Supabase method
  //    useEffect(() => {
  //     if (!userId) return;

  //     const fetchFromBucket = async () => {
  //       const { data, error } = await supabase.storage
  //         .from("audio")
  //         .list(`${userId}/`, {
  //           limit: 100,
  //           offset: 0,
  //           sortBy: { column: "name", order: "asc" },
  //         });

  //       if (error) {
  //         console.error("Supabase error:", error.message);
  //         setLoading(false);
  //         return;
  //       }

  //       const files: FileComponentProps[] = data.map((file) => {
  //         const filePath = `${userId}/${file.name}`;
  //         return {
  //           title: file.name, // or parse the name more nicely
  //           url: supabase.storage.from("audio").getPublicUrl(filePath).data.publicUrl,
  //           id: 0, // if you have ids, map accordingly
  //           waveBase64: "",
  //           bpm: 0,
  //           genre: "",
  //         };
  //       });

  //       setAudioFiles(files);
  //       setLoading(false);
  //     };

  //     fetchFromBucket();
  //   }, [userId]);

  return { audioFiles, loading };
}
