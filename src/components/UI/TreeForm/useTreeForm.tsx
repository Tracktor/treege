import { useState, useCallback } from "react";

const useTreeForm = () => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const refContainer = useCallback((ref: null | Element) => {
    if (!ref) {
      return null;
    }

    const { width, height } = ref.getBoundingClientRect();

    setDimensions({ height, width });
    setTranslate({ x: width / 2, y: height / 2 });

    return ref;
  }, []);

  return { dimensions, refContainer, translate };
};

export default useTreeForm;
