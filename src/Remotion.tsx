import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  Audio,
  useCurrentFrame,
} from "remotion";
import { Item, RemotionTrack } from "./types";

interface HighlightedTextProps {
  wordsWithTimestamps: { word: string; timestamp: number }[]; // Array of objects with word and timestamp
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  wordsWithTimestamps,
}) => {
  const frame = useCurrentFrame(); // Get the current frame

  // Flatten the words into a single array of words, preserving line breaks
  const flattenedLyrics = wordsWithTimestamps.map((entry) => entry.word);

  // Track occurrences of words to handle duplicates
  const wordOccurrences: Record<string, number> = {};

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column", // Stack lines vertically
        alignItems: "center",
        justifyContent: "center",
        fontSize: "48px",
        fontWeight: "bold",
        textAlign: "center",
        padding: "1em", // Add padding to prevent text from touching edges
        boxSizing: "border-box", // Ensure padding is included in the size
      }}
    >
      {flattenedLyrics
        .join(" ") // Join words into a single string
        .split("\n") // Split by newlines
        .map((line, lineIndex) => (
          <div
            key={lineIndex}
            style={{
              marginBottom: "0.5em",
              maxWidth: "90%", // Ensure lines don't exceed screen width
              wordWrap: "break-word", // Break long words if necessary
            }}
          >
            {line.split(" ").map((word, wordIndex) => {
              if (word.trim() === "") {
                // Skip empty words caused by newlines
                return null;
              }

              // Track the occurrence of the word
              const occurrence = wordOccurrences[word] || 0;

              // Find the correct global index for this occurrence
              let globalIndex = -1;
              let count = 0;
              for (let i = 0; i < flattenedLyrics.length; i++) {
                if (flattenedLyrics[i] === word) {
                  if (count === occurrence) {
                    globalIndex = i;
                    break;
                  }
                  count++;
                }
              }

              // Increment the occurrence count for the next word
              wordOccurrences[word] = occurrence + 1;

              // Highlight logic for each word
              const isHighlighted =
                frame >= wordsWithTimestamps[globalIndex].timestamp; // Highlight persists after the timestamp

              return (
                <span
                  key={wordIndex}
                  style={{
                    backgroundColor: isHighlighted ? "yellow" : "transparent", // Highlight active and past words
                    padding: "0.2em",
                    borderRadius: "0.2em",
                    margin: "0.1em", // Add spacing between words
                    display: "inline-block", // Ensure proper spacing
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ))}
    </AbsoluteFill>
  );
};

export const ItemComp: React.FC<{
  item: Item;
}> = ({ item }) => {
  if (item.type === "highlight") {
    return <HighlightedText wordsWithTimestamps={item.wordsWithTimestamps} />;
  }

  if (item.type === "audio") {
    return (
      <AbsoluteFill>
        <Audio src="/test.mp3" />
      </AbsoluteFill>
    );
  }

  if (item.type === "solid") {
    return <AbsoluteFill style={{ backgroundColor: item.color }} />;
  }

  if (item.type === "text") {
    return <></>;
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            backgroundColor: "yellow",
          }}
        >
          {item.text}
        </h1>
      </AbsoluteFill>
    );
  }

  if (item.type === "video") {
    return <OffthreadVideo src={item.src} />;
  }

  throw new Error(`Unknown item type: ${JSON.stringify(item)}`);
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
        return <Track track={track} key={track.name} />;
      })}
    </AbsoluteFill>
  );
};
