import { IProperty } from './explore';

export interface IPropertyTableProps {
  properties: IProperty[];
  onView?: (property: IProperty) => void;
  onCompare?: (property: IProperty) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
}
