import { computed, defineComponent, type PropType } from 'vue';
import * as Radix from 'radix-vue';
import { objectEntries, useVModel } from '@vueuse/core';
import { isMobile, useLocale } from '../composables';
import Hover from './Hover';
import './PencilColor.css';

export enum Palette {
  White = '#ffffff',
  Black = '#000000',
  Red = '#ff3333',
  Blue = '#0066ff',
  Yellow = '#ffff33',
  Green = '#33cc66',
  Gray = '#808080',
}

export default defineComponent({
  name: 'PencilColor',
  props: {
    modelValue: String as PropType<Palette>,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const internalValue = useVModel(props, 'modelValue', emit);
    const orientation = computed(() => (isMobile.value ? 'horizontal' : 'vertical'));
    const { t } = useLocale({
      zhCN: {
        White: '白色',
        Black: '黑色',
        Red: '红色',
        Blue: '蓝色',
        Yellow: '黄色',
        Green: '绿色',
        Gray: '灰色',
      },
      en: {
        White: 'White',
        Black: 'Black',
        Red: 'Red',
        Blue: 'Blue',
        Yellow: 'Yellow',
        Green: 'Green',
        Gray: 'Gray',
      },
    });

    return () => {
      return (
        <Radix.RadioGroupRoot v-model={internalValue.value} class="PencilColor" orientation={orientation.value}>
          {objectEntries(Palette).map(([name, color]) => (
            <Hover content={t(name).value} side="right">
              <Radix.RadioGroupItem
                class="PencilColorItem"
                aria-label={name}
                value={color}
                style={{ background: color }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-check-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                </svg>
              </Radix.RadioGroupItem>
            </Hover>
          ))}
        </Radix.RadioGroupRoot>
      );
    };
  },
});
