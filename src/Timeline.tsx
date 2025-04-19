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
  const timeLabelWidth = 200;

  const interval = 1000; // 1 second
  const trackCount = 2;
  const timeLabels = generateTimeSequence(interval, totalDuration);

  const frame = useCurrentPlayerFrame(playerRef);

  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineWidth = totalDuration * timeLabelWidth;

  const currentTime = frame / FPS; // Convert frame to seconds
  const markerPosition = (currentTime / totalDuration) * timelineWidth;

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !playerRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left; // Get the click position relative to the timeline
    const newTime = (clickX / timelineWidth) * totalDuration; // Calculate the new time in seconds
    const newFrame = Math.round(newTime * FPS); // Convert time to frames

    // Update the player's current frame
    playerRef.current.seekTo(newFrame);
  };

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
      <div
        className="border overflow-y-scroll w-3/4 relative cursor-default"
        onClick={handleTimelineClick}
        ref={timelineRef}
      >
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
