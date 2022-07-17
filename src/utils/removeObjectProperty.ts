const removeObjectProperty = (obj: any, propToRemove: string) => {
  const { [propToRemove]: removed, ...rest } = obj;

  return rest;
};

export default removeObjectProperty;
