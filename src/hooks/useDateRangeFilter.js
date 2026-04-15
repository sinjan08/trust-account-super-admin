// hooks/useDateRangeFilter.js

import { useCallback } from "react";
import { filterByDateRange } from "../utils/dateRangeFilter";

// Custom hook to handle filtering data based on a date range
// Props:
// - data: array of objects to filter
// - dateKey: string key in each object representing the date field
// - onFilter: callback function to receive the filtered data
export const useDateRangeFilter = ({ data, dateKey, onFilter }) => {

  const handleApply = useCallback(
    (range) => {
      if (range?.length === 2) {
        const filtered = filterByDateRange(data, dateKey, range);
        onFilter(filtered);
      }
    },
    [data, dateKey, onFilter]
  );

  const handleCancel = useCallback(() => {
    onFilter(data);
  }, [data, onFilter]);

  return { handleApply, handleCancel };
};
