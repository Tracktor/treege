/**
 * Generate a UUID
 */
export const getUUID = () => {
  const now = Date.now();
  const highResTime = performance.now();

  return `${now}${Math.random().toString(36).substring(2, 9)}${highResTime}`;
};

export default getUUID;
