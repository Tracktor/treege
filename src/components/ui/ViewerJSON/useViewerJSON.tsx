const useViewerJSON = () => {
  const formatJSON = (value: any): string => JSON.stringify(value, null, 2);

  return { formatJSON };
};

export default useViewerJSON;
