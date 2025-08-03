import useAudioList from "@/hooks/useAudioList";
import FileComponent from "./file-component";
import { AuthForm } from "./authForm";

const files = [
  {
    title: "Hello world",
    url: "someUrl",
    waveBase64: "waveimgBase64",
  },
  {
    title: "Track 2",
    url: "url track 2",
    waveBase64: "waveimgBase64",
  },
  {
    title: "Yarens låt",
    url: "urlgeöoin",
    waveBase64: "someimg",
  },
  {
    title: "Some song",
    url: "osing",
    waveBase64: "ösoigja",
  },
  {
    title: "Some song 2",
    url: "osing2",
    waveBase64: "ösoigja2",
  },
];

export default function Dashboard() {
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((item) => (
            <FileComponent
              key={item.id}
              title={item.title}
              url={item.url}
              waveBase64={item.waveBase64}
              id={item.id}
              bpm={item.bpm}
              genre={item.genre}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
