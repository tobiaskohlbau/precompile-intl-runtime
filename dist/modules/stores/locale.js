// @ts-ignore
import { writable } from 'svelte/store';
import { flush, hasLocaleQueue } from '../includes/loaderQueue';
import { getOptions } from '../configs';
import { getClosestAvailableLocale } from './dictionary';
let current;
const $locale = writable('');
export function isFallbackLocaleOf(localeA, localeB) {
    return localeB.indexOf(localeA) === 0 && localeA !== localeB;
}
export function isRelatedLocale(localeA, localeB) {
    return (localeA === localeB ||
        isFallbackLocaleOf(localeA, localeB) ||
        isFallbackLocaleOf(localeB, localeA));
}
export function getFallbackOf(locale) {
    const index = locale.lastIndexOf('-');
    if (index > 0)
        return locale.slice(0, index);
    const { fallbackLocale } = getOptions();
    if (fallbackLocale && !isRelatedLocale(locale, fallbackLocale)) {
        return fallbackLocale;
    }
    return null;
}
export function getRelatedLocalesOf(locale) {
    const locales = locale
        .split('-')
        .map((_, i, arr) => arr.slice(0, i + 1).join('-'));
    const { fallbackLocale } = getOptions();
    if (fallbackLocale && !isRelatedLocale(locale, fallbackLocale)) {
        return locales.concat(getRelatedLocalesOf(fallbackLocale));
    }
    return locales;
}
export function getCurrentLocale() {
    return current;
}
$locale.subscribe((newLocale) => {
    current = newLocale;
    if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('lang', newLocale);
    }
});
const localeSet = $locale.set;
$locale.set = (newLocale) => {
    if (getClosestAvailableLocale(newLocale) && hasLocaleQueue(newLocale)) {
        return flush(newLocale).then(() => localeSet(newLocale));
    }
    return localeSet(newLocale);
};
// $locale.update = (fn: (locale: string) => void | Promise<void>) => localeSet(fn(current)); This was what I had but typescript doesn't like it, not sure if i refactored correctly.
// istanbul ignore next
$locale.update = (fn) => {
    fn(current);
    localeSet(current);
};
export { $locale };