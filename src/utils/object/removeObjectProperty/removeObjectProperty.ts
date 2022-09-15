export const removeObjectProperty = (obj: any, propToRemove: string): Pick<any, string | number | symbol> => {
  const { [propToRemove]: removed, ...rest } = obj;

  return rest;
};

export default removeObjectProperty;
