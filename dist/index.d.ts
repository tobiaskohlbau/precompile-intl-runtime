import { init } from "./config";
import { currentLocale, dictionary, locales, LocaleDictionary } from "./stores";
import { getNumberFormatter, getDateFormatter, getTimeFormatter, formatTime, formatDate, formatNumber, formatMessage } from "./formatters";
declare type PluralRule = "zero" | "one" | "two" | "few" | "many" | "other" | number;
declare type PluralOptions = Record<PluralRule, string>;
export declare function __interpolate(value: any): any;
export declare function __plural(value: number, offsetOrOptions: number | PluralOptions, opts?: PluralOptions): string;
export declare function __select(value: any, opts: Record<any, string>): string;
export declare function __number(value: number, format?: string): string;
export declare function __date(value: Date, format?: string): string;
export declare function __time(value: Date, format?: string): string;
export declare function addMessages(locale: string, messages: LocaleDictionary): void;
export { init, currentLocale, dictionary, locales, getNumberFormatter, getDateFormatter, getTimeFormatter, formatMessage, formatTime, formatDate, formatNumber };