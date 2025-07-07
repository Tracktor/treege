import { useCallback, useState } from "react";

const useTree = () => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const refContainer = useCallback((ref: null | HTMLDivElement) => {
    if (!ref) {
      return;
    }

    const { width, height } = ref.getBoundingClientRect();

    setDimensions({ height, width });
    setTranslate({ x: width / 2, y: height / 2 });
  }, []);

  return { dimensions, refContainer, translate };
};

export default useTree;
