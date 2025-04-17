import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Rnd, RndDragEvent, DraggableData } from "react-rnd";
import { FPS } from "./constants";
import useEditor from "./state/use-editor";
import { TextItem } from "./types";

interface TimelineTextComponentProps {
  item: TextItem;
  timelineWidth: number;
  totalDuration: number;
  trackNumber: number;
}

const TimelineTextComponent: React.FC<TimelineTextComponentProps> = ({
  item,
  timelineWidth,
  totalDuration,
  trackNumber,
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
  const initialWidth =
    (item.durationInFrames / (FPS * totalDuration)) * timelineWidth;
  const [size, setSize] = useState({
    width: initialWidth,
    height: 32,
  });
  const TRACK_HEIGHT = 33;
  const [position, setPosition] = useState({
    x: (item.from / FPS / totalDuration) * timelineWidth, // Let's divide by FPS to get the time in seconds
    y: trackNumber * TRACK_HEIGHT,
  });
  const handleDrag = (e: RndDragEvent, d: DraggableData) => {
    setPosition({
      x: d.x,
      y: d.y,
    });
  };

  const { setCurrentEditedItem } = useEditor();

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
          width: parseFloat(ref.style.width),
          height: parseFloat(ref.style.height),
        });
      }}
      dragAxis="both"
      dragGrid={[25, 33]}
      enableResizing={{
        left: true,
        right: true,
      }}
      onDrag={handleDrag}
      onClick={() => {
        setCurrentEditedItem(item);
      }}
    >
      {item.text}
    </Rnd>
  );
};

export default TimelineTextComponent;
