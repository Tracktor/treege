import { FormEvent, ReactNode } from "react";

const DefaultFormWrapper = ({ children, onSubmit }: { children: ReactNode; onSubmit: (e: FormEvent) => void }) => (
  <form onSubmit={onSubmit} className="mx-auto max-w-2xl gap-y-3">
    {children}
  </form>
);

export default DefaultFormWrapper;
