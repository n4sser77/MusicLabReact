import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, EllipsisVertical, Download, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { formatTime } from "@/helpers/formatTime";
import { buildAudioStreamUrl } from "@/helpers/buildAudioStreamUrl";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { useDeleteAudio } from "@/hooks/useAudioDelete";
import { useDownloadAudio } from "@/hooks/useDownloadAudio";
import EditAudioDialog from "@/components/EditAudioDialog";
import type { EditableAudioData } from "@/components/EditAudioDialog";
import type { FileComponentProps } from "../../Types";

export default function FileComponent(track: FileComponentProps) {
  const { isPlaying, currentUrl, togglePlay, duration, currentTime } =
    useAudioPlayer();
  const { deleteFile } = useDeleteAudio();
  const { downloadFile } = useDownloadAudio();

  const fullUrl = buildAudioStreamUrl(track.filepath);

  const playingThisTrack = currentUrl === fullUrl && isPlaying;

  const initialDialogData: EditableAudioData = {
    id: track.id,
    title: track.title,
    bpm: track.bpm,
    genre: track.genre,
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold break-words max-w-full whitespace-normal">
          {track.title}
        </CardTitle>
        <CardDescription>
          <span>Bpm: {track.bpm}</span>
          <hr></hr>
          <span>Genre: {track.genre}</span>
        </CardDescription>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="size-8">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()} // prevents auto-close
              >
                <EditAudioDialog initialData={initialDialogData} />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center justify-between">
                <Button
                  variant="link"
                  onClick={() => deleteFile(track.id)}
                  className="text-red-500 font-medium"
                >
                  Delete
                </Button>
                <Trash />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-between">
              <Button
                onClick={() => downloadFile(track.title)}
                variant="link"
                className=" font-medium"
              >
                Download
              </Button>
              <Download />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="w-full h-20 bg-secondary rounded-md flex items-center justify-center text-muted-foreground p-0">
          <img
            src={"data:image/png;base64, " + track.waveFormImageBase64}
            className="p-5"
            alt="waveform"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {playingThisTrack
              ? `${formatTime(currentTime)} / ${formatTime(duration)}`
              : `0:00 / 0:00`}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => await togglePlay(track.filepath)}
          >
            {playingThisTrack ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
