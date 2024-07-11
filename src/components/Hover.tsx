import { defineComponent, type PropType } from 'vue';
import * as Radix from 'radix-vue';
import { isMobile } from '../composables';
import './Hover.css';

export default defineComponent({
  name: 'Hover',
  props: {
    side: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
    content: String,
    disableClosingTrigger: Boolean,
  },
  setup(props, ctx) {
    return () => {
      if (isMobile.value) {
        return ctx.slots.default?.();
      } else {
        return (
          <Radix.TooltipRoot disableClosingTrigger={props.disableClosingTrigger}>
            <Radix.TooltipTrigger asChild>{ctx.slots.default?.()}</Radix.TooltipTrigger>
            <Radix.TooltipPortal to="#portal">
              <Radix.TooltipContent class="TooltipContent" side={props.side}>
                <span>{props.content}</span>
                <Radix.TooltipArrow class="TooltipArrow" width={12} height={6} />
              </Radix.TooltipContent>
            </Radix.TooltipPortal>
          </Radix.TooltipRoot>
        );
      }
    };
  },
});
