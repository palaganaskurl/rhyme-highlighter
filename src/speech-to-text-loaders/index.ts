import { FPS } from "../constants";
import { WordsWithTimestamps } from "../types";

type SpeechToTextLoader = {
  source: "elevenlabs" | "revai";
  content: any;
};

const loadRevAI = (content: {
  monologues: {
    speaker: number;
    elements: (
      | {
          type: string;
          value: string;
          ts: number;
          end_ts: number;
          confidence: number;
        }
      | {
          type: string;
          value: string;
          ts?: undefined;
          end_ts?: undefined;
          confidence?: undefined;
        }
    )[];
  }[];
}): WordsWithTimestamps[] => {
  const wordsWithTimestamps = content.monologues
    .map((monologue) => {
      return monologue.elements;
    })
    .flat()
    .filter((element) => {
      return element.type === "text";
    })
    .map((word) => {
      return {
        word: word.value,
        timestamp: (word.ts ?? 0) * FPS,
        durationInFrames: ((word.end_ts ?? 0) - (word.ts ?? 0)) * FPS,
      };
    });

  return wordsWithTimestamps;
};

export const loadElevenLabs = (content: {
  segments: {
    text: string;
    words: {
      text: string;
      start: number;
      end: number;
      type: string;
      speaker_id: string;
      characters: null;
    }[];
  }[];
}): WordsWithTimestamps[] => {
  const wordsWithTimestamps = content.segments
    .map((segment) => {
      return segment.words
        .filter((word) => {
          return word.type === "word";
        })
        .map((word) => {
          // Temporary handling of punctuations because of highlighting issues
          // Replace . and ,
          word.text = word.text.replace(".", "");
          word.text = word.text.replace(",", "");

          return {
            word: word.text,
            timestamp: word.start * FPS,
            durationInFrames: (word.end - word.start) * FPS,
          };
        });
    })
    .flat();

  return wordsWithTimestamps;
};

export const load = ({
  source,
  content,
}: SpeechToTextLoader): WordsWithTimestamps[] => {
  switch (source) {
    case "elevenlabs":
      return loadElevenLabs(content);
    case "revai":
      return loadRevAI(content);
    default:
      throw new Error("Unknown source");
  }
};
