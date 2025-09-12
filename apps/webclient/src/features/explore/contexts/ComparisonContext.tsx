import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { IProperty } from '../types/explore';
import { ComparisonService } from '../services/comparisonService';

interface IComparisonContext {
  comparisonList: IProperty[];
  addToComparison: (property: IProperty) => {
    success: boolean;
    message: string;
  };
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  isInComparison: (propertyId: string) => boolean;
  comparisonCount: number;
}

const ComparisonContext = createContext<IComparisonContext | undefined>(
  undefined,
);

export const useComparison = (): IComparisonContext => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

interface IComparisonProviderProps {
  children: ReactNode;
}

export const ComparisonProvider: React.FC<IComparisonProviderProps> = ({
  children,
}) => {
  const [comparisonList, setComparisonList] = useState<IProperty[]>([]);

  // Load initial comparison list from localStorage
  useEffect(() => {
    const initialList = ComparisonService.getComparisonList();
    setComparisonList(initialList);
  }, []);

  const addToComparison = (
    property: IProperty,
  ): { success: boolean; message: string } => {
    const result = ComparisonService.addToComparison(property);
    if (result.success) {
      setComparisonList(result.properties);
    }
    return { success: result.success, message: result.message };
  };

  const removeFromComparison = (propertyId: string): void => {
    const result = ComparisonService.removeFromComparison(propertyId);
    setComparisonList(result.properties);
  };

  const clearComparison = (): void => {
    ComparisonService.clearComparison();
    setComparisonList([]);
  };

  const isInComparison = (propertyId: string): boolean => {
    return comparisonList.some(p => p.id === propertyId);
  };

  const value: IComparisonContext = {
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    comparisonCount: comparisonList.length,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};
