import { defineComponent, type PropType } from 'vue';
import * as Radix from 'radix-vue';
import { useVModel } from '@vueuse/core';
import { isMobile } from '../composables';
import Hover from './Hover';
import './PencilWeight.css';

export default defineComponent({
  name: 'PencilWeight',
  props: {
    modelValue: Array as PropType<number[]>,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const internalValue = useVModel(props, 'modelValue', emit);

    return {
      internalValue,
    };
  },
  render() {
    return (
      <Radix.SliderRoot
        v-model={this.internalValue}
        class="PencilWeight"
        min={1}
        max={30}
        orientation={isMobile.value ? 'horizontal' : 'vertical'}
      >
        <Radix.SliderTrack class="PencilWeightTrack">
          <Radix.SliderRange class="PencilWeightRange" />
        </Radix.SliderTrack>
        <Hover side="right" content={this.internalValue?.join('')} disableClosingTrigger>
          <Radix.SliderThumb class="PencilWeightThumb">
            {isMobile.value ? this.internalValue?.join('') : null}
          </Radix.SliderThumb>
        </Hover>
      </Radix.SliderRoot>
    );
  },
});
