"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

type Img = { src: string; srcSet?: string; label: string };

function Handle() {
  return (
    <div className="relative flex h-full w-0.5 cursor-ew-resize items-center justify-center bg-[#ff5a36] shadow-[0_0_14px_rgb(255_90_54/0.7)]">
      <div className="absolute grid size-11 place-items-center rounded-full border-2 border-[#ff5a36] bg-[#0a0e0d] text-white shadow-lg">
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M9 6 3 12l6 6M15 6l6 6-6 6" />
        </svg>
      </div>
    </div>
  );
}

export default function CompareSlider({
  before,
  after,
}: {
  before: Img;
  after: Img;
}) {
  const sizes = "(min-width: 1280px) 1216px, 100vw";
  return (
    <ReactCompareSlider
      handle={<Handle />}
      defaultPosition={50}
      className="aspect-[4/3] w-full sm:aspect-[16/9]"
      itemOne={
        <ReactCompareSliderImage
          src={before.src}
          srcSet={before.srcSet}
          sizes={sizes}
          alt={before.label}
          loading="lazy"
        />
      }
      itemTwo={
        <ReactCompareSliderImage
          src={after.src}
          srcSet={after.srcSet}
          sizes={sizes}
          alt={after.label}
          loading="lazy"
        />
      }
    />
  );
}
