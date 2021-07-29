import { flush } from './includes/loaderQueue.js';
import { getCurrentLocale, getOptions } from './includes/utils.js';
import { formatDate, formatNumber, formatTime } from './stores/formatters.js';
export { init } from './configs.js';
// low-level
export { getDateFormatter, getNumberFormatter, getTimeFormatter } from './includes/formatters.js';
export { registerLocaleLoader as register } from './includes/loaderQueue.js';
export * from './includes/localeGetters.js';
export * from './includes/utils.js';
export { $dictionary as dictionary, $locales as locales, addMessages } from './stores/dictionary.js';
export { $format as format, $format as t, $format as _, $formatDate as date, $formatNumber as number, $formatTime as time } from './stores/formatters.js';
export { $isLoading as isLoading } from './stores/loading.js';
export { $locale as locale } from './stores/locale.js';
export function waitLocale(locale) {
    return flush(locale || getCurrentLocale() || getOptions().initialLocale);
}
export function __interpolate(value) {
    return value === 0 ? 0 : value || '';
}
const PLURAL_RULES = Object.create(null);
function getLocalPluralFor(v) {
    let loc = getCurrentLocale();
    let pluralRules = PLURAL_RULES[loc] || (PLURAL_RULES[loc] = new Intl.PluralRules(loc));
    let key = pluralRules.select(v);
    return key === 'other' ? 'h' : key[0];
}
export function __offsetPlural(value, offset, opts) {
    return opts[value] || opts[getLocalPluralFor(value - offset)] || "";
}
export function __plural(value, opts) {
    return opts[value] || opts[getLocalPluralFor(value)] || "";
}
export function __select(value, opts) {
    return opts[value] || opts['other'] || '';
}
export function __number(value, format) {
    return formatNumber(value, { format });
}
export function __date(value, format = "short") {
    return formatDate(value, { format });
}
export function __time(value, format = "short") {
    return formatTime(value, { format });
}
