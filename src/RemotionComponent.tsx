import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Rnd, RndDragEvent, DraggableData } from "react-rnd";
import { FPS } from "./constants";

interface RemotionComponentProps {
  label: string;
  timestamp: number; // Start time of the clip in seconds
  trackIndex: number; // Index of the track
  timelineWidth: number; // Total width of the timeline in pixels
  totalDuration: number; // Total duration of the timeline in seconds
  componentDuration: number;
}

const RemotionComponent: React.FC<RemotionComponentProps> = ({
  label,
  timestamp,
  trackIndex,
  timelineWidth,
  totalDuration,
  componentDuration,
}) => {
  if (timelineWidth === 0) {
    return null;
  }

  const [toDrag, setToDrag] = useState(false);
  const handleMouseDown = () => {
    setToDrag(true);
  };
  const handleStop = (e: RndDragEvent, d: DraggableData) => {
    setToDrag(false);
  };
  const [size, setSize] = useState({
    width: componentDuration,
    height: 32,
  });
  const TRACK_HEIGHT = 33;
  const [position, setPosition] = useState({
    x: (timestamp / FPS / totalDuration) * timelineWidth, // Let's divide by FPS to get the time in seconds
    y: trackIndex * TRACK_HEIGHT,
  });
  const handleDrag = (e: RndDragEvent, d: DraggableData) => {
    setPosition({
      x: d.x,
      y: d.y,
    });
  };

  return (
    <Rnd
      style={{
        width: size.width,
      }}
      bounds="#timeline"
      position={position}
      size={size}
      className={twMerge(
        "h-[30px] bg-cyan-500 truncate",
        toDrag ? "outline outline-1 outline-indigo-600" : ""
      )}
      onMouseDown={handleMouseDown}
      onDragStop={handleStop}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: ref.style.width,
          height: ref.style.height,
        });
      }}
      dragAxis="both"
      dragGrid={[25, 33]}
      enableResizing={{
        left: true,
        right: true,
      }}
      onDrag={handleDrag}
    >
      {label}
    </Rnd>
  );
};

export default RemotionComponent;
