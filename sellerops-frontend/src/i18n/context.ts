import { createContext } from "react";
import en from "./en.json";

export type I18nType = typeof en;

export const I18nContext = createContext<I18nType | null>(null);
