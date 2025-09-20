import { useAudioList } from "@/contexts/AudioListContext";
import FileComponent from "./file-component";
import { type FileComponentProps } from "../../Types";

import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function Dashboard() {
  const { audioFiles, loading, error } = useAudioList();
  console.log("audiofiles: ", audioFiles);
  return (
    <AudioPlayerProvider>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Loading skeleton */}
            {loading && (
              <>
                <Skeleton className="h-40 w-full rounded-lg col-span-full" />
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-40 w-full rounded-lg" />
              </>
            )}

            {/* Empty state */}
            {audioFiles.length < 1 && !loading && !error && (
              <div className="w-full col-span-full">
                <p className="text-center font-semibold text-gray-600 bg-gray-100 rounded-md px-4 py-3 opacity-80">
                  Drag and drop an audio file to preview and save it.
                </p>
              </div>
            )}

            {/* Error alert */}
            {error && (
              <Alert variant="destructive" className="col-span-full">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Files */}
            {Array.isArray(audioFiles) &&
              audioFiles.map((item: FileComponentProps) => (
                <FileComponent
                  key={item.id}
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
