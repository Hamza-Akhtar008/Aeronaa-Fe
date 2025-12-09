import { ApiFilterState, FilterState } from "@/types/hotels";

export type FilterSidebarProps = {
  showFilters: boolean;
  convertedPriceRange: [number, number];
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  selectedCurrency: string;
  availablePropertyTypes: number[];
  apiFilters: ApiFilterState;
  handleApiFilterSelect: (key: keyof ApiFilterState, value: any) => void;
  handleApiFilterCheckbox: (key: keyof ApiFilterState, id: string | number) => void;
  clearFilters: () => void;
  exchangeRates:Record<string, number>
};
