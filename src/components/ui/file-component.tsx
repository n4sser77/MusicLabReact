import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export interface FileComponentProps {
  title: string;
  url: string;
  waveBase64: string;
  bpm:number;
  genre: string;
  id: number;
}

export default function FileComponent(track: FileComponentProps) {
  const { isPlaying, currentUrl, togglePlay } = useAudioPlayer();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{track.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 ">
        <div className="w-full h-20 bg-secondary rounded-md flex items-center justify-center text-muted-foreground p-7">
          Waveform
          {/* <img src="" className="p-5" alt="placeholder" /> */}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">0:00 / 3:45</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => togglePlay(track.url)}
          >
            {isPlaying && currentUrl === track.url ? (
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
