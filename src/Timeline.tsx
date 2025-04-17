import { FPS } from "./constants";
import { RemotionTrack } from "./types";
import { PlayerRef } from "@remotion/player";
import { useCurrentPlayerFrame } from "./hooks/use-current-player-frame";
import { useRef } from "react";
import TimelineTextComponent from "./TimelineTextComponent";
import { nanoid } from "nanoid";
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
  tracks: RemotionTrack[];
  playerRef: React.RefObject<PlayerRef | null>;
}

export default function Timeline({ tracks, playerRef }: TimelineProps) {
  const totalDuration = 148; // This should be derived from the actual length of the audio.
  const timeLabelWidth = 100;

  const interval = 1000; // 1 second
  const trackCount = 2;
  const timeLabels = generateTimeSequence(interval, totalDuration); // 60 seconds

  const frame = useCurrentPlayerFrame(playerRef);

  const timelineRef = useRef<HTMLDivElement>(null); // Ref for the timeline div
  const timelineWidth = totalDuration * timeLabelWidth;

  // Calculate the marker's position based on the current frame
  const currentTime = frame / FPS; // Convert frame to seconds
  const markerPosition = (currentTime / totalDuration) * timelineWidth;

  return (
    <div className="flex flex-row h-[200px] max-w-dvw">
      <div className="border border-r-0 w-1/4">
        <div className="h-[30px] border-b">{frame}</div>
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
          {tracks[0].items.map((item) => {
            if (item.type === "text") {
              return (
                <TimelineTextComponent
                  item={item}
                  key={nanoid()}
                  timelineWidth={timelineWidth}
                  totalDuration={totalDuration}
                  trackNumber={0} // TODO: Update this
                />
              );
            }

            return null;
          })}
          {/* TODO: It's okay for this to have only one component */}
          {tracks[1].items.map((item) => {
            if (item.type === "audio") {
              return (
                <TimelineAudioComponent
                  key={nanoid()}
                  timelineWidth={timelineWidth}
                  trackNumber={1} // TODO: Update this
                />
              );
            }

            return null;
          })}
        </div>
        <TimelineMarker markerPosition={markerPosition} />
      </div>
    </div>
  );
}
