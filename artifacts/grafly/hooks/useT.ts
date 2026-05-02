import { useCallback, useMemo } from "react";
import { useProfile } from "@/context/ProfileContext";
import { translate, type TranslationKey, type Language, isRTL, textDir } from "@/lib/i18n";

export function useT() {
  const { state } = useProfile();
  const lang = state.language;

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      translate(lang, key, vars),
    [lang],
  );

  return useMemo(
    () => ({
      t,
      lang: lang as Language,
      isRTL: isRTL(lang),
      dir: textDir(lang),
    }),
    [t, lang],
  );
}
