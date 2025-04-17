import { useMemo, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Timeline from "./Timeline";
import { Player, PlayerRef } from "@remotion/player";
import { Item, RemotionTrack } from "./types";
import { Main } from "./Remotion";
import { wordData } from "./data";

function App() {
  const filteredWordData = wordData.filter((word) => {
    return word.type === "text";
  });

  const wordsWithTimestamps = filteredWordData.map((word) => {
    return {
      word: word.value,
      timestamp: word.ts * 30, // Assuming each word is 30 frames long
      durationInFrames: (word.end_ts - word.ts) * 30,
    };
  });

  const texts = wordsWithTimestamps.map((word) => {
    return {
      type: "text",
      text: word.word,
      durationInFrames: word.durationInFrames,
      from: word.timestamp,
    };
  });

  const [tracks, setTracks] = useState<RemotionTrack[]>([
    {
      name: "Track 1",
      items: texts,
    },
    {
      name: "Track 2",
      items: [
        {
          type: "audio",
        },
      ],
    },
    {
      name: "Track 3",
      items: [
        {
          type: "highlight",
          wordsWithTimestamps: wordsWithTimestamps,
        },
      ],
    },
  ]);

  const inputProps = useMemo(() => {
    return {
      tracks,
    };
  }, [tracks]);

  const playerRef = useRef<PlayerRef>(null);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <Player
          style={{
            height: "400px",
          }}
          component={Main}
          fps={30}
          inputProps={inputProps}
          durationInFrames={600}
          compositionWidth={1080}
          compositionHeight={1920}
          controls
          ref={playerRef}
        />
        <Timeline tracks={tracks} playerRef={playerRef} />
      </div>
    </>
  );
}

export default App;
