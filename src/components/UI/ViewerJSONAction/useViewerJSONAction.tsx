const useViewerJSONAction = () => {
  const formatJSON = (value: any): string => JSON.stringify(value, null, 2);
  const getDownloadLink = (value: any) => `data:text/json;charset=utf-8,${encodeURIComponent(formatJSON(value))}`;

  return { formatJSON, getDownloadLink };
};

export default useViewerJSONAction;
