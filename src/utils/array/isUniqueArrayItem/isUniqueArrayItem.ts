/**
 * Check if array items are unique
 * @param array
 */
const isUniqueArrayItem = (array: string[]): boolean => {
  const uniqueArrayItems = new Set([...array]);
  return uniqueArrayItems.size === array.length;
};

export default isUniqueArrayItem;
