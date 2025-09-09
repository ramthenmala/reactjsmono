import { useState, useEffect } from 'react';
import { IsicService, IsicCode } from '../services/isicService';
import { SelectOption } from '../types';

export function useIsicSearch() {
  const [isicOptions, setIsicOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load all ISIC codes on component mount
  useEffect(() => {
    let isMounted = true;

    const loadAllIsicCodes = async () => {
      setIsLoading(true);
      try {
        const results = await IsicService.fetchIsicCodes();

        if (isMounted) {
          const options: SelectOption[] = results.map((isic: IsicCode) => ({
            id: isic.code.toString(),
            label: isic.code.toString(),
            value: isic.code.toString(),
          }));
          setIsicOptions(options);
        }
      } catch (error) {
        console.error('ISIC load error:', error);
        if (isMounted) {
          setIsicOptions([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAllIsicCodes();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isicOptions,
    isLoading,
  };
}
