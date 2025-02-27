import React, { useMemo } from 'react';

const WordCloud = () => {
  // Use useMemo to generate the words with random rotations only once
  const words = useMemo(() => [
    { text: "united states", size: "text-5xl", color: "text-emerald-600", weight: "font-bold", rotate: Math.random() * 2 - 1 },
    { text: "international trade", size: "text-4xl", color: "text-purple-500", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "softwood lumber", size: "text-4xl", color: "text-emerald-500", weight: "font-bold", rotate: Math.random() * 2 - 1 },
    { text: "economic statement", size: "text-3xl", color: "text-purple-600", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "conservatives", size: "text-3xl", color: "text-emerald-500", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "confidence vote", size: "text-2xl", color: "text-orange-500", weight: "font-bold", rotate: Math.random() * 2 - 1 },
    { text: "jobs", size: "text-2xl", color: "text-orange-600", weight: "font-bold", rotate: Math.random() * 2 - 1 },
    { text: "finance", size: "text-2xl", color: "text-amber-500", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "industry", size: "text-xl", color: "text-green-600", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "tariffs", size: "text-xl", color: "text-blue-500", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "agreement", size: "text-xl", color: "text-red-500", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "climate action", size: "text-lg", color: "text-emerald-500", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "public safety", size: "text-lg", color: "text-orange-500", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "housing", size: "text-lg", color: "text-purple-500", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "immigration", size: "text-base", color: "text-amber-600", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "healthcare", size: "text-base", color: "text-pink-500", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "budget", size: "text-base", color: "text-gray-600", weight: "font-normal", rotate: Math.random() * 2 - 1 },
    { text: "infrastructure", size: "text-sm", color: "text-lime-600", weight: "font-normal", rotate: Math.random() * 2 - 1 }
  ], []); // Empty dependency array ensures this runs only once

  return (
    <div className="py-12 px-4">
      <div className="flex flex-wrap justify-center items-center gap-2 text-center leading-none">
        {words.map((word, index) => (
          <span
            key={index}
            className={`
              ${word.size} ${word.color} ${word.weight}
              cursor-pointer
              hover:opacity-80
              inline-block
            `}
            style={{
              transform: `rotate(${word.rotate}deg)`,
              padding: '0.25rem'
            }}
          >
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordCloud;