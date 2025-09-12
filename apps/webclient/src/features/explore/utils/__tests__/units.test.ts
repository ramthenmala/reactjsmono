import { unitLabel, formatMeasure, EUnit } from '../units';
import { 
  EAreaUnit,
  EPowerUnit,
  EGasFlowUnit,
  EWaterFlowUnit
} from '../../types/explore';

describe('units utilities', () => {
  describe('unitLabel', () => {
    const mockTranslate = jest.fn((key: string) => {
      const translations: Record<string, string> = {
        'units.sq_m': 'm²',
        'units.sq_ft': 'ft²',
        'units.m3_per_day': 'm³/day',
      };
      return translations[key] || key;
    });

    beforeEach(() => {
      mockTranslate.mockClear();
    });

    it('should return correct labels for area units with translation', () => {
      expect(unitLabel(EAreaUnit.SqMeter, mockTranslate)).toBe('m²');
      expect(unitLabel(EAreaUnit.SqFoot, mockTranslate)).toBe('ft²');
      
      expect(mockTranslate).toHaveBeenCalledWith('units.sq_m');
      expect(mockTranslate).toHaveBeenCalledWith('units.sq_ft');
    });

    it('should return correct labels for area units without translation', () => {
      expect(unitLabel(EAreaUnit.SqMeter)).toBe('units.sq_m');
      expect(unitLabel(EAreaUnit.SqFoot)).toBe('units.sq_ft');
    });

    it('should return correct labels for power units', () => {
      expect(unitLabel(EPowerUnit.MW)).toBe('MW');
      expect(unitLabel(EPowerUnit.MW, mockTranslate)).toBe('MW');
      
      // MW is not translated, so mockTranslate should not be called
      expect(mockTranslate).not.toHaveBeenCalled();
    });

    it('should return correct labels for gas flow units', () => {
      expect(unitLabel(EGasFlowUnit.MMSCFD)).toBe('MMSCFD');
      expect(unitLabel(EGasFlowUnit.MMSCFD, mockTranslate)).toBe('MMSCFD');
      
      expect(mockTranslate).not.toHaveBeenCalled();
    });

    it('should return correct labels for water flow units with translation', () => {
      expect(unitLabel(EWaterFlowUnit.M3PerDay, mockTranslate)).toBe('m³/day');
      
      expect(mockTranslate).toHaveBeenCalledWith('units.m3_per_day');
    });

    it('should return correct labels for water flow units without translation', () => {
      expect(unitLabel(EWaterFlowUnit.M3PerDay)).toBe('units.m3_per_day');
    });

    it('should return empty string for unknown units', () => {
      const unknownUnit = 'UNKNOWN' as EUnit;
      expect(unitLabel(unknownUnit)).toBe('');
      expect(unitLabel(unknownUnit, mockTranslate)).toBe('');
    });

    it('should handle all enum values', () => {
      // Test that all enum values are covered
      Object.values(EAreaUnit).forEach(unit => {
        const result = unitLabel(unit as EUnit);
        expect(typeof result).toBe('string');
      });

      Object.values(EPowerUnit).forEach(unit => {
        const result = unitLabel(unit as EUnit);
        expect(typeof result).toBe('string');
      });

      Object.values(EGasFlowUnit).forEach(unit => {
        const result = unitLabel(unit as EUnit);
        expect(typeof result).toBe('string');
      });

      Object.values(EWaterFlowUnit).forEach(unit => {
        const result = unitLabel(unit as EUnit);
        expect(typeof result).toBe('string');
      });
    });
  });

  describe('formatMeasure', () => {
    const mockTranslate = jest.fn((key: string) => {
      const translations: Record<string, string> = {
        'units.sq_m': 'm²',
        'units.sq_ft': 'ft²',
        'units.m3_per_day': 'm³/day',
      };
      return translations[key] || key;
    });

    const mockFormatNumber = jest.fn((n: number) => {
      return n.toLocaleString('en-US');
    });

    beforeEach(() => {
      mockTranslate.mockClear();
      mockFormatNumber.mockClear();
    });

    it('should format numeric values with units', () => {
      expect(formatMeasure(1000, EAreaUnit.SqMeter)).toBe('1000 units.sq_m');
      expect(formatMeasure(50, EPowerUnit.MW)).toBe('50 MW');
      expect(formatMeasure(100, EGasFlowUnit.MMSCFD)).toBe('100 MMSCFD');
    });

    it('should format string numeric values with units', () => {
      expect(formatMeasure('1000', EAreaUnit.SqMeter)).toBe('1000 units.sq_m');
      expect(formatMeasure('50.5', EPowerUnit.MW)).toBe('50.5 MW');
      expect(formatMeasure('100', EGasFlowUnit.MMSCFD)).toBe('100 MMSCFD');
    });

    it('should use custom number formatter', () => {
      const result = formatMeasure(1000, EAreaUnit.SqMeter, { 
        formatNumber: mockFormatNumber 
      });
      
      expect(result).toBe('1,000 units.sq_m');
      expect(mockFormatNumber).toHaveBeenCalledWith(1000);
    });

    it('should use custom translation function', () => {
      const result = formatMeasure(1000, EAreaUnit.SqMeter, { 
        t: mockTranslate 
      });
      
      expect(result).toBe('1000 m²');
      expect(mockTranslate).toHaveBeenCalledWith('units.sq_m');
    });

    it('should use both custom formatter and translation', () => {
      const result = formatMeasure(1000, EAreaUnit.SqMeter, { 
        formatNumber: mockFormatNumber,
        t: mockTranslate 
      });
      
      expect(result).toBe('1,000 m²');
      expect(mockFormatNumber).toHaveBeenCalledWith(1000);
      expect(mockTranslate).toHaveBeenCalledWith('units.sq_m');
    });

    it('should handle null, undefined, and empty values', () => {
      expect(formatMeasure(null, EAreaUnit.SqMeter)).toBe('');
      expect(formatMeasure(undefined, EAreaUnit.SqMeter)).toBe('');
      expect(formatMeasure('', EAreaUnit.SqMeter)).toBe('');
    });

    it('should handle zero values', () => {
      expect(formatMeasure(0, EAreaUnit.SqMeter)).toBe('0 units.sq_m');
      expect(formatMeasure('0', EPowerUnit.MW)).toBe('0 MW');
    });

    it('should handle negative values', () => {
      expect(formatMeasure(-50, EPowerUnit.MW)).toBe('-50 MW');
      expect(formatMeasure('-25.5', EAreaUnit.SqFoot)).toBe('-25.5 units.sq_ft');
    });

    it('should handle decimal values', () => {
      expect(formatMeasure(123.45, EAreaUnit.SqMeter)).toBe('123.45 units.sq_m');
      expect(formatMeasure('98.7', EPowerUnit.MW)).toBe('98.7 MW');
    });

    it('should handle invalid numeric strings by defaulting to 0', () => {
      expect(formatMeasure('abc', EAreaUnit.SqMeter)).toBe('0 units.sq_m');
      expect(formatMeasure('not-a-number', EPowerUnit.MW)).toBe('0 MW');
      expect(formatMeasure('123abc', EGasFlowUnit.MMSCFD)).toBe('0 MMSCFD');
    });

    it('should handle Infinity and NaN values by defaulting to 0', () => {
      expect(formatMeasure(Infinity, EAreaUnit.SqMeter)).toBe('0 units.sq_m');
      expect(formatMeasure(-Infinity, EPowerUnit.MW)).toBe('0 MW');
      expect(formatMeasure(NaN, EGasFlowUnit.MMSCFD)).toBe('0 MMSCFD');
    });

    it('should format different unit types correctly', () => {
      expect(formatMeasure(1000, EAreaUnit.SqMeter, { t: mockTranslate }))
        .toBe('1000 m²');
      
      expect(formatMeasure(50, EPowerUnit.MW, { t: mockTranslate }))
        .toBe('50 MW');
      
      expect(formatMeasure(100, EGasFlowUnit.MMSCFD, { t: mockTranslate }))
        .toBe('100 MMSCFD');
      
      expect(formatMeasure(5000, EWaterFlowUnit.M3PerDay, { t: mockTranslate }))
        .toBe('5000 m³/day');
    });

    it('should handle large numbers with custom formatter', () => {
      const customFormatter = (n: number) => n.toExponential(2);
      
      expect(formatMeasure(1000000, EAreaUnit.SqMeter, { 
        formatNumber: customFormatter,
        t: mockTranslate 
      })).toBe('1.00e+6 m²');
    });

    it('should handle very small decimal numbers', () => {
      expect(formatMeasure(0.001, EPowerUnit.MW)).toBe('0.001 MW');
      expect(formatMeasure('0.0001', EGasFlowUnit.MMSCFD)).toBe('0.0001 MMSCFD');
    });

    it('should maintain precision for decimal calculations', () => {
      const preciseValue = 123.456789;
      expect(formatMeasure(preciseValue, EAreaUnit.SqMeter))
        .toBe('123.456789 units.sq_m');
    });

    it('should work with different combinations of options', () => {
      // Only formatNumber
      expect(formatMeasure(1000, EPowerUnit.MW, { formatNumber: mockFormatNumber }))
        .toBe('1,000 MW');
      
      // Only translation
      expect(formatMeasure(1000, EAreaUnit.SqFoot, { t: mockTranslate }))
        .toBe('1000 ft²');
      
      // Both options
      expect(formatMeasure(1000, EWaterFlowUnit.M3PerDay, { 
        formatNumber: mockFormatNumber,
        t: mockTranslate 
      })).toBe('1,000 m³/day');
      
      // No options
      expect(formatMeasure(1000, EPowerUnit.MW))
        .toBe('1000 MW');
    });
  });
});