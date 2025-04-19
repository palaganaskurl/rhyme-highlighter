import { useEffect, useRef, useState } from "react";
import useEditor from "./state/use-editor";

interface LyricsEditorProps {
  lyrics: string;
}

const LyricsEditor: React.FC<LyricsEditorProps> = ({ lyrics }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);

  const {
    wordToHighlightMap,
    setWordToHighlightMap,
    wordsWithTimestamps,
    setWordsWithTimestamps,
  } = useEditor();

  useEffect(() => {
    const handleSelectionChange = (e: Event) => {
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed) return;

      const selectedText = selection?.toString().trim();
      const anchorNode = selection.anchorNode;
      const range = selection.getRangeAt(0);

      if (
        anchorNode &&
        containerRef.current &&
        containerRef.current.contains(anchorNode)
      ) {
        setSelectedText(selectedText);
        setSelectionRange(range);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const applyHighlight = (color: string) => {
    if (!selectionRange || !selectedText) return;

    const span = document.createElement("span");
    span.style.backgroundColor = color;
    span.textContent = selectedText;

    selectionRange.deleteContents();
    selectionRange.insertNode(span);

    setSelectedText(null);
    setSelectionRange(null);

    wordToHighlightMap[selectedText] = color;

    setWordToHighlightMap({ ...wordToHighlightMap });
  };

  const availableColors = [
    "oklch(63.7% 0.237 25.331)",
    "oklch(70.5% 0.213 47.604)",
    "oklch(76.9% 0.188 70.08)",
    "oklch(79.5% 0.184 86.047)",
  ];

  const handleInsertNewLine = (newLine: string) => {
    const selection = window.getSelection();
    if (!selection || !containerRef.current) return;

    const range = selection.getRangeAt(0);
    const cursorPosition = range.startOffset;

    let charCount = 0;
    let wordIndex = -1;

    for (let i = 0; i < wordsWithTimestamps.length; i++) {
      const word = wordsWithTimestamps[i].word;
      // Only add space if it's not a newline
      charCount += word.length + (word === "\n" ? 0 : 1);

      if (cursorPosition <= charCount) {
        wordIndex = i;
        break;
      }
    }

    if (wordIndex !== -1) {
      const updatedWords = [
        ...wordsWithTimestamps.slice(0, wordIndex + 1),
        { word: newLine, timestamp: 0, durationInFrames: 0 },
        ...wordsWithTimestamps.slice(wordIndex + 1),
      ];

      setWordsWithTimestamps(updatedWords);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const allowedKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[400px]">
      <div className="flex justify-center">
        Group Lyrics and Highlight Rhymes
      </div>
      <div className="flex flex-row justify-center gap-4">
        {availableColors.map((color, index) => {
          return (
            <button
              key={`color-${index}`}
              className="rounded-full size-[20px]"
              style={{
                backgroundColor: color,
              }}
              onClick={() => {
                applyHighlight(color);
              }}
            ></button>
          );
        })}
      </div>
      <div className="flex flex-row justify-center gap-4">
        <button
          className="btn btn-xs"
          onClick={() => handleInsertNewLine("\n")}
        >
          Insert New Line
        </button>
        <button
          className="btn btn-xs"
          onClick={() => handleInsertNewLine("\n\n\n")}
        >
          Move Lyrics Below To New Frame
        </button>
      </div>
      <div
        className="textarea w-full whitespace-pre-line overflow-y-scroll"
        contentEditable
        ref={containerRef}
        onInput={(e) => e.preventDefault()}
        onKeyDown={handleKeyDown}
        style={{
          minHeight: "200px",
          whiteSpace: "pre-wrap",
        }}
        suppressContentEditableWarning
      >
        {lyrics}
      </div>
    </div>
  );
};

export default LyricsEditor;
