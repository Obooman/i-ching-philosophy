import React from "react";

interface LineTogglerProps {
  value: string;
  onChange: (value: string) => void;
}

export const LineToggler: React.FC<LineTogglerProps> = ({ value, onChange }) => {
  const bits = value.slice(0, 6).padStart(6, "0").split("");

  const toggleBit = (index: number) => {
    const newBits = [...bits];
    newBits[index] = newBits[index] === "1" ? "0" : "1";
    onChange(newBits.join(""));
  };

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      {bits.map((bit, i) => (
        <button
          key={i}
          onClick={() => toggleBit(i)}
          className="group relative w-48 h-10 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-accent/30 active:scale-95 cursor-pointer"
          title={`Line ${6 - i}: ${bit === "1" ? "Yang (———)" : "Yin (—  —)"} — click to toggle`}
        >
          {bit === "1" ? (
            <div className="w-36 h-3 rounded-full bg-foreground transition-all duration-300 group-hover:w-40 group-hover:shadow-[0_0_12px_rgba(94,106,210,0.5)]" />
          ) : (
            <div className="flex items-center gap-4 transition-all duration-300 group-hover:gap-6">
              <div className="w-[66px] h-3 rounded-full bg-foreground transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(94,106,210,0.5)]" />
              <div className="w-[66px] h-3 rounded-full bg-foreground transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(94,106,210,0.5)]" />
            </div>
          )}
          <span className="absolute right-3 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {bit === "1" ? "⚊" : "⚋"}
          </span>
        </button>
      ))}
    </div>
  );
};
