import React, { useState, useEffect } from "react";
import { getHexaImageURL, getHexaNameWithIndex } from "./hexaGenerate";
import { useTheme } from "next-themes";
import { trackEvent, isAnalyticsEnabled } from "./lib/analytics";

const HexagramCell = ({ index }) => {
  const [imageURL, updateImageURL] = useState("");
  const [contentName, updateContentName] = useState("");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const isDarkMode = resolvedTheme === 'dark';
    getHexaImageURL(index, isDarkMode).then((imageURL) => updateImageURL(imageURL));
    updateContentName(getHexaNameWithIndex(index));
  }, [index, resolvedTheme]);

  const handleClick = () => {
    // Track hexagram click events
    trackEvent('hexagram_click', {
      event_category: 'engagement',
      event_label: `Hexagram ${index}: ${contentName}`,
      value: index,
    });
  };

  return (
    <a
      href={`https://www.google.com.hk/search?q=${encodeURIComponent(contentName)}+site%3Aeee-learning.com`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex flex-col items-center p-4 bg-card border border-border/50 rounded-xl hover:bg-accent/50 hover:border-primary/70 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in backdrop-blur-sm"
      style={{ animationDelay: `${index * 10}ms` }}
    >
      <span className="text-sm font-semibold text-foreground mb-3 text-center leading-tight tracking-tight">
        {contentName}
      </span>
      <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-transparent to-muted/20 rounded-lg p-2">
        <img 
          src={imageURL} 
          alt={contentName} 
          className="w-full h-full object-contain transition-all duration-200 hover:scale-110"
          loading="lazy"
        />
      </div>
    </a>
  );
};

export const HexagramList = ({ focus }) => {
  if (focus?.length === 6) {
    const focusIndex = parseInt(focus, 2);
    if (!isNaN(focusIndex) && focusIndex >= 0 && focusIndex < 64) {
      return (
        <div className="col-span-8 flex justify-center animate-slide-up">
          <div className="bg-gradient-to-br from-card to-accent/10 border border-primary/30 rounded-2xl p-8 shadow-xl max-w-md w-full backdrop-blur-md">
            <div className="text-center mb-6">
              <span className="text-lg font-medium text-primary mb-3 block">
                Focused Hexagram #{focusIndex}
              </span>
              <div className="scale-125 transform transition-transform duration-300 hover:scale-135">
                <HexagramCell index={focusIndex} />
              </div>
            </div>
            <div className="text-center bg-muted/30 rounded-lg py-2 px-4">
              <span className="text-sm text-muted-foreground font-mono">
                Binary: {focus} | Decimal: {focusIndex}
              </span>
            </div>
          </div>
        </div>
      );
    }
  }

  return Array.from({ length: 64 }).map((_, index) => (
    <HexagramCell index={index} key={index} />
  ));
};
