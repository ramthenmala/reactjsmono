export interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

export interface BarChartProps {
  data: Array<{
    label: string | number;
    quantity: number;
  }>;
  'data-qa-id'?: string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export interface WrappedXAxisTickProps {
  x: number;
  y: number;
  payload: { value: string | number };
}
