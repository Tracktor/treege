export const isUniqueArrayItem = (array: string[]): boolean => {
  const uniqueArrayItems = new Set([...array]);
  return uniqueArrayItems.size === array.length;
};

export const isUniqueArrayItemWithNewEntry = (array: string[], name: string): boolean => isUniqueArrayItem([...array, name]);
