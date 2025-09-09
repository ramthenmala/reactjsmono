export interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onStyleChange: (style: string) => void;
  activeMapStyle: string;
}