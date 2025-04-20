import { Composition, getInputProps } from "remotion";
import { Main } from "./Remotion";
import { FPS } from "./constants";

export const RemotionRoot: React.FC = () => {
  const { totalDuration } = getInputProps<{
    totalDuration: number;
  }>();

  return (
    <>
      <Composition
        component={Main}
        durationInFrames={totalDuration * FPS}
        width={1920}
        height={1080}
        fps={FPS}
        id="rhymedLyrics"
        defaultProps={{
          tracks: [],
          wordToHighlightMap: {},
        }}
      />
    </>
  );
};
