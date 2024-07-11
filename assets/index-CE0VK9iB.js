import { ref, computed, createVNode, defineComponent, isVNode, watch, onMounted, createTextVNode, withDirectives, vShow, createApp } from "vue";
import { u as useBreakpoints, a as useDark, b as useToggle, E as Eg, P as Pg, B as Bg, D as Dg, $ as $g, c as useVModel, h as hy, o as objectEntries, y as yy, z as zf, N as Ny, K as Ky, H as Hy, d as zy, e as useWindowSize, t as tryOnMounted, f as useEventListener, g as tryOnScopeDispose, i as bg, G as Gf, S as Sg } from "./vendor-BMQg4wy-.js";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const breakpoints = useBreakpoints({ mobile: 0, tablet: 768 });
const isMobile = breakpoints.smallerOrEqual("tablet");
const isDark = useDark({ storageKey: "3d-color-scheme" });
const toggleDark = useToggle(isDark);
const locale = ref("zhCN");
function setLocale(lang) {
  locale.value = lang;
}
function useLocale(setter) {
  const t = (prop) => computed(() => setter[locale.value][prop]);
  return { t, locale: locale.value };
}
const Docker = (props, ctx) => {
  var _a, _b;
  const cn = {
    Docker: true,
    centered: props.centered
  };
  return createVNode("div", {
    "class": cn
  }, [(_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a)]);
};
Docker.props = {
  centered: Boolean
};
Docker.displayName = "Docker";
const Hover = /* @__PURE__ */ defineComponent({
  name: "Hover",
  props: {
    side: String,
    content: String,
    disableClosingTrigger: Boolean
  },
  setup(props, ctx) {
    return () => {
      var _a, _b;
      if (isMobile.value) {
        return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
      } else {
        return createVNode(Eg, {
          "disableClosingTrigger": props.disableClosingTrigger
        }, {
          default: () => [createVNode(Pg, {
            "asChild": true
          }, {
            default: () => {
              var _a2, _b2;
              return [(_b2 = (_a2 = ctx.slots).default) == null ? void 0 : _b2.call(_a2)];
            }
          }), createVNode(Bg, {
            "to": "#portal"
          }, {
            default: () => [createVNode(Dg, {
              "class": "TooltipContent",
              "side": props.side
            }, {
              default: () => [createVNode("span", null, [props.content]), createVNode($g, {
                "class": "TooltipArrow",
                "width": 12,
                "height": 6
              }, null)]
            })]
          })]
        });
      }
    };
  }
});
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
let Palette = /* @__PURE__ */ function(Palette2) {
  Palette2["White"] = "#ffffff";
  Palette2["Black"] = "#000000";
  Palette2["Red"] = "#ff3333";
  Palette2["Blue"] = "#0066ff";
  Palette2["Yellow"] = "#ffff33";
  Palette2["Green"] = "#33cc66";
  Palette2["Gray"] = "#808080";
  return Palette2;
}({});
const PencilColor = /* @__PURE__ */ defineComponent({
  name: "PencilColor",
  props: {
    modelValue: String
  },
  emits: ["update:modelValue"],
  setup(props, {
    emit
  }) {
    const internalValue = useVModel(props, "modelValue", emit);
    const orientation = computed(() => isMobile.value ? "horizontal" : "vertical");
    const {
      t
    } = useLocale({
      zhCN: {
        White: "白色",
        Black: "黑色",
        Red: "红色",
        Blue: "蓝色",
        Yellow: "黄色",
        Green: "绿色",
        Gray: "灰色"
      },
      en: {
        White: "White",
        Black: "Black",
        Red: "Red",
        Blue: "Blue",
        Yellow: "Yellow",
        Green: "Green",
        Gray: "Gray"
      }
    });
    return () => {
      let _slot;
      return createVNode(hy, {
        "modelValue": internalValue.value,
        "onUpdate:modelValue": ($event) => internalValue.value = $event,
        "class": "PencilColor",
        "orientation": orientation.value
      }, _isSlot(_slot = objectEntries(Palette).map(([name, color]) => createVNode(Hover, {
        "content": t(name).value,
        "side": "right"
      }, {
        default: () => [createVNode(yy, {
          "class": "PencilColorItem",
          "aria-label": name,
          "value": color,
          "style": {
            background: color
          }
        }, {
          default: () => [createVNode("svg", {
            "xmlns": "http://www.w3.org/2000/svg",
            "width": "16",
            "height": "16",
            "fill": "currentColor",
            "class": "bi bi-check-lg",
            "viewBox": "0 0 16 16"
          }, [createVNode("path", {
            "d": "M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"
          }, null)])]
        })]
      }))) ? _slot : {
        default: () => [_slot]
      });
    };
  }
});
const PencilAction = /* @__PURE__ */ defineComponent({
  name: "PencilAction",
  emits: {
    action: (type) => true
  },
  setup(props, ctx) {
    const drawPressed = ref(false);
    const eraserPressed = ref(false);
    const {
      t
    } = useLocale({
      zhCN: {
        Draw: "自由书写",
        Eraser: "橡皮擦",
        Delete: "删除"
      },
      en: {
        Draw: "Draw",
        Eraser: "Eraser",
        Delete: "Delete"
      }
    });
    function onDidDraw(value) {
      drawPressed.value = value;
      eraserPressed.value = false;
      ctx.emit("action", value ? "Draw" : void 0);
    }
    function onDidEraser(value) {
      eraserPressed.value = value;
      drawPressed.value = false;
      ctx.emit("action", value ? "Eraser" : void 0);
    }
    function onDidDelete() {
      drawPressed.value = false;
      eraserPressed.value = false;
      ctx.emit("action", "Delete");
    }
    return {
      drawPressed,
      eraserPressed,
      onDidDraw,
      onDidEraser,
      onDidDelete,
      t
    };
  },
  render() {
    return createVNode("div", {
      "class": "PencilAction"
    }, [createVNode(Hover, {
      "content": this.t("Draw").value,
      "side": "top"
    }, {
      default: () => [createVNode(zf, {
        "class": "PencilActionItem",
        "pressed": this.drawPressed,
        "onUpdate:pressed": this.onDidDraw
      }, {
        default: () => [createVNode("svg", {
          "aria-hidden": "true",
          "focusable": "false",
          "role": "img",
          "viewBox": "0 0 20 20",
          "class": "",
          "fill": "none",
          "stroke": "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }, [createVNode("g", {
          "stroke-width": "1.25"
        }, [createVNode("path", {
          "clip-rule": "evenodd",
          "d": "m7.643 15.69 7.774-7.773a2.357 2.357 0 1 0-3.334-3.334L4.31 12.357a3.333 3.333 0 0 0-.977 2.357v1.953h1.953c.884 0 1.732-.352 2.357-.977Z"
        }, null), createVNode("path", {
          "d": "m11.25 5.417 3.333 3.333"
        }, null)])])]
      })]
    }), createVNode(Hover, {
      "content": this.t("Eraser").value,
      "side": "top"
    }, {
      default: () => [createVNode(zf, {
        "class": "PencilActionItem",
        "pressed": this.eraserPressed,
        "onUpdate:pressed": this.onDidEraser
      }, {
        default: () => [createVNode("svg", {
          "aria-hidden": "true",
          "focusable": "false",
          "role": "img",
          "viewBox": "0 0 24 24",
          "class": "",
          "fill": "none",
          "stroke-width": "2",
          "stroke": "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }, [createVNode("g", {
          "stroke-width": "1.5"
        }, [createVNode("path", {
          "stroke": "none",
          "d": "M0 0h24v24H0z",
          "fill": "none"
        }, null), createVNode("path", {
          "d": "M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3"
        }, null), createVNode("path", {
          "d": "M18 13.3l-6.3 -6.3"
        }, null)])])]
      })]
    }), createVNode(Hover, {
      "content": this.t("Delete").value,
      "side": "top"
    }, {
      default: () => [createVNode("button", {
        "class": "PencilActionItem",
        "type": "button",
        "onClick": this.onDidDelete
      }, [createVNode("svg", {
        "aria-hidden": "true",
        "focusable": "false",
        "role": "img",
        "viewBox": "0 0 20 20",
        "class": "",
        "fill": "none",
        "stroke": "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }, [createVNode("path", {
        "stroke-width": "1.25",
        "d": "M3.333 5.833h13.334M8.333 9.167v5M11.667 9.167v5M4.167 5.833l.833 10c0 .92.746 1.667 1.667 1.667h6.666c.92 0 1.667-.746 1.667-1.667l.833-10M7.5 5.833v-2.5c0-.46.373-.833.833-.833h3.334c.46 0 .833.373.833.833v2.5"
      }, null)])])]
    })]);
  }
});
const PencilWeight = /* @__PURE__ */ defineComponent({
  name: "PencilWeight",
  props: {
    modelValue: Array
  },
  emits: ["update:modelValue"],
  setup(props, {
    emit
  }) {
    const internalValue = useVModel(props, "modelValue", emit);
    return {
      internalValue
    };
  },
  render() {
    return createVNode(Ny, {
      "modelValue": this.internalValue,
      "onUpdate:modelValue": ($event) => this.internalValue = $event,
      "class": "PencilWeight",
      "min": 1,
      "max": 30,
      "orientation": isMobile.value ? "horizontal" : "vertical"
    }, {
      default: () => {
        var _a;
        return [createVNode(Ky, {
          "class": "PencilWeightTrack"
        }, {
          default: () => [createVNode(Hy, {
            "class": "PencilWeightRange"
          }, null)]
        }), createVNode(Hover, {
          "side": "right",
          "content": (_a = this.internalValue) == null ? void 0 : _a.join(""),
          "disableClosingTrigger": true
        }, {
          default: () => [createVNode(zy, {
            "class": "PencilWeightThumb"
          }, {
            default: () => {
              var _a2;
              return [isMobile.value ? (_a2 = this.internalValue) == null ? void 0 : _a2.join("") : null];
            }
          })]
        })];
      }
    });
  }
});
const Draw = /* @__PURE__ */ defineComponent({
  setup() {
    const canvasRef = ref();
    const pencilColor = ref(Palette.Red);
    const pencilWeight = ref([4]);
    const action = ref();
    const {
      width: viewportWidth,
      height: viewportHeight
    } = useWindowSize();
    let isPointerDown = ref(false);
    let startPos = {
      x: 0,
      y: 0
    };
    let canvasContext;
    const setColor = (color) => {
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
      if (action.value === "Eraser") {
        clear();
      }
    };
    const onDraw = (x, y) => {
      if (!canvasContext) return;
      canvasContext.lineWidth = pencilWeight.value[0];
      const draw = () => {
        canvasContext.moveTo(startPos.x, startPos.y);
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
        canvasContext.closePath();
      };
      if (action.value === "Eraser") {
        canvasContext.save();
        canvasContext.globalCompositeOperation = "destination-out";
        draw();
        clear();
      } else {
        draw();
      }
    };
    function onDidAction(type) {
      action.value = type;
      if (!canvasContext) return;
      if (type === "Delete") {
        canvasContext.clearRect(0, 0, viewportWidth.value, viewportHeight.value);
      }
    }
    tryOnMounted(() => {
      var _a;
      canvasContext = (_a = canvasRef.value) == null ? void 0 : _a.getContext("2d");
      canvasContext.lineCap = "round";
      canvasContext.lineJoin = "round";
      setColor(pencilColor.value);
    });
    watch(pencilColor, (value) => {
      setColor(value);
    });
    const eventIsAllowed = (e) => {
      const isReleasingButton = e.buttons === 0;
      const isPrimaryButton = e.buttons === 1;
      return (isReleasingButton || isPrimaryButton) ?? true;
    };
    const stops = [useEventListener(canvasRef, "pointerdown", (e) => {
      if (!eventIsAllowed(e)) return;
      if (action.value !== "Draw" && action.value !== "Eraser") return;
      isPointerDown.value = true;
      const eventTarget = e.target;
      eventTarget == null ? void 0 : eventTarget.setPointerCapture(e.pointerId);
      const {
        clientX: x,
        clientY: y
      } = e;
      startPos.x = x;
      startPos.y = y;
      onStart();
    }), useEventListener(canvasRef, "pointermove", (e) => {
      if (!eventIsAllowed(e)) return;
      if (action.value !== "Draw" && action.value !== "Eraser") return;
      if (!isPointerDown.value) return;
      const {
        clientX: x,
        clientY: y
      } = e;
      onDraw(x, y);
      startPos.x = x;
      startPos.y = y;
    }), useEventListener(canvasRef, "pointerup", (e) => {
      if (!eventIsAllowed(e)) return;
      isPointerDown.value = false;
      const eventTarget = e.target;
      eventTarget == null ? void 0 : eventTarget.releasePointerCapture(e.pointerId);
    })];
    tryOnScopeDispose(() => {
      stops.forEach((s) => s());
    });
    return {
      canvasRef,
      pencilColor,
      pencilWeight,
      action,
      viewportWidth,
      viewportHeight,
      onDidAction
    };
  },
  render() {
    const cnDashboard = {
      Dashboard: true,
      "cursor-pencil": this.action === "Draw",
      "cursor-eraser": this.action === "Eraser"
    };
    const cnDocker = {
      left: true,
      bottom: isMobile.value
    };
    return createVNode("div", {
      "class": "GridView Draw up"
    }, [createVNode("div", {
      "class": cnDashboard
    }, [createVNode("canvas", {
      "ref": "canvasRef",
      "width": this.viewportWidth,
      "height": this.viewportHeight
    }, null)]), createVNode(Docker, {
      "centered": isMobile.value,
      "class": cnDocker
    }, {
      default: () => [createVNode(PencilColor, {
        "modelValue": this.pencilColor,
        "onUpdate:modelValue": ($event) => this.pencilColor = $event
      }, null), createVNode(PencilWeight, {
        "modelValue": this.pencilWeight,
        "onUpdate:modelValue": ($event) => this.pencilWeight = $event
      }, null)]
    }), createVNode(Docker, {
      "centered": true,
      "class": "bottom"
    }, {
      default: () => [createVNode(PencilAction, {
        "onAction": this.onDidAction
      }, null)]
    })]);
  }
});
const BG_LIGHT = 16183004;
const BG_DARK = 4479340;
const Model = /* @__PURE__ */ defineComponent({
  name: "Model",
  setup(props, ctx) {
    const containerRef = ref();
    const {
      width,
      height
    } = useWindowSize();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark.value ? BG_DARK : BG_LIGHT);
    const camera = new THREE.PerspectiveCamera(45, width.value / height.value, 0.1, 150);
    camera.position.set(1.5, 4, 9);
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(width.value, height.value, true);
    const render = () => {
      renderer.render(scene, camera);
    };
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);
    controls.target.set(0, 2, 0);
    controls.update();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/vue-threejs-tsx/gltf/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.setPath("/vue-threejs-tsx/AVIFTest/");
    gltfLoader.load("forest_house.glb", function(gltf) {
      scene.add(gltf.scene);
      render();
    });
    watch(isDark, (dark) => {
      scene.background = new THREE.Color(dark ? BG_DARK : BG_LIGHT);
      render();
    });
    onMounted(() => {
      if (containerRef.value) {
        containerRef.value.appendChild(renderer.domElement);
        watch([width, height], ([w, h]) => {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          render();
        });
      }
    });
    return {
      containerRef
    };
  },
  render() {
    return createVNode("div", {
      "class": "GridView Model"
    }, [createVNode("div", {
      "class": "info"
    }, [createVNode("span", null, [createTextVNode("Forest House by"), " ", createVNode("a", {
      "href": "https://sketchfab.com/peachyroyalty",
      "target": "_blank",
      "rel": "noopener"
    }, [createTextVNode("peachyroyalty")])])]), createVNode("div", {
      "ref": "containerRef",
      "class": "Dashboard"
    }, null)]);
  }
});
function Close(props) {
  const {
    t
  } = useLocale({
    zhCN: {
      close: "关闭画板"
    },
    en: {
      close: "Close"
    }
  });
  return createVNode("a", {
    "class": "IconButton as-close",
    "title": t("close").value,
    "aria-label": "Close"
  }, [createVNode("svg", {
    "aria-hidden": true,
    "xmlns": "http://www.w3.org/2000/svg",
    "xmlnsXlink": "http://www.w3.org/1999/xlink",
    "viewBox": "0 0 512 512"
  }, [createVNode("path", {
    "fill": "none",
    "stroke": "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "32",
    "d": "M368 368L144 144"
  }, null), createVNode("path", {
    "fill": "none",
    "stroke": "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "32",
    "d": "M368 144L144 368"
  }, null)])]);
}
const Util = /* @__PURE__ */ defineComponent({
  emits: {
    action: (type, lock) => true
  },
  setup(props, ctx) {
    const isLocked = ref(false);
    const openToast = ref(false);
    const toastText = ref("");
    const {
      t
    } = useLocale({
      zhCN: {
        UseDraw: "画板",
        LockScreen: "锁定",
        ChangeBackground: "切换背景",
        "lock.screen": "锁定屏幕",
        "unlock.screen": "解锁屏幕",
        "change.background": "切换背景成功"
      },
      en: {
        UseDraw: "Draw",
        LockScreen: "Lock",
        ChangeBackground: "ChangeBackgroud",
        "lock.screen": "Lock screen success",
        "unlock.screen": "Unlock screen",
        "change.background": "change background"
      }
    });
    function onDidUseDraw() {
      ctx.emit("action", "UseDraw");
    }
    function onDidLockScreen() {
      isLocked.value = !isLocked.value;
      openToast.value = true;
      toastText.value = isLocked.value ? t("lock.screen").value : t("unlock.screen").value;
      ctx.emit("action", "LockScreen", isLocked.value);
    }
    function onDidChangeBackgroud() {
      openToast.value = true;
      toastText.value = t("change.background").value;
      ctx.emit("action", "ChangeBackground");
    }
    return {
      t,
      isLocked,
      openToast,
      toastText,
      onDidUseDraw,
      onDidLockScreen,
      onDidChangeBackgroud
    };
  },
  render() {
    return createVNode(Docker, {
      "centered": true,
      "class": "bottom"
    }, {
      default: () => [createVNode(bg, {
        "class": "Util",
        "loop": true
      }, {
        default: () => [createVNode(Hover, {
          "content": this.t("UseDraw").value,
          "side": "top"
        }, {
          default: () => [createVNode(Gf, {
            "asChild": true
          }, {
            default: () => [createVNode("button", {
              "class": "UtilItem",
              "type": "button",
              "onClick": this.onDidUseDraw
            }, [createVNode("svg", {
              "xmlns": "http://www.w3.org/2000/svg",
              "width": "16",
              "height": "16",
              "fill": "currentColor",
              "class": "bi bi-palette",
              "viewBox": "0 0 16 16"
            }, [createVNode("path", {
              "d": "M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
            }, null), createVNode("path", {
              "d": "M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z"
            }, null)])])]
          })]
        }), createVNode(Hover, {
          "content": this.t("LockScreen").value,
          "side": "top"
        }, {
          default: () => [createVNode(Gf, {
            "asChild": true
          }, {
            default: () => [createVNode("button", {
              "class": "UtilItem",
              "type": "button",
              "onClick": this.onDidLockScreen
            }, [this.isLocked ? createVNode("svg", {
              "xmlns": "http://www.w3.org/2000/svg",
              "width": "16",
              "height": "16",
              "fill": "currentColor",
              "class": "bi bi-lock",
              "viewBox": "0 0 16 16"
            }, [createVNode("path", {
              "d": "M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"
            }, null)]) : createVNode("svg", {
              "xmlns": "http://www.w3.org/2000/svg",
              "width": "16",
              "height": "16",
              "fill": "currentColor",
              "class": "bi bi-unlock",
              "viewBox": "0 0 16 16"
            }, [createVNode("path", {
              "d": "M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z"
            }, null)])])]
          })]
        }), createVNode(Hover, {
          "content": this.t("ChangeBackground").value,
          "side": "top"
        }, {
          default: () => [createVNode(Gf, {
            "asChild": true
          }, {
            default: () => [createVNode("button", {
              "class": "UtilItem",
              "type": "button",
              "onClick": this.onDidChangeBackgroud
            }, [isDark.value ? createVNode("svg", {
              "xmlns": "http://www.w3.org/2000/svg",
              "width": "16",
              "height": "16",
              "fill": "currentColor",
              "class": "bi bi-moon",
              "viewBox": "0 0 16 16"
            }, [createVNode("path", {
              "d": "M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"
            }, null)]) : createVNode("svg", {
              "xmlns": "http://www.w3.org/2000/svg",
              "width": "16",
              "height": "16",
              "fill": "currentColor",
              "class": "bi bi-sun",
              "viewBox": "0 0 16 16"
            }, [createVNode("path", {
              "d": "M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
            }, null)])])]
          })]
        })]
      })]
    });
  }
});
function Locale(props) {
  const {
    t,
    locale: locale2
  } = useLocale({
    zhCN: {
      locale: "中"
    },
    en: {
      locale: "EN"
    }
  });
  function onDidChange(e) {
    e.preventDefault();
    if (locale2 === "zhCN") {
      setLocale("en");
    } else {
      setLocale("zhCN");
    }
  }
  return createVNode("a", {
    "class": "IconButton as-locale",
    "title": t("locale").value,
    "onClick": onDidChange
  }, [createVNode("span", null, [t("locale").value])]);
}
const App = /* @__PURE__ */ defineComponent({
  name: "App",
  data() {
    return {
      renderDraw: false,
      renderMask: false,
      openToast: ""
    };
  },
  methods: {
    onDidAction(type, lock) {
      if (type === "UseDraw") {
        this.renderDraw = true;
      } else if (type === "ChangeBackground") {
        toggleDark();
      } else if (type === "LockScreen") {
        this.renderMask = lock;
      }
    }
  },
  render() {
    return createVNode(Sg, null, {
      default: () => [!isMobile.value && createVNode(Locale, {
        "style": this.renderDraw ? {
          top: "63px"
        } : null
      }, null), this.renderDraw && createVNode(Close, {
        "onClick": () => this.renderDraw = false
      }, null), this.renderDraw && createVNode(Draw, null, null), createVNode(Model, null, null), withDirectives(createVNode("div", {
        "class": "GridView Mask up",
        "style": {
          transform: "scale(1.5)"
        }
      }, null), [[vShow, this.renderMask && !this.renderDraw]]), withDirectives(createVNode(Util, {
        "onAction": this.onDidAction,
        "style": {
          zIndex: 2
        }
      }, null), [[vShow, !this.renderDraw]])]
    });
  }
});
createApp(App).mount("#app");
