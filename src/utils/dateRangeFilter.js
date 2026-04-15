import { isValid, parse } from 'date-fns';

/**
 * normalizeDate
 * --------------
 * Utility function to normalize a date into a valid JavaScript Date object
 * with time set to 00:00:00.000 (start of the day).
 *
 * @param {string|Date|null} date - Input date in string (e.g. "dd/MM/yyyy"),
 *                                  Date object, or null.
 * @returns {Date|null} - Returns normalized Date object or null if invalid.
 */
export const normalizeDate = (date) => {
    if (!date) return null;

    let parsedDate;

    if (typeof date === 'string') {
        parsedDate = parse(date, 'dd/MM/yyyy', new Date());

        if (!isValid(parsedDate)) {
            parsedDate = new Date(date);
        }
    } else {
        parsedDate = new Date(date);
    }

    if (!isValid(parsedDate)) return null;

    parsedDate.setHours(0, 0, 0, 0);

    return parsedDate;
};

/**
 * filterByDateRange
 * ------------------
 * Filters an array of objects based on a date range.
 *
 * @param {Array} data - Array of objects to filter.
 * @param {string} key - Object key that contains the date to check.
 * @param {[string|Date, string|Date]} [start, end] - Range boundaries.
 * @returns {Array} - Filtered data containing only items within the date range.
 */
export const filterByDateRange = (data, key, [start, end]) => {
    const startDate = normalizeDate(start);
    const endDate = normalizeDate(end);

    return data.filter((item) => {
        const itemDate = normalizeDate(item?.[key]);
        return itemDate >= startDate && itemDate <= endDate;
    });
};
