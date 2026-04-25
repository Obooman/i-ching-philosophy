import React, { useState, useEffect } from "react";
import { HexagramList, FocusedHexagram } from "./HexagramList";
import { ThemeToggle } from "./components/theme-toggle";
import { LineToggler } from "./components/LineToggler";
import { trackPageView, trackEvent, isAnalyticsEnabled } from "./lib/analytics";
import "./styles/index.css";

export const App = () => {
  const [hexaValue, setHexaValue] = useState("111111");

  useEffect(() => {
    if (isAnalyticsEnabled()) {
      trackPageView(window.location.pathname, "六十四卦查询");
    }

    const searchTimeout = setTimeout(() => {
      if (hexaValue.length === 6 && /^[01]+$/.test(hexaValue)) {
        trackEvent("hexagram_search", {
          event_category: "engagement",
          event_label: `Hexagram ${parseInt(hexaValue, 2)}`,
          value: parseInt(hexaValue, 2),
        });
      }
    }, 1000);

    return () => clearTimeout(searchTimeout);
  }, [hexaValue]);

  const hexaIndex = parseInt(hexaValue, 2);
  const isValid = hexaValue.length === 6 && /^[01]+$/.test(hexaValue);

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        <header className="mb-8 sm:mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              易經六十四卦
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              I Ching Hexagram Query
            </p>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
                  Build Your Hexagram
                </h2>

                <div className="flex justify-center mb-4">
                  <LineToggler value={hexaValue} onChange={setHexaValue} />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
                  <span className="font-mono tabular-nums">
                    {hexaValue}
                  </span>
                  {isValid ? (
                    <span className="text-primary font-medium">
                      #{hexaIndex}
                    </span>
                  ) : (
                    <span className="text-destructive">6 bits needed</span>
                  )}
                </div>
              </div>

              {isValid && (
                <div className="rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6 animate-slide-up">
                  <FocusedHexagram focus={hexaValue} />
                </div>
              )}
            </div>
          </aside>

          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-sm font-semibold text-foreground mb-6 tracking-wide uppercase">
                All 64 Hexagrams
              </h2>
              <HexagramList focus={hexaValue} />
            </div>
          </section>
        </div>

        <footer className="mt-16 mb-8 text-center text-xs text-muted-foreground/60">
          <p>易經六十四卦 · I Ching · 64 Hexagrams</p>
        </footer>
      </div>
    </div>
  );
};
