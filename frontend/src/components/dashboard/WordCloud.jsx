import React from 'react';

const WordCloud = () => {
  const words = [
    { text: "united states", size: "text-5xl", color: "text-emerald-600", weight: "font-bold" },
    { text: "international trade", size: "text-4xl", color: "text-purple-500", weight: "font-normal" },
    { text: "softwood lumber", size: "text-4xl", color: "text-emerald-500", weight: "font-bold" },
    { text: "economic statement", size: "text-3xl", color: "text-purple-600", weight: "font-normal" },
    { text: "conservatives", size: "text-3xl", color: "text-emerald-500", weight: "font-normal" },
    { text: "confidence vote", size: "text-2xl", color: "text-orange-500", weight: "font-bold" },
    { text: "jobs", size: "text-2xl", color: "text-orange-600", weight: "font-bold" },
    { text: "finance", size: "text-2xl", color: "text-amber-500", weight: "font-normal" },
    { text: "industry", size: "text-xl", color: "text-green-600", weight: "font-normal" },
    { text: "tariffs", size: "text-xl", color: "text-blue-500", weight: "font-normal" },
    { text: "agreement", size: "text-xl", color: "text-red-500", weight: "font-normal" },
    { text: "climate action", size: "text-lg", color: "text-emerald-500", weight: "font-normal" },
    { text: "public safety", size: "text-lg", color: "text-orange-500", weight: "font-normal" },
    { text: "housing", size: "text-lg", color: "text-purple-500", weight: "font-normal" },
    { text: "immigration", size: "text-base", color: "text-amber-600", weight: "font-normal" },
    { text: "healthcare", size: "text-base", color: "text-pink-500", weight: "font-normal" },
    { text: "budget", size: "text-base", color: "text-gray-600", weight: "font-normal" },
    { text: "infrastructure", size: "text-sm", color: "text-lime-600", weight: "font-normal" }
  ];

  return (
    <div className="py-12 px-4">
      <div className="flex flex-wrap justify-center items-center gap-2 text-center leading-none">
        {words.map((word, index) => (
          <span
            key={index}
            className={`
              ${word.size} ${word.color} ${word.weight}
              cursor-pointer
              transition-all duration-200
              hover:opacity-80
              inline-block
            `}
            style={{
              transform: `rotate(${Math.random() * 3 - 1.5}deg)`,
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