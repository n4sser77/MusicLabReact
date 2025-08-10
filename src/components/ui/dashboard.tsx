import useAudioList from "@/hooks/useAudioList";
import FileComponent, { type FileComponentProps } from "./file-component";

import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { useAuth } from "@/contexts/AuthContext";



export default function Dashboard() {
  const { userId } = useAuth();
  const { audioFiles, loading, error } = useAudioList(null);
  console.log("audiofiles: ",audioFiles)
  return (
    <AudioPlayerProvider>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {audioFiles.map((item: FileComponentProps, index: number) => (
              <FileComponent
                key={index}
                title={item.title}
                filepath={item.filepath}
                waveBase64={item.waveBase64}
                id={item.id}
                bpm={item.bpm}
                genre={item.genre}
              />
            ))}
          </div>
        </div>
      </div>
    </AudioPlayerProvider>
  );
}
