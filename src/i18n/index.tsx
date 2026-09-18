import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { DICTIONARIES, type Lang, type StringKey } from './strings';

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children, initial = 'mr' }: { children: ReactNode; initial?: Lang }) {
  const [lang, setLang] = useState<Lang>(initial);

  const t = useCallback(
    (key: StringKey, vars?: Record<string, string | number>) => {
      const dict = DICTIONARIES[lang];
      let out = dict[key] ?? DICTIONARIES.mr[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
      }
      return out;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

/**
 * Indian digit grouping (2,2,3) — ₹1,600 and ₹1,25,000 both render the way a
 * rider reads them on a payout receipt.
 */
export function formatRupees(paise: number, lang: Lang): string {
  const rupees = paise / 100;
  const locale = lang === 'mr' ? 'mr-IN' : 'en-IN';
  // Latin digits: the references render 24 / 320 / 411045, not २४ / ३२० /
  // ४११०४५. Marathi copy with Latin numerals is what the product ships.
  return new Intl.NumberFormat(locale, {
    numberingSystem: 'latn',
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(rupees);
}

export function formatDistance(metres: number, lang: Lang): { value: string; unit: StringKey } {
  if (metres < 1000) {
    return {
      value: new Intl.NumberFormat(lang === 'mr' ? 'mr-IN' : 'en-IN', { numberingSystem: 'latn' }).format(metres),
      unit: 'common.metre',
    };
  }
  return {
    value: new Intl.NumberFormat(lang === 'mr' ? 'mr-IN' : 'en-IN', {
      numberingSystem: 'latn',
      maximumFractionDigits: 1,
    }).format(metres / 1000),
    unit: 'common.km',
  };
}

export type { Lang, StringKey };
