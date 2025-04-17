interface TimelineAudioComponentProps {
  timelineWidth: number;
  trackNumber: number;
}

const TimelineAudioComponent: React.FC<TimelineAudioComponentProps> = ({
  timelineWidth,
  trackNumber,
}) => {
  const TRACK_HEIGHT = 33;

  return (
    <div
      className="absolute bg-cyan-600 h-[32px]"
      style={{
        top: trackNumber * TRACK_HEIGHT,
        width: timelineWidth,
      }}
    >
      Filename should be here!
    </div>
  );
};

export default TimelineAudioComponent;
