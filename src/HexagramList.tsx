import React, { useState, useEffect, useMemo } from "react";
import { getHexaImageURL, getHexaNameWithIndex } from "./hexaGenerate";
import { useTheme } from "next-themes";
import { trackEvent } from "./lib/analytics";

const HexagramCell = ({ index, isFocused }: { index: number; isFocused?: boolean }) => {
  const [imageURL, setImageURL] = useState("");
  const [contentName, setContentName] = useState("");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const isDark = resolvedTheme === "dark";
    getHexaImageURL(index, isDark).then(setImageURL);
    setContentName(getHexaNameWithIndex(index));
  }, [index, resolvedTheme]);

  const handleClick = () => {
    trackEvent("hexagram_click", {
      event_category: "engagement",
      event_label: `Hexagram ${index}: ${contentName}`,
      value: index,
    });
  };

  const binary = index.toString(2).padStart(6, "0");

  return (
    <a
      href={`https://www.google.com.hk/search?q=${encodeURIComponent(contentName)}+site%3Aeee-learning.com`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`relative flex flex-col items-center p-3 rounded-xl border transition-all duration-300 group ${
        isFocused
          ? "bg-primary/10 border-primary shadow-lg ring-2 ring-primary/20"
          : "bg-card/60 border-border/40 hover:border-primary/40 hover:bg-accent/40 hover:shadow-lg hover:scale-[1.02]"
      }`}
    >
      <span className="text-[11px] font-medium text-foreground mb-2 text-center leading-tight">
        {contentName}
      </span>
      <div className="w-14 h-14 flex items-center justify-center">
        <img
          src={imageURL}
          alt={contentName}
          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <span className="mt-1.5 text-[9px] text-muted-foreground/60 font-mono tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
        {index}
      </span>
    </a>
  );
};

export const FocusedHexagram = ({ focus }: { focus: string }) => {
  if (!focus || focus.length !== 6) return null;
  const index = parseInt(focus, 2);
  if (isNaN(index) || index < 0 || index >= 64) return null;

  const contentName = getHexaNameWithIndex(index);

  return (
    <a
      href={`https://www.google.com.hk/search?q=${encodeURIComponent(contentName)}+site%3Aeee-learning.com`}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-b from-card to-accent/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1 font-mono">
            #{index}
          </p>
          <p className="text-lg font-bold text-foreground">{contentName}</p>
        </div>
        <FocusedLinePreview binary={focus} />
        <span className="text-[10px] text-muted-foreground hover:text-primary transition-colors">
          Search on eee-learning.com →
        </span>
      </div>
    </a>
  );
};

const FocusedLinePreview = ({ binary }: { binary: string }) => (
  <div className="flex flex-col items-center gap-1.5 my-2">
    {binary.split("").map((bit, i) => (
      <div key={i} className="flex items-center justify-center w-20 h-5">
        {bit === "1" ? (
          <div className="w-16 h-3 rounded-full bg-foreground" />
        ) : (
          <div className="flex gap-3">
            <div className="w-7 h-3 rounded-full bg-foreground" />
            <div className="w-7 h-3 rounded-full bg-foreground" />
          </div>
        )}
      </div>
    ))}
  </div>
);

export const HexagramGrid = ({ focus }: { focus: string }) => {
  const focusIndex = focus.length === 6 ? parseInt(focus, 2) : -1;

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
      {Array.from({ length: 64 }).map((_, index) => (
        <HexagramCell
          index={index}
          key={index}
          isFocused={index === focusIndex}
        />
      ))}
    </div>
  );
};

export const HexagramList = ({ focus }: { focus: string }) => {
  const [search, setSearch] = useState("");
  const focusIndex = focus.length === 6 ? parseInt(focus, 2) : -1;

  const filteredIndices = useMemo(() => {
    const indices = Array.from({ length: 64 }, (_, i) => i);
    if (!search.trim()) return indices;
    const q = search.trim().toLowerCase();
    return indices.filter((i) => {
      const name = getHexaNameWithIndex(i);
      const binary = i.toString(2).padStart(6, "0");
      return (
        name.toLowerCase().includes(q) ||
        binary.includes(q) ||
        i.toString() === q
      );
    });
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name, index, or binary…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-background/60 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            clear
          </button>
        )}
      </div>

      {filteredIndices.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">
          No hexagrams found for "{search}"
        </p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {filteredIndices.map((index) => (
            <HexagramCell
              index={index}
              key={index}
              isFocused={index === focusIndex}
            />
          ))}
        </div>
      )}

      {!search && (
        <p className="text-center text-[10px] text-muted-foreground/40 mt-4">
          {filteredIndices.length} hexagrams
        </p>
      )}
    </div>
  );
};
