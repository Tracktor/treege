import { createContext, useContext, useRef, useMemo } from "react";

type IdContextValue = {
  getId: (prefix?: string) => string;
};

const IdContext = createContext<IdContextValue | null>(null);

export const IdProvider = ({ children }: { children: React.ReactNode }) => {
  const countersRef = useRef<Record<string, number>>({});

  const getId = (prefix = "node") => {
    countersRef.current[prefix] = (countersRef.current[prefix] ?? 0) + 1;
    return `${prefix}-${countersRef.current[prefix]}`;
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
