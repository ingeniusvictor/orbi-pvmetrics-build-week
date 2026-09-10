import React, { createContext, useContext } from 'react';
import {
  DEFAULT_COMMISSIONING_LOCALE,
  commissioningBooleanLabel,
  commissioningCanonicalLabel,
  commissioningMissingLabel,
  commissioningNotLoadedLabel,
  commissioningNotRecordedLabel,
  commissioningText,
  type CommissioningLocale,
} from './commissioningLocale';

type CommissioningI18n = {
  locale: CommissioningLocale;
  text: (spanish: string, english: string) => string;
  canonical: (value: string) => string;
  boolean: (value: boolean) => string;
  missing: string;
  notRecorded: string;
  notLoaded: string;
};

const createI18n = (locale: CommissioningLocale): CommissioningI18n => ({
  locale,
  text: (spanish, english) => commissioningText(locale, spanish, english),
  canonical: (value) => commissioningCanonicalLabel(locale, value),
  boolean: (value) => commissioningBooleanLabel(locale, value),
  missing: commissioningMissingLabel(locale),
  notRecorded: commissioningNotRecordedLabel(locale),
  notLoaded: commissioningNotLoadedLabel(locale),
});

const CommissioningLocaleContext = createContext<CommissioningI18n>(
  createI18n(DEFAULT_COMMISSIONING_LOCALE),
);

export const CommissioningLocaleProvider: React.FC<{
  locale: CommissioningLocale;
  children: React.ReactNode;
}> = ({ locale, children }) => (
  <CommissioningLocaleContext.Provider value={createI18n(locale)}>
    {children}
  </CommissioningLocaleContext.Provider>
);

export const useCommissioningI18n = (): CommissioningI18n => useContext(CommissioningLocaleContext);
