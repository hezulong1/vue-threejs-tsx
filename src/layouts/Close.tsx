import { type HTMLAttributes } from 'vue';
import { useLocale } from '../composables';

interface CloseProps extends HTMLAttributes {}

function Close(props: CloseProps) {
  const { t } = useLocale({
    zhCN: {
      close: '关闭画板',
    },
    en: {
      close: 'Close',
    },
  });

  return (
    <a class="IconButton as-close" title={t('close').value} aria-label="Close">
      <svg
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 512 512"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M368 368L144 144"
        ></path>
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M368 144L144 368"
        ></path>
      </svg>
    </a>
  );
}

export default Close;
