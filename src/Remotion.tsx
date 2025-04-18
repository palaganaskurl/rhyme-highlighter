import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  Audio,
  useCurrentFrame,
} from "remotion";
import { Item, RemotionTrack } from "./types";
import { nanoid } from "nanoid";

interface HighlightedTextProps {
  wordsWithTimestamps: { word: string; timestamp: number }[]; // Array of objects with word and timestamp
}

export const HighlightedVerses: React.FC<HighlightedTextProps> = ({
  wordsWithTimestamps,
}) => {
  const frame = useCurrentFrame();

  const wordOccurrences: Record<string, number> = {};

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "row", // Stack lines vertically
        alignItems: "center",
        justifyContent: "center",
        fontSize: "48px",
        fontWeight: "bold",
        // textAlign: "center",
        padding: "1em", // Add padding to prevent text from touching edges
        boxSizing: "border-box", // Ensure padding is included in the size
        flexWrap: "wrap", // Allow words to wrap to the next line
      }}
    >
      {wordsWithTimestamps.map(({ word, timestamp }, index) => {
        // Track the occurrence of the word
        const occurrence = wordOccurrences[word] || 0;

        // Increment the occurrence count for the next word
        wordOccurrences[word] = occurrence + 1;

        // Highlight logic for each word
        const isHighlighted = frame >= timestamp; // Highlight persists after the timestamp

        return (
          <span
            key={index}
            style={{
              backgroundColor: isHighlighted ? "yellow" : "transparent", // Highlight active and past words
              padding: "0.2em",
              borderRadius: "0.2em",
            }}
          >
            {word}
          </span>
        );
      })}
    </AbsoluteFill>
  );
};

export const ItemComp: React.FC<{
  item: Item;
}> = ({ item }) => {
  if (item.type === "highlightedVerses") {
    return <HighlightedVerses wordsWithTimestamps={item.wordsWithTimestamps} />;
  }

  if (item.type === "audio") {
    return (
      <AbsoluteFill>
        <Audio src={item.src} />
      </AbsoluteFill>
    );
  }

  //   if (item.type === "solid") {
  //     return <AbsoluteFill style={{ backgroundColor: item.color }} />;
  //   }

  //   if (item.type === "text") {
  //     return (
  //       <AbsoluteFill
  //         style={{
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //         }}
  //       >
  //         <h1
  //           style={{
  //             backgroundColor: "yellow",
  //           }}
  //         >
  //           {item.text}
  //         </h1>
  //       </AbsoluteFill>
  //     );
  //   }

  if (item.type === "video") {
    return <OffthreadVideo src={item.src} />;
  }

  //   throw new Error(`Unknown item type: ${JSON.stringify(item)}`);
};

const Track: React.FC<{
  track: RemotionTrack;
}> = ({ track }) => {
  return (
    <AbsoluteFill>
      {track.items.map((item) => {
        return (
          <Sequence
            key={item.id}
            from={item.from}
            durationInFrames={item.durationInFrames}
          >
            <ItemComp item={item} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const Main: React.FC<{
  tracks: RemotionTrack[];
}> = ({ tracks }) => {
  return (
    <AbsoluteFill>
      {tracks.map((track) => {
        console.log(track);

        return <Track track={track} key={track.name} />;
      })}
    </AbsoluteFill>
  );
};
