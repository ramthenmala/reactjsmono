import { InvestorJourneyCard } from './types';

interface DesktopGridProps {
  cards: InvestorJourneyCard[];
}

export function DesktopGrid({ cards }: DesktopGridProps) {
  return (
    <div className="hidden md:grid grid-cols-4 gap-8 mt-8">
      {cards.map((step) => (
        <div
          key={step.title}
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-xl"
        >
          <div
            className="flex items-center justify-center mb-6"
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
          <h3 className="text-lg font-semibold mb-2 text-[#171B23]">{step.title}</h3>
          <p className="text-gray-500">{step.content}</p>
        </div>
      ))}
    </div>
  );
}