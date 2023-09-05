import { isUniqueArrayItem } from "@/utils/array";

/**
 * Check if the array item is unique with a new entry
 * @param array
 * @param entry
 * @param excludeEntry
 */
const isUniqueArrayItemWithNewEntry = (array: string[], entry: string, excludeEntry?: string | false | undefined): boolean => {
  const arrayNames = [...array, entry];

  if (excludeEntry) {
    return isUniqueArrayItem(arrayNames.filter((item) => item !== excludeEntry));
  }

  return isUniqueArrayItem(arrayNames);
};

export default isUniqueArrayItemWithNewEntry;
