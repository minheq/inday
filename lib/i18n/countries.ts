import { countries, Country } from 'countries-list';

export function getCountries(): Country[] {
  return Object.values(countries);
}
