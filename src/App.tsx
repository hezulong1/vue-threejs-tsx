import { defineComponent } from 'vue';
import * as Radix from 'radix-vue';
import Draw from './layouts/Draw';
import Model from './layouts/Model';
import Close from './layouts/Close';
import Util, { type UtilType } from './layouts/Util';
import './layouts/layout.css';
import Locale from './layouts/Locale';
import { isMobile, toggleDark } from './composables';

export default defineComponent({
  name: 'App',
  data() {
    return {
      renderDraw: false,
      renderMask: false,
      openToast: '',
    };
  },
  methods: {
    onDidAction(type: UtilType, lock?: boolean) {
      if (type === 'UseDraw') {
        this.renderDraw = true;
      } else if (type === 'ChangeBackground') {
        toggleDark();
      } else if (type === 'LockScreen') {
        this.renderMask = lock!;
      }
    },
  },
  render() {
    return (
      <Radix.TooltipProvider>
        {!isMobile.value && <Locale style={this.renderDraw ? { top: '63px' } : null} />}
        {this.renderDraw && <Close onClick={() => (this.renderDraw = false)} />}
        {this.renderDraw && <Draw />}
        <Model />
        <div
          class="GridView Mask up"
          v-show={this.renderMask && !this.renderDraw}
          style={{ transform: 'scale(1.5)' }}
        />
        <Util v-show={!this.renderDraw} onAction={this.onDidAction} style={{ zIndex: 2 }} />
      </Radix.TooltipProvider>
    );
  },
});
