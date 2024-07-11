import { defineComponent, ref } from 'vue';
import * as Radix from 'radix-vue';
import { useLocale } from '../composables';
import Hover from './Hover';
import './PencilAction.css';

export type Action = 'Draw' | 'Eraser' | 'Delete';

export default defineComponent({
  name: 'PencilAction',
  emits: {
    action: (type: Action | undefined) => true,
  },
  setup(props, ctx) {
    const drawPressed = ref(false);
    const eraserPressed = ref(false);
    const { t } = useLocale({
      zhCN: {
        Draw: '自由书写',
        Eraser: '橡皮擦',
        Delete: '删除',
      },
      en: {
        Draw: 'Draw',
        Eraser: 'Eraser',
        Delete: 'Delete',
      },
    });

    function onDidDraw(value: boolean) {
      drawPressed.value = value;
      eraserPressed.value = false;
      ctx.emit('action', value ? 'Draw' : undefined);
    }

    function onDidEraser(value: boolean) {
      eraserPressed.value = value;
      drawPressed.value = false;
      ctx.emit('action', value ? 'Eraser' : undefined);
    }

    function onDidDelete() {
      drawPressed.value = false;
      eraserPressed.value = false;
      ctx.emit('action', 'Delete');
    }

    return {
      drawPressed,
      eraserPressed,
      onDidDraw,
      onDidEraser,
      onDidDelete,
      t,
    };
  },
  render() {
    return (
      <div class="PencilAction">
        <Hover content={this.t('Draw').value} side="top">
          <Radix.Toggle class="PencilActionItem" pressed={this.drawPressed} onUpdate:pressed={this.onDidDraw}>
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 20 20"
              class=""
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <g stroke-width="1.25">
                <path
                  clip-rule="evenodd"
                  d="m7.643 15.69 7.774-7.773a2.357 2.357 0 1 0-3.334-3.334L4.31 12.357a3.333 3.333 0 0 0-.977 2.357v1.953h1.953c.884 0 1.732-.352 2.357-.977Z"
                ></path>
                <path d="m11.25 5.417 3.333 3.333"></path>
              </g>
            </svg>
          </Radix.Toggle>
        </Hover>

        <Hover content={this.t('Eraser').value} side="top">
          <Radix.Toggle class="PencilActionItem" pressed={this.eraserPressed} onUpdate:pressed={this.onDidEraser}>
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 24 24"
              class=""
              fill="none"
              stroke-width="2"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <g stroke-width="1.5">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3"></path>
                <path d="M18 13.3l-6.3 -6.3"></path>
              </g>
            </svg>
          </Radix.Toggle>
        </Hover>

        <Hover content={this.t('Delete').value} side="top">
          <button class="PencilActionItem" type="button" onClick={this.onDidDelete}>
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 20 20"
              class=""
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                stroke-width="1.25"
                d="M3.333 5.833h13.334M8.333 9.167v5M11.667 9.167v5M4.167 5.833l.833 10c0 .92.746 1.667 1.667 1.667h6.666c.92 0 1.667-.746 1.667-1.667l.833-10M7.5 5.833v-2.5c0-.46.373-.833.833-.833h3.334c.46 0 .833.373.833.833v2.5"
              ></path>
            </svg>
          </button>
        </Hover>
      </div>
    );
  },
});
