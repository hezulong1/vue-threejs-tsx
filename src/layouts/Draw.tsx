import { defineComponent, ref, watch } from 'vue';
import { tryOnMounted, tryOnScopeDispose, useEventListener, useWindowSize, type Position } from '@vueuse/core';
import { isMobile } from '../composables';
import Docker from '../components/Docker';
import PencilColor, { Palette } from '../components/PencilColor';
import PencilAction, { type Action } from '../components/PencilAction';
import PencilWeight from '../components/PencilWeight';

export default defineComponent({
  setup() {
    const canvasRef = ref<HTMLCanvasElement>();
    const pencilColor = ref<Palette>(Palette.Red);
    const pencilWeight = ref([4]);
    const action = ref<Action>();
    const { width: viewportWidth, height: viewportHeight } = useWindowSize();

    // Private
    let isPointerDown = ref(false);
    let startPos: Position = { x: 0, y: 0 };
    let canvasContext: CanvasRenderingContext2D;

    // Canvas
    // --------------------------------------
    const setColor = (color: string) => {
      if (!canvasContext) return;
      canvasContext.fillStyle = color;
      canvasContext.strokeStyle = color;
    };

    const clear = () => {
      if (!canvasContext) return;
      canvasContext.clip();
      canvasContext.clearRect(0, 0, viewportWidth.value, viewportHeight.value);
      canvasContext.restore();
    };

    const onStart = () => {
      if (!canvasContext) return;

      canvasContext.save();
      canvasContext.beginPath();
      canvasContext.arc(startPos.x, startPos.y, 0, 0, Math.PI * 2);
      canvasContext.fill();

      if (action.value === 'Eraser') {
        clear();
      }
    };

    const onDraw = (x: number, y: number) => {
      if (!canvasContext) return;

      canvasContext.lineWidth = pencilWeight.value[0];

      const draw = () => {
        canvasContext.moveTo(startPos.x, startPos.y);
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
        canvasContext.closePath();
      };

      if (action.value === 'Eraser') {
        canvasContext.save();
        canvasContext.globalCompositeOperation = 'destination-out';
        draw();
        clear();
      } else {
        draw();
      }
    };

    function onDidAction(type: Action | undefined) {
      action.value = type;
      if (!canvasContext) return;
      if (type === 'Delete') {
        canvasContext.clearRect(0, 0, viewportWidth.value, viewportHeight.value);
      }
    }

    tryOnMounted(() => {
      canvasContext = canvasRef.value?.getContext('2d')!;
      canvasContext.lineCap = 'round';
      canvasContext.lineJoin = 'round';
      setColor(pencilColor.value);
    });

    watch(pencilColor, value => {
      setColor(value);
    });

    const eventIsAllowed = (e: PointerEvent): boolean => {
      const isReleasingButton = e.buttons === 0;
      const isPrimaryButton = e.buttons === 1;
      return (isReleasingButton || isPrimaryButton) ?? true;
    };

    const stops = [
      useEventListener(canvasRef, 'pointerdown', e => {
        if (!eventIsAllowed(e)) return;
        if (action.value !== 'Draw' && action.value !== 'Eraser') return;

        isPointerDown.value = true;
        const eventTarget = e.target as HTMLElement | undefined;
        eventTarget?.setPointerCapture(e.pointerId);

        const { clientX: x, clientY: y } = e;
        startPos.x = x;
        startPos.y = y;
        onStart();
      }),

      useEventListener(canvasRef, 'pointermove', e => {
        if (!eventIsAllowed(e)) return;
        if (action.value !== 'Draw' && action.value !== 'Eraser') return;
        if (!isPointerDown.value) return;

        const { clientX: x, clientY: y } = e;
        onDraw(x, y);
        startPos.x = x;
        startPos.y = y;
      }),

      useEventListener(canvasRef, 'pointerup', e => {
        if (!eventIsAllowed(e)) return;

        isPointerDown.value = false;
        const eventTarget = e.target as HTMLElement | undefined;
        eventTarget?.releasePointerCapture(e.pointerId);
      }),
    ];

    tryOnScopeDispose(() => {
      stops.forEach(s => s());
    });

    return {
      canvasRef,
      pencilColor,
      pencilWeight,
      action,
      viewportWidth,
      viewportHeight,
      onDidAction,
    };
  },
  render() {
    const cnDashboard = {
      Dashboard: true,
      'cursor-pencil': this.action === 'Draw',
      'cursor-eraser': this.action === 'Eraser',
    };

    const cnDocker = {
      left: true,
      bottom: isMobile.value,
    };
    return (
      <div class="GridView Draw up">
        <div class={cnDashboard}>
          <canvas ref="canvasRef" width={this.viewportWidth} height={this.viewportHeight}></canvas>
        </div>

        <Docker centered={isMobile.value} class={cnDocker}>
          <PencilColor v-model={this.pencilColor}></PencilColor>
          <PencilWeight v-model={this.pencilWeight}></PencilWeight>
        </Docker>

        <Docker centered class="bottom">
          <PencilAction onAction={this.onDidAction}></PencilAction>
        </Docker>
      </div>
    );
  },
});
