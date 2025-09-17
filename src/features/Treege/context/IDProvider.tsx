import { createContext, useContext, useRef, useMemo } from "react";

type IdContextValue = {
  getId: (prefix?: string) => string;
};

const IdContext = createContext<IdContextValue | null>(null);

export const IdProvider = ({ children }: { children: React.ReactNode }) => {
  const counterRef = useRef(0);

  const getId = (prefix = "node") => {
    counterRef.current += 1;
    return `${prefix}-${counterRef.current}`;
  };

  const value = useMemo(() => ({ getId }), []);

  return <IdContext.Provider value={value}>{children}</IdContext.Provider>;
};

export const useIdGenerator = () => {
  const ctx = useContext(IdContext);

  if (!ctx) {
    throw new Error("useIdGenerator must be used inside an IdProvider");
  }

  return ctx.getId;
};

export default IdProvider;
