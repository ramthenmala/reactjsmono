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
              flex flex-col items-center min-h-[290px] p-12 gap-5
              rounded-[20px] border border-[#EBEDEF] bg-white
              shadow-[0_12px_16px_-4px_rgba(16,24,40,0.04),0_4px_6px_-2px_rgba(16,24,40,0.02)]
              backdrop-blur-[7.5px] transition-all duration-300
              ${idx === activeIndex ? 'opacity-100 scale-100' : 'opacity-80 scale-95'}
            `}
            style={{
              minWidth: "100%",
              maxWidth: "100%",
            }}
          >
            {/* Icon Container */}
            <div className="w-12 h-12 rounded-[10px] border border-[#5547B5] bg-white p-2 flex items-center justify-center">
              <img src={step.icon} alt={step.title} className="w-6 h-6" />
            </div>
            
            {/* Content Container */}
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <h3 className="text-lg font-semibold text-[#171B23] leading-7">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-5">
                {step.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}