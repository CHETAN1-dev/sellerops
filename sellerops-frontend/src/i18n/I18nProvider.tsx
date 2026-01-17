import type { ReactNode } from "react";
import en from "./en.json";
import { I18nContext } from "./context";

export function I18nProvider({ children }: { children: ReactNode }) {
  return (
    <I18nContext.Provider value={en}>
      {children}
    </I18nContext.Provider>
  );
}
