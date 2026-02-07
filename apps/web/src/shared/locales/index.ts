import ko from './ko.json';
import en from './en.json';

export const LOCALES = {
    ko,
    en,
} as const;

export type Locale = keyof typeof LOCALES;
