import { useMemo, useRef, useState } from "react";
import "./App.css";
import Timeline from "./Timeline";
import { Player, PlayerRef } from "@remotion/player";
import { Item, RemotionTrack } from "./types";
import { Main } from "./Remotion";
import { filteredWordDataRaw } from "./data";
import { FPS } from "./constants";
import TextEditor from "./TextEditor";

function App() {
  const wordsWithTimestamps = filteredWordDataRaw
    .map((word) => {
      return {
        word: word.value,
        timestamp: word.ts * FPS, // Assuming each word is 30 frames long
        durationInFrames: (word.end_ts - word.ts) * FPS,
      };
    })
    .slice(0, 100); // Limit to 10 words for testing

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
      items: texts as Item[],
    },
    {
      name: "Track 2",
      items: [
        {
          type: "audio",
          src: "/test.mp3",
        } as Item,
      ],
    },
    {
      name: "Track 3",
      items: [
        {
          type: "highlightedVerses",
          wordsWithTimestamps: wordsWithTimestamps,
        } as Item,
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-center">
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
          acknowledgeRemotionLicense
        />
        <TextEditor />
      </div>
      <div>
        <Timeline tracks={tracks} playerRef={playerRef} />
      </div>
    </div>
  );
}

export default App;
