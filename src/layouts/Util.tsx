import { defineComponent, ref } from 'vue';
import * as Radix from 'radix-vue';
import Docker from '../components/Docker';
import Hover from '../components/Hover';
import { isDark, useLocale } from '../composables';
// import Toast from '../components/Toast';

export type UtilType = 'UseDraw' | 'LockScreen' | 'ChangeBackground';

export default defineComponent({
  emits: {
    action: (type: UtilType, lock?: boolean) => true,
  },
  setup(props, ctx) {
    const isLocked = ref(false);
    const openToast = ref(false);
    const toastText = ref('');

    const { t } = useLocale({
      zhCN: {
        UseDraw: '画板',
        LockScreen: '锁定',
        ChangeBackground: '切换背景',
        'lock.screen': '锁定屏幕',
        'unlock.screen': '解锁屏幕',
        'change.background': '切换背景成功',
      },
      en: {
        UseDraw: 'Draw',
        LockScreen: 'Lock',
        ChangeBackground: 'ChangeBackgroud',
        'lock.screen': 'Lock screen success',
        'unlock.screen': 'Unlock screen',
        'change.background': 'change background',
      },
    });

    function onDidUseDraw() {
      ctx.emit('action', 'UseDraw');
    }

    function onDidLockScreen() {
      isLocked.value = !isLocked.value;
      openToast.value = true;
      toastText.value = isLocked.value ? t('lock.screen').value : t('unlock.screen').value;
      ctx.emit('action', 'LockScreen', isLocked.value);
    }

    function onDidChangeBackgroud() {
      openToast.value = true;
      toastText.value = t('change.background').value;
      ctx.emit('action', 'ChangeBackground');
    }

    return {
      t,
      isLocked,
      openToast,
      toastText,
      onDidUseDraw,
      onDidLockScreen,
      onDidChangeBackgroud,
    };
  },
  render() {
    return (
      <Docker centered class="bottom">
        <Radix.ToolbarRoot class="Util" loop>
          <Hover content={this.t('UseDraw').value} side="top">
            <Radix.ToolbarButton asChild>
              <button class="UtilItem" type="button" onClick={this.onDidUseDraw}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-palette"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                  <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z" />
                </svg>
              </button>
            </Radix.ToolbarButton>
          </Hover>

          <Hover content={this.t('LockScreen').value} side="top">
            <Radix.ToolbarButton asChild>
              <button class="UtilItem" type="button" onClick={this.onDidLockScreen}>
                {this.isLocked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-lock"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-unlock"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z" />
                  </svg>
                )}
              </button>
            </Radix.ToolbarButton>
          </Hover>

          <Hover content={this.t('ChangeBackground').value} side="top">
            <Radix.ToolbarButton asChild>
              <button class="UtilItem" type="button" onClick={this.onDidChangeBackgroud}>
                {isDark.value ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-moon"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-sun"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                  </svg>
                )}
              </button>
            </Radix.ToolbarButton>
          </Hover>
        </Radix.ToolbarRoot>
      </Docker>
    );
  },
});
