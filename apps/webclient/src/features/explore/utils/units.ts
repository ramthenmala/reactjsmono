import {
  EAreaUnit,
  EPowerUnit,
  EGasFlowUnit,
  EWaterFlowUnit,
} from '../types/explore';

export type EUnit = EAreaUnit | EPowerUnit | EGasFlowUnit | EWaterFlowUnit;

export function unitLabel(unit: EUnit, t?: (k: string) => string) {
  const tr = t ?? ((s: string) => s);
  switch (unit) {
    case EAreaUnit.SqMeter:
      return tr('units.sq_m'); // "m²"
    case EAreaUnit.SqFoot:
      return tr('units.sq_ft'); // "ft²"
    case EPowerUnit.MW:
      return 'MW';
    case EGasFlowUnit.MMSCFD:
      return 'MMSCFD';
    case EWaterFlowUnit.M3PerDay:
      return tr('units.m3_per_day'); // "m³/day"
    default:
      return '';
  }
}

/** Format a value + unit with localized number formatting */
export function formatMeasure(
  value: number | string | undefined | null,
  unit: EUnit,
  opts?: { formatNumber?: (n: number) => string; t?: (k: string) => string }
) {
  if (value === undefined || value === null || value === '') return '';
  const n = typeof value === 'number' ? value : Number(value);
  const safe = Number.isFinite(n) ? n : 0;
  const num = opts?.formatNumber ? opts.formatNumber(safe) : String(safe);
  return `${num} ${unitLabel(unit, opts?.t)}`;
}
