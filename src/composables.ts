import { computed, ref, watch } from 'vue';
import { useBreakpoints, useDark, useToggle } from '@vueuse/core';

const breakpoints = useBreakpoints({ mobile: 0, tablet: 768 });

export const isMobile = breakpoints.smallerOrEqual('tablet');
export const isDark = useDark({ storageKey: '3d-color-scheme' });
export const toggleDark = useToggle(isDark);

type Lang = 'zhCN' | 'en';
type LangSetter<P extends string> = Record<Lang, Record<P, string>>;

const locale = ref<Lang>('zhCN');

let _console: VConsole | undefined;

const newVConsole = () => {
  _console = new VConsole({ theme: isDark.value ? 'dark' : 'light' });
};

export function setupVConsole() {
  isMobile.value && newVConsole();

  watch(isMobile, value => {
    if (value) {
      newVConsole();
    } else {
      _console?.destroy();
      _console = undefined;
    }
  });

  watch(isDark, newVConsole);
}

export function setLocale(lang: Lang) {
  locale.value = lang;
}

export function useLocale<T>(setter: T) {
  type P = T extends LangSetter<infer P> ? P : string;
  const t = (prop: P) => computed(() => (setter as LangSetter<P>)[locale.value][prop]);
  return { t, locale: locale.value };
}
