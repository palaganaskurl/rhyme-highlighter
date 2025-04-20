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
    const handleSelectionChange = () => {
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
    "oklch(0.82 0.15 25)", // Strong Pink
    "oklch(0.84 0.17 75)", // Vibrant Peach
    "oklch(0.83 0.12 145)", // Fresh Mint
    "oklch(0.83 0.13 250)", // Bright Sky Blue
    "oklch(0.81 0.14 310)", // Rich Lavender
    "oklch(0.82 0.16 40)", // Warm Coral
    "oklch(0.85 0.18 115)", // Zesty Lime
    "oklch(0.86 0.13 220)", // Ocean Blue
    "oklch(0.87 0.19 100)", // Bold Lemon
    "oklch(0.80 0.08 230)", // Cool Gray-Blue
  ];

  const findWordIndexFromCursor = (
    containerRef: React.RefObject<HTMLDivElement | null>,
    wordsWithTimestamps: Array<{
      word: string;
      timestamp: number;
      durationInFrames: number;
    }>
  ): number => {
    const selection = window.getSelection();
    if (!selection || !containerRef.current) return -1;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(containerRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const textBeforeCursor = preCaretRange.toString();

    let targetLength = textBeforeCursor.length;
    let currentLength = 0;

    console.log("Target length:", targetLength);

    for (let i = 0; i < wordsWithTimestamps.length; i++) {
      const word = wordsWithTimestamps[i].word;
      const isNewline = word === "\n" || word === "\n\n\n";

      // Add word length
      currentLength += word.length;

      // Only add space if:
      // 1. Current word is not a newline
      // 2. Not the last word
      // 3. Next word is not a newline
      if (
        !isNewline &&
        i < wordsWithTimestamps.length - 1 &&
        wordsWithTimestamps[i + 1].word !== "\n" &&
        wordsWithTimestamps[i + 1].word !== "\n\n\n"
      ) {
        currentLength += 1;
      }

      // Return current index if we've reached or exceeded the target length
      if (currentLength >= targetLength) {
        return i;
      }
    }

    return wordsWithTimestamps.length - 1;
  };

  const handleInsertNewLine = (newLine: string) => {
    const wordIndex = findWordIndexFromCursor(
      containerRef,
      wordsWithTimestamps
    );

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
      <div className="flex flex-row justify-center items-center gap-2 flex-nowrap">
        {availableColors.map((color, index) => {
          return (
            <div
              key={`color-${index}`}
              className="rounded-full size-6 border shrink-0"
              style={{
                backgroundColor: color,
              }}
              onClick={() => {
                applyHighlight(color);
              }}
            ></div>
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
        }}
        suppressContentEditableWarning
      >
        {lyrics}
      </div>
    </div>
  );
};

export default LyricsEditor;
