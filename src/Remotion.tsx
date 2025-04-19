import { AbsoluteFill, Sequence, Audio, useCurrentFrame } from "remotion";
import { Item, RemotionTrack } from "./types";
import useEditor from "./state/use-editor";

interface HighlightedTextProps {
  wordsWithTimestamps: { word: string; timestamp: number }[];
  absoluteFrame: number;
}

export const HighlightedVerses: React.FC<HighlightedTextProps> = ({
  wordsWithTimestamps,
  absoluteFrame,
}) => {
  const wordOccurrences: Record<string, number> = {};
  const { wordToHighlightMap } = useEditor();

  const lines: { word: string; timestamp: number }[][] = [];
  let currentLine: { word: string; timestamp: number }[] = [];

  wordsWithTimestamps.forEach((entry) => {
    if (entry.word === "\n") {
      lines.push(currentLine);
      currentLine = [];
    } else {
      currentLine.push(entry);
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        fontSize: "48px",
        fontWeight: "bold",
        padding: "1em",
        boxSizing: "border-box",
        lineHeight: "1.5",
      }}
    >
      {lines.map((line, lineIndex) => (
        <div
          key={lineIndex}
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {line.map(({ word, timestamp }, wordIndex) => {
            const occurrence = wordOccurrences[word] || 0;
            wordOccurrences[word] = occurrence + 1;

            const isHighlighted = absoluteFrame >= timestamp;
            const toHighlight = wordToHighlightMap[word];

            return (
              <span
                key={wordIndex}
                style={{
                  backgroundColor: isHighlighted
                    ? toHighlight
                      ? toHighlight
                      : "transparent"
                    : "transparent",
                  padding: "0.2em",
                  borderRadius: "0.2em",
                  marginRight: "0.2em", // Add spacing between words
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
  frame: number;
}> = ({ item, frame }) => {
  if (item.type === "highlightedVerses") {
    return (
      <HighlightedVerses
        wordsWithTimestamps={item.wordsWithTimestamps}
        absoluteFrame={frame}
      />
    );
  }

  if (item.type === "audio") {
    return (
      <AbsoluteFill>
        <Audio src={item.src} />
      </AbsoluteFill>
    );
  }
};

const Track: React.FC<{
  track: RemotionTrack;
}> = ({ track }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {track.items.map((item) => {
        return (
          <Sequence
            key={item.id}
            from={item.from}
            durationInFrames={item.durationInFrames}
          >
            <ItemComp item={item} frame={frame} />
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
