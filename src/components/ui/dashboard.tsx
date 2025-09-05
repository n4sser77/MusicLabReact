import { useAudioList } from "@/contexts/AudioListContext";
import FileComponent, { type FileComponentProps } from "./file-component";

import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";

export default function Dashboard() {
  const { audioFiles, loading, error } = useAudioList();
  console.log("audiofiles: ", audioFiles);
  return (
    <AudioPlayerProvider>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && <p>Loading...</p>}
            {audioFiles.length < 1 && (
              <div className="  w-full col-span-full">
                <p className="text-center font-semibold text-gray-600 bg-gray-100 rounded-md px-4 py-3 opacity-80">
                  Drag and drop an audio file to preview and save it.
                </p>
              </div>
            )}

            {error && <p>Error: {error}</p>}
            {audioFiles.map((item: FileComponentProps, index: number) => (
              <FileComponent
                key={index}
                title={item.title}
                filepath={item.filepath}
                waveFormImageBase64={item.waveFormImageBase64}
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
