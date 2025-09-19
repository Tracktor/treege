export const fieldCategory = {
  api: ["dynamicSelect", "autocomplete"],
  boolean: ["switch", "checkbox"],
  dateTime: ["date", "dateRange", "time", "timeRange"],
  decision: ["select", "radio"],
  file: ["file"],
  other: ["title", "hidden"],
  textArea: ["text", "number", "email", "password", "tel", "url", "date", "address"],
} as const;

type Category = keyof typeof fieldCategory;

const typedEntries = <T extends object>(obj: T): { [K in keyof T]: [K, T[K]] }[keyof T][] =>
  Object.entries(obj) as unknown as {
    [K in keyof T]: [K, T[K]];
  }[keyof T][];

const getCategoryOrTypes = (input: string): string | readonly string[] => {
  if (input in fieldCategory) {
    return fieldCategory[input as Category];
  }
  if (input in fieldCategory) {
    return fieldCategory[input as Category];
  }

  const found = typedEntries(fieldCategory).find(([, types]) => (types as readonly string[]).includes(input));

  return found ? found[0] : "other";
};

export default getCategoryOrTypes;
