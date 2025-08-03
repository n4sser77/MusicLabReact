import { useEffect, useRef, useState } from "react";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  const play = (url: string) => {
    if (!audioRef.current) return;

    if (currentUrl !== url) {
      audioRef.current.src = url;
      setCurrentUrl(url);
    }

    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlay = (url: string) => {
    if (!audioRef.current) return;

    if (currentUrl === url && isPlaying) {
      pause();
    } else {
      play(url);
    }
  };

  return {
    isPlaying,
    currentUrl,
    play,
    pause,
    togglePlay,
  };
}
