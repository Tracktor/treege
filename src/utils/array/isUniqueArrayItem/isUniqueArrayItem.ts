export const isUniqueArrayItem = (array: string[]): boolean => {
  const uniqueArrayItems = new Set([...array]);
  return uniqueArrayItems.size === array.length;
};

export const isUniqueArrayItemWithNewEntry = (array: string[], entry: string, excludeEntry?: string | false | undefined): boolean => {
  let arrayNames = [...array, entry];

  if (excludeEntry) arrayNames = arrayNames.filter((v) => v !== excludeEntry);

  return isUniqueArrayItem(arrayNames);
};
