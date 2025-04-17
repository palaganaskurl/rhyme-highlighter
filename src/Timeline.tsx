import RemotionComponent from "./RemotionComponent";
import { FPS } from "./constants";
import { RemotionTrack } from "./types";
import { PlayerRef } from "@remotion/player";
import { useCurrentPlayerFrame } from "./hooks/use-current-player-frame";
import { useRef } from "react";

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
  const trackCount = 3;
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
      <div
        className="border overflow-y-scroll w-3/4 relative"
        id="timeSequence"
      >
        <div className="flex flex-row h-[30px]">
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
          {tracks[0].items.map((item, i) => {
            return (
              <div key={i} className="relative">
                <div className="sticky left-0 bg-white z-10">
                  <RemotionComponent
                    key={i}
                    label={item.text}
                    timestamp={item.from}
                    trackIndex={0} // todo update
                    timelineWidth={timelineWidth}
                    totalDuration={totalDuration}
                    componentDuration={item.durationInFrames}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* Render the timeline marker */}
        <div
          className="pointer-events-none absolute top-0 flex h-full flex-col items-center"
          style={{
            left: `${markerPosition}px`,
          }}
        >
          <div className="sticky top-0 ">
            <svg
              viewBox="0 0 54 55"
              fill="none"
              style={{ width: 19, aspectRatio: "54 / 55", marginTop: "-1px" }}
            >
              <path
                d="M50.4313 37.0917L30.4998 51.4424C29.2419 52.3481 27.5581 52.3925 26.2543 51.5543L3.73299 37.0763C2.65291 36.382 2 35.1861 2 33.9021V5.77359C2 3.68949 3.68949 2 5.77358 2H48.2264C50.3105 2 52 3.68949 52 5.77358V34.0293C52 35.243 51.4163 36.3826 50.4313 37.0917Z"
                strokeWidth={3}
                stroke="black"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray="23.7 6.2 999"
                strokeOpacity={1}
                style={{
                  fill: "violet",
                }}
              />
            </svg>
          </div>

          <div className="h-full w-[2px] bg-red-500"></div>
        </div>
      </div>
    </div>
  );
}
