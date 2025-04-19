type BaseItem = {
  from: number;
  durationInFrames: number;
  id: string;
};

export type SolidItem = BaseItem & {
  type: "solid";
  color: string;
};

export type TextItem = BaseItem & {
  type: "text";
  text: string;
  color: string;
};

export type VideoItem = BaseItem & {
  type: "video";
  src: string;
};

export type AudioItem = BaseItem & {
  type: "audio";
  src: string;
};

export type WordsWithTimestamps = {
  word: string;
  timestamp: number;
  durationInFrames: number;
};

export type HighlightedVerses = BaseItem & {
  type: "highlightedVerses";
  wordsWithTimestamps: WordsWithTimestamps[];
};

export type Item =
  | SolidItem
  | TextItem
  | VideoItem
  | AudioItem
  | HighlightedVerses;

export type RemotionTrack = {
  name: string;
  items: Item[];
};

export type TimelineText = {
  text: string;
  durationInFrames: number;
  from: number;
};
