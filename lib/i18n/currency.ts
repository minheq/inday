import { unique } from '../js_utils';
import { getCountries } from './countries';

export function formatCurrency(
  amount: number,
  locale: string,
  currency: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getCurrencies(): string[] {
  const countries = getCountries();

  return unique(countries.map((country) => country.currency));
}
