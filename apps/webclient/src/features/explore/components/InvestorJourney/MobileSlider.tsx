import React from 'react';
import { InvestorJourneyCard } from './types';

interface MobileSliderProps {
  cards: InvestorJourneyCard[];
  activeIndex: number;
  isRTL: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export function MobileSlider({
  cards,
  activeIndex,
  isRTL,
  onTouchStart,
  onTouchEnd,
}: MobileSliderProps) {
  return (
    <div
      className="md:hidden flex items-center justify-center overflow-hidden pb-4 pt-24"
      style={{ touchAction: "pan-x", width: "100%", maxWidth: "100%" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          transform: isRTL
            ? `translateX(${activeIndex * 100}%)` // RTL
            : `translateX(-${activeIndex * 100}%)`, // LTR
          width: "80%",
        }}
      >
        {cards.map((step, idx) => (
          <div
            key={step.title}
            className={`
              bg-white rounded-2xl shadow-lg flex flex-col items-center text-center transition-all duration-300
              ${idx === activeIndex 
                ? "pt-6 pb-8 translate-y-0 opacity-95"   // active: less top padding, lifted up
                : "pt-12 pb-6 translate-y-4 opacity-95"}  // inactive: more padding, shifted down
            `}
            style={{
              minWidth: "100%",
              maxWidth: "100%",
              scale: idx === activeIndex ? 1 : 0.95,
            }}
          >
            <div
              className="flex items-center justify-center mb-6 mt-6 radius-lg"
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                border: "1px solid #5547B5",
                background: "#FFF",
                padding: 8,
              }}
            >
              <img src={step.icon} alt={step.title} style={{ width: 24, height: 24 }} />
            </div>
            <div className="px-10">
              <h3 className="text-lg font-semibold mb-2 text-[#171B23]">{step.title}</h3>
              <p className="text-gray-500">{step.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}