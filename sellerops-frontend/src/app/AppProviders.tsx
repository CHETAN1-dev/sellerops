import type { ReactNode } from "react";
import { I18nProvider } from "../i18n";
import "../styles/globals.css";

type Props = {
  children: ReactNode;
};

export default function AppProviders({ children }: Props) {
  return (
    <I18nProvider>
      {children}
    </I18nProvider>
  );
}
