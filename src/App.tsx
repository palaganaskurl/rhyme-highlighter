import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Timeline from "./Timeline";
import { Player, PlayerRef } from "@remotion/player";
import { Item, RemotionTrack, WordsWithTimestamps } from "./types";
import { Main } from "./Remotion";
import { FPS } from "./constants";
import TextEditor from "./TextEditor";
import LyricsEditor from "./LyricsEditor";
import useEditor from "./state/use-editor";
import { load } from "./speech-to-text-loaders";

function App() {
  const { wordsWithTimestamps, setWordsWithTimestamps } = useEditor();

  useEffect(() => {
    const loadJSON = async () => {
      const response = await fetch("/ell.json");
      const data = await response.json();

      return data;
    };

    const loadData = async () => {
      const data = await loadJSON();
      const wordsWithTimestamps = load({
        source: "elevenlabs",
        content: data,
      });

      setWordsWithTimestamps(wordsWithTimestamps);
    };

    loadData();
  }, [setWordsWithTimestamps]);

  const timelineTexts = wordsWithTimestamps.map((word) => {
    return {
      text: word.word,
      durationInFrames: word.durationInFrames,
      from: word.timestamp,
    };
  });

  const [tracks, setTracks] = useState<RemotionTrack[]>([]);

  useEffect(() => {
    const highlightedVerses = wordsWithTimestamps.reduce<
      WordsWithTimestamps[][]
    >(
      (chunks, word) => {
        if (word.word === "\n\n\n") {
          chunks.push([]);
        } else {
          chunks[chunks.length - 1].push(word);
        }
        return chunks;
      },
      [[]]
    );

    if (highlightedVerses[highlightedVerses.length - 1].length === 0) {
      setTracks([]);

      return;
    }

    const trackItems = highlightedVerses.map((chunk, index) => ({
      id: `highlightedVerses-${index + 1}`,
      type: "highlightedVerses",
      wordsWithTimestamps: chunk,
      from: chunk[0]?.timestamp || 0,
      durationInFrames:
        (chunk[chunk.length - 1]?.timestamp || 0) - (chunk[0]?.timestamp || 0),
    }));

    setTracks([
      {
        name: "Track 1",
        items: trackItems as Item[],
      },
      {
        name: "Track 2",
        items: [
          {
            type: "audio",
            src: "/imahinasyon.mp3",
          } as Item,
        ],
      },
    ]);
  }, [wordsWithTimestamps]);

  const inputProps = useMemo(() => {
    return {
      tracks,
    };
  }, [tracks]);
  const playerRef = useRef<PlayerRef>(null);
  const lyrics = useMemo(() => {
    return wordsWithTimestamps
      .map((word, index) => {
        const nextWord = wordsWithTimestamps[index + 1]?.word;

        if (
          word.word === "\n" ||
          nextWord === "\n" ||
          word.word === "\n\n\n" ||
          nextWord === "\n\n\n"
        ) {
          return word.word;
        }

        return word.word + " ";
      })
      .join("");
  }, [wordsWithTimestamps]);

  // const totalDuration = 148; // This should be derived from the actual length of the audio.
  const totalDuration = 63; // This should be derived from the actual length of the audio.

  return (
    <div className="container p-4 mx-auto">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <LyricsEditor lyrics={lyrics} />
        </div>
        <div className="flex flex-row items-center justify-center">
          <Player
            style={{
              height: "400px",
            }}
            component={Main}
            fps={30}
            inputProps={inputProps}
            durationInFrames={totalDuration * FPS}
            compositionWidth={1920}
            compositionHeight={1080}
            controls
            ref={playerRef}
            acknowledgeRemotionLicense
          />
        </div>
        <div>
          <TextEditor />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <Timeline
          playerRef={playerRef}
          lyrics={timelineTexts}
          totalDuration={totalDuration}
        />
      </div>
    </div>
  );
}

export default App;
