import React, { useState, useEffect } from "react";
import { HexagramList } from "./HexagramList";
import { ThemeToggle } from "./components/theme-toggle";
import { trackPageView, trackEvent, isAnalyticsEnabled } from "./lib/analytics";
import "./styles/index.css";

export const App = () => {
  const [hexaValue, updateHexaValue] = useState("1101010");

  // Track page views and user interactions
  useEffect(() => {
    // Log page view
    if (isAnalyticsEnabled()) {
      trackPageView(window.location.pathname, '六十四卦查询');
    }

    // Track hexagram searches
    const handleHexagramSearch = (value: string) => {
      if (value.length === 6 && /^[01]+$/.test(value)) {
        trackEvent('hexagram_search', {
          event_category: 'engagement',
          event_label: `Hexagram ${parseInt(value, 2)}`,
          value: parseInt(value, 2),
        });
      }
    };

    // Set up search tracking
    const searchTimeout = setTimeout(() => {
      handleHexagramSearch(hexaValue);
    }, 1000);

    return () => clearTimeout(searchTimeout);
  }, [hexaValue]);

  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <header className="mb-8 text-center flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              I Ching Hexagram Query
            </h1>
            <p className="text-muted-foreground">
              Enter a 6-bit binary code to explore ancient wisdom
            </p>
          </div>
          <ThemeToggle />
        </header>
        
        <main className="bg-gradient-to-br from-card to-accent/5 rounded-2xl shadow-lg p-8 animate-slide-up border border-border/20 backdrop-blur-sm">
          <div className="mb-8">
            <label htmlFor="hexaCode" className="block text-sm font-medium text-muted-foreground mb-3">
              Hexagram Binary Code
            </label>
            <textarea
              className="w-full p-4 bg-background/80 border border-input/50 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/60 resize-none text-foreground placeholder-muted-foreground transition-all duration-300 hover:bg-muted/50 backdrop-blur-sm"
              placeholder="Enter 6-bit binary (e.g., 110101)"
              id="hexaCode"
              value={hexaValue}
              rows={3}
              onInput={(event) => {
                updateHexaValue(event.target.value);
              }}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              {hexaValue.length === 6 ? (
                <span className="text-primary">Valid 6-bit code</span>
              ) : (
                <span>Enter exactly 6 bits (0s and 1s)</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-8 gap-3">
            <HexagramList focus={hexaValue} />
          </div>
        </main>
      </div>
    </div>
  );
};
