import { FPS } from "./constants";
import { TimelineText } from "./types";
import { PlayerRef } from "@remotion/player";
import { useCurrentPlayerFrame } from "./hooks/use-current-player-frame";
import { useRef } from "react";
import TimelineTextComponent from "./TimelineTextComponent";
import TimelineMarker from "./TimelineMarker";
import TimelineAudioComponent from "./TimelineAudioComponent";

function generateTimeSequence(interval: number, count: number): string[] {
  const sequence: string[] = [];

  for (let i = 0; i < count; i++) {
    const totalSeconds = (i * interval) / 1000;
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    sequence.push(`${minutes}:${seconds}`);
  }

  return sequence;
}

interface TimelineProps {
  playerRef: React.RefObject<PlayerRef | null>;
  lyrics: TimelineText[];
}

export default function Timeline({ playerRef, lyrics }: TimelineProps) {
  const totalDuration = 148; // This should be derived from the actual length of the audio.
  const timeLabelWidth = 100;

  const interval = 1000; // 1 second
  const trackCount = 2;
  const timeLabels = generateTimeSequence(interval, totalDuration);

  const frame = useCurrentPlayerFrame(playerRef);

  const timelineRef = useRef<HTMLDivElement>(null); // Ref for the timeline div
  const timelineWidth = totalDuration * timeLabelWidth;

  // Calculate the marker's position based on the current frame
  const currentTime = frame / FPS; // Convert frame to seconds
  const markerPosition = (currentTime / totalDuration) * timelineWidth;

  return (
    <div className="flex flex-row max-w-dvw h-[120px]">
      <div className="border border-r-0 w-1/4">
        <div className="h-[30px] border-b"></div>
        {Array.from({ length: trackCount }, (_, i) => (
          <div
            key={i}
            className="border-b px-8 flex items-center justify-center h-[33px]"
          >
            Track {i + 1}
          </div>
        ))}
      </div>
      <div className="border overflow-y-scroll w-3/4 relative">
        <div className="flex flex-row h-[30px]" id="timeSequence">
          {timeLabels.map((label, i) => (
            <div
              key={i}
              className="border-b border-l px-2 first:border-l-0 flex items-end justify-end-safe text-sm"
              style={{
                minWidth: timeLabelWidth,
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          id="timeline"
          className="relative w-full h-full"
          ref={timelineRef}
          style={{
            maxWidth: timelineWidth,
          }}
        >
          {lyrics.map((item, i) => {
            return (
              <TimelineTextComponent
                item={item}
                key={`timeline-text-${i}`}
                timelineWidth={timelineWidth}
                totalDuration={totalDuration}
                trackNumber={0}
              />
            );
          })}
          <TimelineAudioComponent
            timelineWidth={timelineWidth}
            trackNumber={1}
          />
        </div>
        <TimelineMarker markerPosition={markerPosition} />
      </div>
    </div>
  );
}
