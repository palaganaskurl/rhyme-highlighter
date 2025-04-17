import React from "react";

interface TimelineMarkerProps {
  markerPosition: number;
}

const TimelineMarker: React.FC<TimelineMarkerProps> = ({ markerPosition }) => {
  return (
    <div
      className="pointer-events-none absolute top-0 flex h-full flex-col items-center ml-[-9px] z-99999"
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
              fill: "blue",
            }}
          />
        </svg>
      </div>
      <div className="h-full w-[2px] bg-blue-500 mt-[-2px]"></div>
    </div>
  );
};

export default TimelineMarker;
