// @ts-ignore
import { derived } from "svelte/store";
import {
    getDateFormatter,
    getNumberFormatter, getTimeFormatter
} from '../includes/formatters.js';
import { hasLocaleQueue } from '../includes/loaderQueue.js';
import { lookup } from '../includes/lookup.js';
import { getCurrentLocale, getOptions, getPossibleLocales } from '../includes/utils.js';
import {
    DateFormatter, MessageFormatter,
    MessageObject, NumberFormatter, TimeFormatter
} from '../types/index.js';
import { $dictionary } from './dictionary.js';
import { $locale } from './locale.js';



export const formatMessage: MessageFormatter = (id, options = {id: '#missing-message-id#'}) => {
  if (typeof id === 'object') {
    options = id as MessageObject;
    id = options.id;
  }

  const {
    values,
    locale = getCurrentLocale(),
    default: defaultValue,
  } = options;

  if (locale == null) {
    throw new Error(
      '[svelte-i18n] Cannot format a message without first setting the initial locale.',
    );
  }

  let message = lookup(id, locale);

  if (!message) {
    if (getOptions().warnOnMissingMessages) {
      // istanbul ignore next
      console.warn(
        `[svelte-i18n] The message "${id}" was not found in "${getPossibleLocales(
          locale,
        ).join('", "')}".${
          hasLocaleQueue(getCurrentLocale())
            ? `\n\nNote: there are at least one loader still registered to this locale that wasn't executed.`
            : ''
        }`,
      );
    }

    return defaultValue || id;
  }

  if (typeof message === 'string') {
    return message;
  } else {
    return message(...Object.keys(options.values || {}).sort().map(k => (options.values || {})[k]));
  }
};


export const formatTime: TimeFormatter = (t, options) =>
  getTimeFormatter(options).format(t)

export const formatDate: DateFormatter = (d, options) =>
  getDateFormatter(options).format(d)

export const formatNumber: NumberFormatter = (n, options) =>
  getNumberFormatter(options).format(n)

export const $format = /*@__PURE__*/derived([$locale, $dictionary], () => formatMessage);
export const $formatTime = /*@__PURE__*/derived([$locale], () => formatTime);
export const $formatDate = /*@__PURE__*/derived([$locale], () => formatDate);
export const $formatNumber = /*@__PURE__*/derived([$locale], () => formatNumber);
