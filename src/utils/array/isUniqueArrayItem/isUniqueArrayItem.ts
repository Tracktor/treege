export const isUniqueArrayItem = (array: string[]): boolean => {
  const uniqueArrayItems = new Set([...array]);
  return uniqueArrayItems.size === array.length;
};

export const isUniqueArrayItemWithNewEntry = (array: string[], entry: string, excludeEntry?: string | false | undefined): boolean => {
  const arrayNames = [...array, entry];

  if (excludeEntry) {
    return isUniqueArrayItem(arrayNames.filter((item) => item !== excludeEntry));
  }

  return isUniqueArrayItem(arrayNames);
};
