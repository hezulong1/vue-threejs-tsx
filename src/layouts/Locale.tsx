import { type HTMLAttributes } from 'vue';
import { useLocale, setLocale } from '../composables';

interface CloseProps extends HTMLAttributes {}

function Locale(props: CloseProps) {
  const { t, locale } = useLocale({
    zhCN: {
      locale: '中',
    },
    en: {
      locale: 'EN',
    },
  });

  function onDidChange(e: Event) {
    e.preventDefault();
    if (locale === 'zhCN') {
      setLocale('en');
    } else {
      setLocale('zhCN');
    }
  }

  return (
    <a class="IconButton as-locale" title={t('locale').value} onClick={onDidChange}>
      <span>{t('locale').value}</span>
    </a>
  );
}

export default Locale;
