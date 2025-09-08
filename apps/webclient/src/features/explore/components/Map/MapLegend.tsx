import { ButtonGroup, ButtonGroupItem } from '@compass/shared-ui';

export function MapLegend() {
  return (
    <div className="absolute bottom-4 right-4 z-10">
      <ButtonGroup size="sm" className="bg-white/95 backdrop-blur-sm">
        <ButtonGroupItem id="industrial" isSelected={true}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
            <span>Industrial Cities</span>
          </div>
        </ButtonGroupItem>
        <ButtonGroupItem id="competitors">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span>Competitors</span>
          </div>
        </ButtonGroupItem>
        <ButtonGroupItem id="suppliers">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Suppliers</span>
          </div>
        </ButtonGroupItem>
        <ButtonGroupItem id="consumers">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
            <span>Consumers</span>
          </div>
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  );
}