import { computed, ref, shallowRef, watch, getCurrentScope, onScopeDispose, shallowReadonly, unref, defineComponent, Comment, mergeProps, cloneVNode, h, toRefs, getCurrentInstance, reactive, watchEffect, markRaw, openBlock, createBlock, withCtx, createVNode, renderSlot, withKeys, withModifiers, createElementBlock, Fragment, resolveDynamicComponent, renderList, createCommentVNode, normalizeStyle, onMounted, toHandlers, normalizeProps, guardReactiveProps, effectScope, readonly, nextTick, onUnmounted, Teleport, toRaw, useSlots, createTextVNode, toDisplayString, inject, provide, toHandlerKey, camelize, toRef as toRef$1, mergeDefaults, customRef, createElementVNode, isRef } from "vue";
const sides = ["top", "right", "bottom", "left"];
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v) => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn: fn2
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn2({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const arrow$2 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state;
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
const flip$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides2 = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some((side) => overflow[side] >= 0);
}
const hide$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "hide",
    options,
    async fn(state) {
      const {
        rects
      } = state;
      const {
        strategy = "referenceHidden",
        ...detectOverflowOptions
      } = evaluate(options, state);
      switch (strategy) {
        case "referenceHidden": {
          const overflow = await detectOverflow(state, {
            ...detectOverflowOptions,
            elementContext: "reference"
          });
          const offsets = getSideOffsets(overflow, rects.reference);
          return {
            data: {
              referenceHiddenOffsets: offsets,
              referenceHidden: isAnySideFullyClipped(offsets)
            }
          };
        }
        case "escaped": {
          const overflow = await detectOverflow(state, {
            ...detectOverflowOptions,
            altBoundary: true
          });
          const offsets = getSideOffsets(overflow, rects.floating);
          return {
            data: {
              escapedOffsets: offsets,
              escaped: isAnySideFullyClipped(offsets)
            }
          };
        }
        default: {
          return {};
        }
      }
    }
  };
};
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$1 = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
const shift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }
  };
};
const limitShift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset: offset2 = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset2, state);
      const computedOffset = typeof rawOffset === "number" ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === "y" ? "height" : "width";
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === "y" ? "width" : "height";
        const isOriginSide = ["top", "left"].includes(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};
const size$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "size",
    options,
    async fn(state) {
      const {
        placement,
        rects,
        platform: platform2,
        elements
      } = state;
      const {
        apply = () => {
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === "y";
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === "top" || side === "bottom") {
        heightSide = side;
        widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
      } else {
        widthSide = side;
        heightSide = alignment === "end" ? "top" : "bottom";
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if (isYAxis) {
        availableWidth = alignment || noShift ? min(overflowAvailableWidth, maximumClippingWidth) : maximumClippingWidth;
      } else {
        availableHeight = alignment || noShift ? min(overflowAvailableHeight, maximumClippingHeight) : maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform2.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
function isContainingBlock(element) {
  const webkit = isWebKit();
  const css = getComputedStyle$1(element);
  return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isTopLayer(currentNode)) {
      return null;
    }
    if (isContainingBlock(currentNode)) {
      return currentNode;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement$1(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement$1(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement$1(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = currentWin.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = currentWin.frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const x = rect.left + scroll.scrollLeft - offsets.x;
  const y = rect.top + scroll.scrollTop - offsets.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement$1(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const offset = offset$1;
const shift = shift$1;
const flip = flip$1;
const size = size$1;
const hide = hide$1;
const arrow$1 = arrow$2;
const limitShift = limitShift$1;
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
function isComponentPublicInstance(target) {
  return target != null && typeof target === "object" && "$el" in target;
}
function unwrapElement(target) {
  if (isComponentPublicInstance(target)) {
    const element = target.$el;
    return isNode(element) && getNodeName(element) === "#comment" ? null : element;
  }
  return target;
}
function toValue$1(source) {
  return typeof source === "function" ? source() : unref(source);
}
function arrow(options) {
  return {
    name: "arrow",
    options,
    fn(args) {
      const element = unwrapElement(toValue$1(options.element));
      if (element == null) {
        return {};
      }
      return arrow$1({
        element,
        padding: options.padding
      }).fn(args);
    }
  };
}
function getDPR(element) {
  if (typeof window === "undefined") {
    return 1;
  }
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}
function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}
function useFloating(reference, floating, options) {
  if (options === void 0) {
    options = {};
  }
  const whileElementsMountedOption = options.whileElementsMounted;
  const openOption = computed(() => {
    var _toValue;
    return (_toValue = toValue$1(options.open)) != null ? _toValue : true;
  });
  const middlewareOption = computed(() => toValue$1(options.middleware));
  const placementOption = computed(() => {
    var _toValue2;
    return (_toValue2 = toValue$1(options.placement)) != null ? _toValue2 : "bottom";
  });
  const strategyOption = computed(() => {
    var _toValue3;
    return (_toValue3 = toValue$1(options.strategy)) != null ? _toValue3 : "absolute";
  });
  const transformOption = computed(() => {
    var _toValue4;
    return (_toValue4 = toValue$1(options.transform)) != null ? _toValue4 : true;
  });
  const referenceElement = computed(() => unwrapElement(reference.value));
  const floatingElement = computed(() => unwrapElement(floating.value));
  const x = ref(0);
  const y = ref(0);
  const strategy = ref(strategyOption.value);
  const placement = ref(placementOption.value);
  const middlewareData = shallowRef({});
  const isPositioned = ref(false);
  const floatingStyles = computed(() => {
    const initialStyles = {
      position: strategy.value,
      left: "0",
      top: "0"
    };
    if (!floatingElement.value) {
      return initialStyles;
    }
    const xVal = roundByDPR(floatingElement.value, x.value);
    const yVal = roundByDPR(floatingElement.value, y.value);
    if (transformOption.value) {
      return {
        ...initialStyles,
        transform: "translate(" + xVal + "px, " + yVal + "px)",
        ...getDPR(floatingElement.value) >= 1.5 && {
          willChange: "transform"
        }
      };
    }
    return {
      position: strategy.value,
      left: xVal + "px",
      top: yVal + "px"
    };
  });
  let whileElementsMountedCleanup;
  function update() {
    if (referenceElement.value == null || floatingElement.value == null) {
      return;
    }
    computePosition(referenceElement.value, floatingElement.value, {
      middleware: middlewareOption.value,
      placement: placementOption.value,
      strategy: strategyOption.value
    }).then((position) => {
      x.value = position.x;
      y.value = position.y;
      strategy.value = position.strategy;
      placement.value = position.placement;
      middlewareData.value = position.middlewareData;
      isPositioned.value = true;
    });
  }
  function cleanup() {
    if (typeof whileElementsMountedCleanup === "function") {
      whileElementsMountedCleanup();
      whileElementsMountedCleanup = void 0;
    }
  }
  function attach() {
    cleanup();
    if (whileElementsMountedOption === void 0) {
      update();
      return;
    }
    if (referenceElement.value != null && floatingElement.value != null) {
      whileElementsMountedCleanup = whileElementsMountedOption(referenceElement.value, floatingElement.value, update);
      return;
    }
  }
  function reset() {
    if (!openOption.value) {
      isPositioned.value = false;
    }
  }
  watch([middlewareOption, placementOption, strategyOption], update, {
    flush: "sync"
  });
  watch([referenceElement, floatingElement], attach, {
    flush: "sync"
  });
  watch(openOption, reset, {
    flush: "sync"
  });
  if (getCurrentScope()) {
    onScopeDispose(cleanup);
  }
  return {
    x: shallowReadonly(x),
    y: shallowReadonly(y),
    strategy: shallowReadonly(strategy),
    placement: shallowReadonly(placement),
    middlewareData: shallowReadonly(middlewareData),
    isPositioned: shallowReadonly(isPositioned),
    floatingStyles,
    update
  };
}
function Q(a2, t) {
  const e = typeof a2 == "string" && !t ? `${a2}Context` : t, n = Symbol(e);
  return [(r) => {
    const i = inject(n, r);
    if (i || i === null)
      return i;
    throw new Error(
      `Injection \`${n.toString()}\` not found. Component must be used within ${Array.isArray(a2) ? `one of the following components: ${a2.join(
        ", "
      )}` : `\`${a2}\``}`
    );
  }, (r) => (provide(n, r), r)];
}
function zt(a2, t, e) {
  const n = e.originalEvent.target, l = new CustomEvent(a2, {
    bubbles: false,
    cancelable: true,
    detail: e
  });
  t && n.addEventListener(a2, t, { once: true }), n.dispatchEvent(l);
}
function Kt(a2, t = Number.NEGATIVE_INFINITY, e = Number.POSITIVE_INFINITY) {
  return Math.min(Math.max(a2, t), e);
}
function Kr(a2, t) {
  var e;
  const n = shallowRef();
  return watchEffect(() => {
    n.value = a2();
  }, {
    ...t,
    flush: (e = void 0) != null ? e : "sync"
  }), readonly(n);
}
function mt(a2) {
  return getCurrentScope() ? (onScopeDispose(a2), true) : false;
}
function ra() {
  const a2 = /* @__PURE__ */ new Set(), t = (l) => {
    a2.delete(l);
  };
  return {
    on: (l) => {
      a2.add(l);
      const s = () => t(l);
      return mt(s), {
        off: s
      };
    },
    off: t,
    trigger: (...l) => Promise.all(Array.from(a2).map((s) => s(...l)))
  };
}
function Wr(a2) {
  let t = false, e;
  const n = effectScope(true);
  return (...l) => (t || (e = n.run(() => a2(...l)), t = true), e);
}
function Ne(a2) {
  return typeof a2 == "function" ? a2() : unref(a2);
}
const Je = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Gr = (a2) => typeof a2 < "u", Yr = Object.prototype.toString, Xr = (a2) => Yr.call(a2) === "[object Object]", Ma = () => {
};
function Dt(a2, t = 1e4) {
  return customRef((e, n) => {
    let l = Ne(a2), s;
    const r = () => setTimeout(() => {
      l = Ne(a2), n();
    }, Ne(t));
    return mt(() => {
      clearTimeout(s);
    }), {
      get() {
        return e(), l;
      },
      set(i) {
        l = i, n(), clearTimeout(s), s = r();
      }
    };
  });
}
function Kn(a2, t, e = {}) {
  const {
    immediate: n = true
  } = e, l = ref(false);
  let s = null;
  function r() {
    s && (clearTimeout(s), s = null);
  }
  function i() {
    l.value = false, r();
  }
  function u(...d) {
    r(), l.value = true, s = setTimeout(() => {
      l.value = false, s = null, a2(...d);
    }, Ne(t));
  }
  return n && (l.value = true, Je && u()), mt(i), {
    isPending: readonly(l),
    start: u,
    stop: i
  };
}
function Be(a2) {
  var t;
  const e = Ne(a2);
  return (t = e == null ? void 0 : e.$el) != null ? t : e;
}
const Ut = Je ? window : void 0;
function je(...a2) {
  let t, e, n, l;
  if (typeof a2[0] == "string" || Array.isArray(a2[0]) ? ([e, n, l] = a2, t = Ut) : [t, e, n, l] = a2, !t)
    return Ma;
  Array.isArray(e) || (e = [e]), Array.isArray(n) || (n = [n]);
  const s = [], r = () => {
    s.forEach((p) => p()), s.length = 0;
  }, i = (p, c, f, v) => (p.addEventListener(c, f, v), () => p.removeEventListener(c, f, v)), u = watch(
    () => [Be(t), Ne(l)],
    ([p, c]) => {
      if (r(), !p)
        return;
      const f = Xr(c) ? { ...c } : c;
      s.push(
        ...e.flatMap((v) => n.map((g) => i(p, v, g, f)))
      );
    },
    { immediate: true, flush: "post" }
  ), d = () => {
    u(), r();
  };
  return mt(d), d;
}
function si(a2) {
  return typeof a2 == "function" ? a2 : typeof a2 == "string" ? (t) => t.key === a2 : Array.isArray(a2) ? (t) => a2.includes(t.key) : () => true;
}
function Hn(...a2) {
  let t, e, n = {};
  a2.length === 3 ? (t = a2[0], e = a2[1], n = a2[2]) : a2.length === 2 ? typeof a2[1] == "object" ? (t = true, e = a2[0], n = a2[1]) : (t = a2[0], e = a2[1]) : (t = true, e = a2[0]);
  const {
    target: l = Ut,
    eventName: s = "keydown",
    passive: r = false,
    dedupe: i = false
  } = n, u = si(t);
  return je(l, s, (p) => {
    p.repeat && Ne(i) || u(p) && e(p);
  }, r);
}
function Ha() {
  const a2 = ref(false), t = getCurrentInstance();
  return t && onMounted(() => {
    a2.value = true;
  }, t), a2;
}
function ii(a2) {
  return JSON.parse(JSON.stringify(a2));
}
function ae(a2, t, e, n = {}) {
  var l, s, r;
  const {
    clone: i = false,
    passive: u = false,
    eventName: d,
    deep: p = false,
    defaultValue: c,
    shouldEmit: f
  } = n, v = getCurrentInstance(), g = e || (v == null ? void 0 : v.emit) || ((l = v == null ? void 0 : v.$emit) == null ? void 0 : l.bind(v)) || ((r = (s = v == null ? void 0 : v.proxy) == null ? void 0 : s.$emit) == null ? void 0 : r.bind(v == null ? void 0 : v.proxy));
  let m = d;
  t || (t = "modelValue"), m = m || `update:${t.toString()}`;
  const S = (h2) => i ? typeof i == "function" ? i(h2) : ii(h2) : h2, x = () => Gr(a2[t]) ? S(a2[t]) : c, D = (h2) => {
    f ? f(h2) && g(m, h2) : g(m, h2);
  };
  if (u) {
    const h2 = x(), E = ref(h2);
    let P = false;
    return watch(
      () => a2[t],
      ($) => {
        P || (P = true, E.value = S($), nextTick(() => P = false));
      }
    ), watch(
      E,
      ($) => {
        !P && ($ !== a2[t] || p) && D($);
      },
      { deep: p }
    ), E;
  } else
    return computed({
      get() {
        return x();
      },
      set(h2) {
        D(h2);
      }
    });
}
function Wa(a2) {
  return a2 ? a2.flatMap((t) => t.type === Fragment ? Wa(t.children) : [t]) : [];
}
const [ja, vi] = Q("ConfigProvider");
function Ce(a2) {
  const t = ja({
    dir: ref("ltr")
  });
  return computed(() => {
    var e;
    return (a2 == null ? void 0 : a2.value) || ((e = t.dir) == null ? void 0 : e.value) || "ltr";
  });
}
function Te(a2) {
  const t = getCurrentInstance(), e = t == null ? void 0 : t.type.emits, n = {};
  return e != null && e.length || console.warn(
    `No emitted event found. Please check component: ${t == null ? void 0 : t.type.__name}`
  ), e == null || e.forEach((l) => {
    n[toHandlerKey(camelize(l))] = (...s) => a2(l, ...s);
  }), n;
}
function Qe(a2) {
  return computed(() => {
    var t;
    return Ne(a2) ? !!((t = Be(a2)) != null && t.closest("form")) : true;
  });
}
function Bt(a2) {
  const t = getCurrentInstance(), e = Object.keys((t == null ? void 0 : t.type.props) ?? {}).reduce((l, s) => {
    const r = (t == null ? void 0 : t.type.props[s]).default;
    return r !== void 0 && (l[s] = r), l;
  }, {}), n = toRef$1(a2);
  return computed(() => {
    const l = {}, s = (t == null ? void 0 : t.vnode.props) ?? {};
    return Object.keys(s).forEach((r) => {
      l[camelize(r)] = s[r];
    }), Object.keys({ ...e, ...l }).reduce((r, i) => (n.value[i] !== void 0 && (r[i] = n.value[i]), r), {});
  });
}
function xe(a2, t) {
  const e = Bt(a2), n = t ? Te(t) : {};
  return computed(() => ({
    ...e.value,
    ...n
  }));
}
function R() {
  const a2 = getCurrentInstance(), t = ref(), e = computed(() => {
    var r, i;
    return ["#text", "#comment"].includes((r = t.value) == null ? void 0 : r.$el.nodeName) ? (i = t.value) == null ? void 0 : i.$el.nextElementSibling : Be(t);
  }), n = Object.assign({}, a2.exposed), l = {};
  for (const r in a2.props)
    Object.defineProperty(l, r, {
      enumerable: true,
      configurable: true,
      get: () => a2.props[r]
    });
  if (Object.keys(n).length > 0)
    for (const r in n)
      Object.defineProperty(l, r, {
        enumerable: true,
        configurable: true,
        get: () => n[r]
      });
  Object.defineProperty(l, "$el", {
    enumerable: true,
    configurable: true,
    get: () => a2.vnode.el
  }), a2.exposed = l;
  function s(r) {
    t.value = r, !(r instanceof Element || !r) && (Object.defineProperty(l, "$el", {
      enumerable: true,
      configurable: true,
      get: () => r.$el
    }), a2.exposed = l);
  }
  return { forwardRef: s, currentRef: t, currentElement: e };
}
function $l(a2, t) {
  const e = Dt(false, 300), n = ref(null), l = ra();
  function s() {
    n.value = null, e.value = false;
  }
  function r(i, u) {
    const d = i.currentTarget, p = { x: i.clientX, y: i.clientY }, c = bi(p, d.getBoundingClientRect()), f = Ci(p, c), v = wi(u.getBoundingClientRect()), g = xi([...f, ...v]);
    n.value = g, e.value = true;
  }
  return watchEffect((i) => {
    if (a2.value && t.value) {
      const u = (p) => r(p, t.value), d = (p) => r(p, a2.value);
      a2.value.addEventListener("pointerleave", u), t.value.addEventListener("pointerleave", d), i(() => {
        var p, c;
        (p = a2.value) == null || p.removeEventListener("pointerleave", u), (c = t.value) == null || c.removeEventListener("pointerleave", d);
      });
    }
  }), watchEffect((i) => {
    if (n.value) {
      const u = (d) => {
        var m, S;
        if (!n.value)
          return;
        const p = d.target, c = { x: d.clientX, y: d.clientY }, f = ((m = a2.value) == null ? void 0 : m.contains(p)) || ((S = t.value) == null ? void 0 : S.contains(p)), v = !_i(c, n.value), g = p.hasAttribute("data-grace-area-trigger");
        f ? s() : (v || g) && (s(), l.trigger());
      };
      document.addEventListener("pointermove", u), i(() => document.removeEventListener("pointermove", u));
    }
  }), {
    isPointerInTransit: e,
    onPointerExit: l.on
  };
}
function bi(a2, t) {
  const e = Math.abs(t.top - a2.y), n = Math.abs(t.bottom - a2.y), l = Math.abs(t.right - a2.x), s = Math.abs(t.left - a2.x);
  switch (Math.min(e, n, l, s)) {
    case s:
      return "left";
    case l:
      return "right";
    case e:
      return "top";
    case n:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function Ci(a2, t, e = 5) {
  const n = [];
  switch (t) {
    case "top":
      n.push(
        { x: a2.x - e, y: a2.y + e },
        { x: a2.x + e, y: a2.y + e }
      );
      break;
    case "bottom":
      n.push(
        { x: a2.x - e, y: a2.y - e },
        { x: a2.x + e, y: a2.y - e }
      );
      break;
    case "left":
      n.push(
        { x: a2.x + e, y: a2.y - e },
        { x: a2.x + e, y: a2.y + e }
      );
      break;
    case "right":
      n.push(
        { x: a2.x - e, y: a2.y - e },
        { x: a2.x - e, y: a2.y + e }
      );
      break;
  }
  return n;
}
function wi(a2) {
  const { top: t, right: e, bottom: n, left: l } = a2;
  return [
    { x: l, y: t },
    { x: e, y: t },
    { x: e, y: n },
    { x: l, y: n }
  ];
}
function _i(a2, t) {
  const { x: e, y: n } = a2;
  let l = false;
  for (let s = 0, r = t.length - 1; s < t.length; r = s++) {
    const i = t[s].x, u = t[s].y, d = t[r].x, p = t[r].y;
    u > n != p > n && e < (d - i) * (n - u) / (p - u) + i && (l = !l);
  }
  return l;
}
function xi(a2) {
  const t = a2.slice();
  return t.sort((e, n) => e.x < n.x ? -1 : e.x > n.x ? 1 : e.y < n.y ? -1 : e.y > n.y ? 1 : 0), Si(t);
}
function Si(a2) {
  if (a2.length <= 1)
    return a2.slice();
  const t = [];
  for (let n = 0; n < a2.length; n++) {
    const l = a2[n];
    for (; t.length >= 2; ) {
      const s = t[t.length - 1], r = t[t.length - 2];
      if ((s.x - r.x) * (l.y - r.y) >= (s.y - r.y) * (l.x - r.x))
        t.pop();
      else break;
    }
    t.push(l);
  }
  t.pop();
  const e = [];
  for (let n = a2.length - 1; n >= 0; n--) {
    const l = a2[n];
    for (; e.length >= 2; ) {
      const s = e[e.length - 1], r = e[e.length - 2];
      if ((s.x - r.x) * (l.y - r.y) >= (s.y - r.y) * (l.x - r.x))
        e.pop();
      else break;
    }
    e.push(l);
  }
  return e.pop(), t.length === 1 && e.length === 1 && t[0].x === e[0].x && t[0].y === e[0].y ? t : t.concat(e);
}
let Bi = 0;
function me(a2, t = "radix") {
  const { useId: e } = ja({ useId: void 0 });
  return e && typeof e == "function" ? `${t}-${e()}` : `${t}-${++Bi}`;
}
function Il(a2) {
  const t = ref(), e = computed(() => {
    var l;
    return ((l = t.value) == null ? void 0 : l.width) ?? 0;
  }), n = computed(() => {
    var l;
    return ((l = t.value) == null ? void 0 : l.height) ?? 0;
  });
  return onMounted(() => {
    const l = Be(a2);
    if (l) {
      t.value = { width: l.offsetWidth, height: l.offsetHeight };
      const s = new ResizeObserver((r) => {
        if (!Array.isArray(r) || !r.length)
          return;
        const i = r[0];
        let u, d;
        if ("borderBoxSize" in i) {
          const p = i.borderBoxSize, c = Array.isArray(p) ? p[0] : p;
          u = c.inlineSize, d = c.blockSize;
        } else
          u = l.offsetWidth, d = l.offsetHeight;
        t.value = { width: u, height: d };
      });
      return s.observe(l, { box: "border-box" }), () => s.unobserve(l);
    } else
      t.value = void 0;
  }), {
    width: e,
    height: n
  };
}
function Tl(a2, t) {
  const e = ref(a2);
  function n(s) {
    return t[e.value][s] ?? e.value;
  }
  return {
    state: e,
    dispatch: (s) => {
      e.value = n(s);
    }
  };
}
const qn = defineComponent({
  name: "PrimitiveSlot",
  inheritAttrs: false,
  setup(a2, { attrs: t, slots: e }) {
    return () => {
      var u, d;
      if (!e.default)
        return null;
      const n = Wa(e.default()), l = n.findIndex((p) => p.type !== Comment);
      if (l === -1)
        return n;
      const s = n[l];
      (u = s.props) == null || delete u.ref;
      const r = s.props ? mergeProps(t, s.props) : t;
      t.class && ((d = s.props) != null && d.class) && delete s.props.class;
      const i = cloneVNode(s, r);
      for (const p in r)
        p.startsWith("on") && (i.props || (i.props = {}), i.props[p] = r[p]);
      return n.length === 1 ? i : (n[l] = i, n);
    };
  }
}), A = defineComponent({
  name: "Primitive",
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false
    },
    as: {
      type: [String, Object],
      default: "div"
    }
  },
  setup(a2, { attrs: t, slots: e }) {
    const n = a2.asChild ? "template" : a2.as;
    return typeof n == "string" && ["area", "img", "input"].includes(n) ? () => h(n, t) : n !== "template" ? () => h(a2.as, t, { default: e.default }) : () => h(qn, t, { default: e.default });
  }
});
function Re() {
  const a2 = ref(), t = computed(() => {
    var e, n;
    return ["#text", "#comment"].includes((e = a2.value) == null ? void 0 : e.$el.nodeName) ? (n = a2.value) == null ? void 0 : n.$el.nextElementSibling : Be(a2);
  });
  return {
    primitiveElement: a2,
    currentElement: t
  };
}
function Oi(a2, t) {
  const e = ref({}), n = ref("none"), l = a2.value ? "mounted" : "unmounted", { state: s, dispatch: r } = Tl(l, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  }), i = (v) => {
    var g;
    if (Je) {
      const m = new CustomEvent(v, { bubbles: false, cancelable: false });
      (g = t.value) == null || g.dispatchEvent(m);
    }
  };
  watch(
    a2,
    async (v, g) => {
      var S;
      const m = g !== v;
      if (await nextTick(), m) {
        const x = n.value, D = Da(t.value);
        v ? (r("MOUNT"), i("enter"), D === "none" && i("after-enter")) : D === "none" || ((S = e.value) == null ? void 0 : S.display) === "none" ? (r("UNMOUNT"), i("leave"), i("after-leave")) : g && x !== D ? (r("ANIMATION_OUT"), i("leave")) : (r("UNMOUNT"), i("after-leave"));
      }
    },
    { immediate: true }
  );
  const u = (v) => {
    const g = Da(t.value), m = g.includes(
      v.animationName
    ), S = s.value === "mounted" ? "enter" : "leave";
    v.target === t.value && m && (i(`after-${S}`), r("ANIMATION_END")), v.target === t.value && g === "none" && r("ANIMATION_END");
  }, d = (v) => {
    v.target === t.value && (n.value = Da(t.value));
  }, p = watch(
    t,
    (v, g) => {
      v ? (e.value = getComputedStyle(v), v.addEventListener("animationstart", d), v.addEventListener("animationcancel", u), v.addEventListener("animationend", u)) : (r("ANIMATION_END"), g == null || g.removeEventListener("animationstart", d), g == null || g.removeEventListener("animationcancel", u), g == null || g.removeEventListener("animationend", u));
    },
    { immediate: true }
  ), c = watch(s, () => {
    const v = Da(t.value);
    n.value = s.value === "mounted" ? v : "none";
  });
  return onUnmounted(() => {
    p(), c();
  }), {
    isPresent: computed(
      () => ["mounted", "unmountSuspended"].includes(s.value)
    )
  };
}
function Da(a2) {
  return a2 && getComputedStyle(a2).animationName || "none";
}
const Pe = defineComponent({
  name: "Presence",
  props: {
    present: {
      type: Boolean,
      required: true
    },
    forceMount: {
      type: Boolean
    }
  },
  slots: {},
  setup(a2, { slots: t, expose: e }) {
    var d;
    const { present: n, forceMount: l } = toRefs(a2), s = ref(), { isPresent: r } = Oi(n, s);
    e({ present: r });
    let i = t.default({ present: r });
    i = Wa(i || []);
    const u = getCurrentInstance();
    if (i && (i == null ? void 0 : i.length) > 1) {
      const p = (d = u == null ? void 0 : u.parent) != null && d.type.name ? `<${u.parent.type.name} />` : "component";
      throw new Error(
        [
          `Detected an invalid children for \`${p}\` for  \`Presence\` component.`,
          "",
          "Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
          "You can apply a few solutions:",
          [
            "Provide a single child element so that `presence` directive attach correctly.",
            "Ensure the first child is an actual element instead of a raw text node or comment node."
          ].map((c) => `  - ${c}`).join(`
`)
        ].join(`
`)
      );
    }
    return () => l.value || n.value || r.value ? h(t.default({ present: r })[0], {
      ref: (p) => {
        const c = Be(p);
        return typeof (c == null ? void 0 : c.hasAttribute) > "u" || (c != null && c.hasAttribute("data-radix-popper-content-wrapper") ? s.value = c.firstElementChild : s.value = c), c;
      }
    }) : null;
  }
});
const ht = /* @__PURE__ */ defineComponent({
  __name: "Teleport",
  props: {
    to: { default: "body" },
    disabled: { type: Boolean },
    forceMount: { type: Boolean }
  },
  setup(a2) {
    const t = Ha();
    return (e, n) => unref(t) || e.forceMount ? (openBlock(), createBlock(Teleport, {
      key: 0,
      to: e.to,
      disabled: e.disabled
    }, [
      renderSlot(e.$slots, "default")
    ], 8, ["to", "disabled"])) : createCommentVNode("", true);
  }
}), Hi = "dismissableLayer.pointerDownOutside", Wi = "dismissableLayer.focusOutside";
function kl(a2, t) {
  const e = t.closest(
    "[data-dismissable-layer]"
  ), n = a2.dataset.dismissableLayer === "" ? a2 : a2.querySelector(
    "[data-dismissable-layer]"
  ), l = Array.from(
    a2.ownerDocument.querySelectorAll("[data-dismissable-layer]")
  );
  return !!(e && n === e || l.indexOf(n) < l.indexOf(e));
}
function Ml(a2, t) {
  var s;
  const e = ((s = t == null ? void 0 : t.value) == null ? void 0 : s.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), n = ref(false), l = ref(() => {
  });
  return watchEffect((r) => {
    if (!Je)
      return;
    const i = async (d) => {
      const p = d.target;
      if (t != null && t.value) {
        if (kl(t.value, p)) {
          n.value = false;
          return;
        }
        if (d.target && !n.value) {
          let c = function() {
            zt(
              Hi,
              a2,
              f
            );
          };
          const f = { originalEvent: d };
          d.pointerType === "touch" ? (e.removeEventListener("click", l.value), l.value = c, e.addEventListener("click", l.value, {
            once: true
          })) : c();
        } else
          e.removeEventListener("click", l.value);
        n.value = false;
      }
    }, u = window.setTimeout(() => {
      e.addEventListener("pointerdown", i);
    }, 0);
    r(() => {
      window.clearTimeout(u), e.removeEventListener("pointerdown", i), e.removeEventListener("click", l.value);
    });
  }), {
    onPointerDownCapture: () => n.value = true
  };
}
function Vl(a2, t) {
  var l;
  const e = ((l = t == null ? void 0 : t.value) == null ? void 0 : l.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), n = ref(false);
  return watchEffect((s) => {
    if (!Je)
      return;
    const r = async (i) => {
      t != null && t.value && (await nextTick(), !(!t.value || kl(t.value, i.target)) && i.target && !n.value && zt(
        Wi,
        a2,
        { originalEvent: i }
      ));
    };
    e.addEventListener("focusin", r), s(() => e.removeEventListener("focusin", r));
  }), {
    onFocusCapture: () => n.value = true,
    onBlurCapture: () => n.value = false
  };
}
const We = reactive({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), yt = /* @__PURE__ */ defineComponent({
  __name: "DismissableLayer",
  props: {
    disableOutsidePointerEvents: { type: Boolean, default: false },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss"],
  setup(a2, { emit: t }) {
    const e = a2, n = t, { forwardRef: l, currentElement: s } = R(), r = computed(
      () => {
        var g;
        return ((g = s.value) == null ? void 0 : g.ownerDocument) ?? globalThis.document;
      }
    ), i = computed(() => We.layersRoot), u = computed(() => s.value ? Array.from(i.value).indexOf(s.value) : -1), d = computed(() => We.layersWithOutsidePointerEventsDisabled.size > 0), p = computed(() => {
      const g = Array.from(i.value), [m] = [...We.layersWithOutsidePointerEventsDisabled].slice(-1), S = g.indexOf(m);
      return u.value >= S;
    }), c = Ml(async (g) => {
      const m = [...We.branches].some(
        (S) => S.contains(g.target)
      );
      !p.value || m || (n("pointerDownOutside", g), n("interactOutside", g), await nextTick(), g.defaultPrevented || n("dismiss"));
    }, s), f = Vl((g) => {
      [...We.branches].some(
        (S) => S.contains(g.target)
      ) || (n("focusOutside", g), n("interactOutside", g), g.defaultPrevented || n("dismiss"));
    }, s);
    Hn("Escape", (g) => {
      u.value === i.value.size - 1 && (n("escapeKeyDown", g), g.defaultPrevented || n("dismiss"));
    });
    let v;
    return watchEffect((g) => {
      s.value && (e.disableOutsidePointerEvents && (We.layersWithOutsidePointerEventsDisabled.size === 0 && (v = r.value.body.style.pointerEvents, r.value.body.style.pointerEvents = "none"), We.layersWithOutsidePointerEventsDisabled.add(s.value)), i.value.add(s.value), g(() => {
        e.disableOutsidePointerEvents && We.layersWithOutsidePointerEventsDisabled.size === 1 && (r.value.body.style.pointerEvents = v);
      }));
    }), watchEffect((g) => {
      g(() => {
        s.value && (i.value.delete(s.value), We.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (g, m) => (openBlock(), createBlock(unref(A), {
      ref: unref(l),
      "as-child": g.asChild,
      as: g.as,
      "data-dismissable-layer": "",
      style: normalizeStyle({
        pointerEvents: d.value ? p.value ? "auto" : "none" : void 0
      }),
      onFocusCapture: unref(f).onFocusCapture,
      onBlurCapture: unref(f).onBlurCapture,
      onPointerdownCapture: unref(c).onPointerDownCapture
    }, {
      default: withCtx(() => [
        renderSlot(g.$slots, "default")
      ]),
      _: 3
    }, 8, ["as-child", "as", "style", "onFocusCapture", "onBlurCapture", "onPointerdownCapture"]));
  }
});
Wr(() => ref([]));
const [Wl, Ku] = Q("PopperRoot"), It = /* @__PURE__ */ defineComponent({
  __name: "PopperRoot",
  setup(a2) {
    const t = ref();
    return Ku({
      anchor: t,
      onAnchorChange: (e) => t.value = e
    }), (e, n) => renderSlot(e.$slots, "default");
  }
}), Tt = /* @__PURE__ */ defineComponent({
  __name: "PopperAnchor",
  props: {
    element: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(a2) {
    const t = a2, { forwardRef: e, currentElement: n } = R(), l = Wl();
    return watch(n, () => {
      l.onAnchorChange(t.element ?? n.value);
    }), (s, r) => (openBlock(), createBlock(unref(A), {
      ref: unref(e),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: withCtx(() => [
        renderSlot(s.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
});
function Hu(a2) {
  return a2 !== null;
}
function Wu(a2) {
  return {
    name: "transformOrigin",
    options: a2,
    fn(t) {
      var S, x, D;
      const { placement: e, rects: n, middlewareData: l } = t, r = ((S = l.arrow) == null ? void 0 : S.centerOffset) !== 0, i = r ? 0 : a2.arrowWidth, u = r ? 0 : a2.arrowHeight, [d, p] = Dn(e), c = { start: "0%", center: "50%", end: "100%" }[p], f = (((x = l.arrow) == null ? void 0 : x.x) ?? 0) + i / 2, v = (((D = l.arrow) == null ? void 0 : D.y) ?? 0) + u / 2;
      let g = "", m = "";
      return d === "bottom" ? (g = r ? c : `${f}px`, m = `${-u}px`) : d === "top" ? (g = r ? c : `${f}px`, m = `${n.floating.height + u}px`) : d === "right" ? (g = `${-u}px`, m = r ? c : `${v}px`) : d === "left" && (g = `${n.floating.width + u}px`, m = r ? c : `${v}px`), { data: { x: g, y: m } };
    }
  };
}
function Dn(a2) {
  const [t, e = "center"] = a2.split("-");
  return [t, e];
}
const jl = {
  side: "bottom",
  sideOffset: 0,
  align: "center",
  alignOffset: 0,
  arrowPadding: 0,
  avoidCollisions: true,
  collisionBoundary: () => [],
  collisionPadding: 0,
  sticky: "partial",
  hideWhenDetached: false,
  updatePositionStrategy: "optimized",
  prioritizePosition: false
}, [ju, Uu] = Q("PopperContent"), Pt = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "PopperContent",
  props: /* @__PURE__ */ mergeDefaults({
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  }, {
    ...jl
  }),
  emits: ["placed"],
  setup(a2, { emit: t }) {
    const e = a2, n = t, l = Wl(), { forwardRef: s, currentElement: r } = R(), i = ref(), u = ref(), { width: d, height: p } = Il(u), c = computed(
      () => e.side + (e.align !== "center" ? `-${e.align}` : "")
    ), f = computed(() => typeof e.collisionPadding == "number" ? e.collisionPadding : { top: 0, right: 0, bottom: 0, left: 0, ...e.collisionPadding }), v = computed(() => Array.isArray(e.collisionBoundary) ? e.collisionBoundary : [e.collisionBoundary]), g = computed(() => ({
      padding: f.value,
      boundary: v.value.filter(Hu),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: v.value.length > 0
    })), m = Kr(() => [
      offset({
        mainAxis: e.sideOffset + p.value,
        alignmentAxis: e.alignOffset
      }),
      e.prioritizePosition && e.avoidCollisions && flip({
        ...g.value
      }),
      e.avoidCollisions && shift({
        mainAxis: true,
        crossAxis: !!e.prioritizePosition,
        limiter: e.sticky === "partial" ? limitShift() : void 0,
        ...g.value
      }),
      !e.prioritizePosition && e.avoidCollisions && flip({
        ...g.value
      }),
      size({
        ...g.value,
        apply: ({ elements: O, rects: V, availableWidth: H, availableHeight: Y }) => {
          const { width: J, height: N } = V.reference, F = O.floating.style;
          Object.assign(O.floating.style, {
            maxWidth: `${H}px`,
            maxHeight: `${Y}px`
          }), F.setProperty(
            "--radix-popper-available-width",
            `${H}px`
          ), F.setProperty(
            "--radix-popper-available-height",
            `${Y}px`
          ), F.setProperty(
            "--radix-popper-anchor-width",
            `${J}px`
          ), F.setProperty(
            "--radix-popper-anchor-height",
            `${N}px`
          );
        }
      }),
      u.value && arrow({ element: u.value, padding: e.arrowPadding }),
      Wu({
        arrowWidth: d.value,
        arrowHeight: p.value
      }),
      e.hideWhenDetached && hide({ strategy: "referenceHidden", ...g.value })
    ]), { floatingStyles: S, placement: x, isPositioned: D, middlewareData: h2 } = useFloating(
      l.anchor,
      i,
      {
        strategy: "fixed",
        placement: c,
        whileElementsMounted: (...O) => autoUpdate(...O, {
          animationFrame: e.updatePositionStrategy === "always"
        }),
        middleware: m
      }
    ), E = computed(
      () => Dn(x.value)[0]
    ), P = computed(
      () => Dn(x.value)[1]
    );
    watchEffect(() => {
      D.value && n("placed");
    });
    const $ = computed(
      () => {
        var O;
        return ((O = h2.value.arrow) == null ? void 0 : O.centerOffset) !== 0;
      }
    ), I = ref("");
    watchEffect(() => {
      r.value && (I.value = window.getComputedStyle(r.value).zIndex);
    });
    const k = computed(() => {
      var O;
      return ((O = h2.value.arrow) == null ? void 0 : O.x) ?? 0;
    }), L = computed(() => {
      var O;
      return ((O = h2.value.arrow) == null ? void 0 : O.y) ?? 0;
    });
    return Uu({
      placedSide: E,
      onArrowChange: (O) => u.value = O,
      arrowX: k,
      arrowY: L,
      shouldHideArrow: $
    }), (O, V) => {
      var H, Y, J;
      return openBlock(), createElementBlock("div", {
        ref_key: "floatingRef",
        ref: i,
        "data-radix-popper-content-wrapper": "",
        style: normalizeStyle({
          ...unref(S),
          transform: unref(D) ? unref(S).transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: I.value,
          "--radix-popper-transform-origin": [
            (H = unref(h2).transformOrigin) == null ? void 0 : H.x,
            (Y = unref(h2).transformOrigin) == null ? void 0 : Y.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((J = unref(h2).hide) == null ? void 0 : J.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        })
      }, [
        createVNode(unref(A), mergeProps({ ref: unref(s) }, O.$attrs, {
          "as-child": e.asChild,
          as: O.as,
          "data-side": E.value,
          "data-align": P.value,
          style: {
            // if the PopperContent hasn't been placed yet (not all measurements done)
            // we prevent animations so that users's animation don't kick in too early referring wrong sides
            animation: unref(D) ? void 0 : "none"
          }
        }), {
          default: withCtx(() => [
            renderSlot(O.$slots, "default")
          ]),
          _: 3
        }, 16, ["as-child", "as", "data-side", "data-align", "style"])
      ], 4);
    };
  }
}), Gu = /* @__PURE__ */ createElementVNode("polygon", { points: "0,0 30,0 15,10" }, null, -1), qu = /* @__PURE__ */ defineComponent({
  __name: "Arrow",
  props: {
    width: { default: 10 },
    height: { default: 5 },
    asChild: { type: Boolean },
    as: { default: "svg" }
  },
  setup(a2) {
    const t = a2;
    return R(), (e, n) => (openBlock(), createBlock(unref(A), mergeProps(t, {
      width: e.width,
      height: e.height,
      viewBox: e.asChild ? void 0 : "0 0 30 10",
      preserveAspectRatio: e.asChild ? void 0 : "none"
    }), {
      default: withCtx(() => [
        renderSlot(e.$slots, "default", {}, () => [
          Gu
        ])
      ]),
      _: 3
    }, 16, ["width", "height", "viewBox", "preserveAspectRatio"]));
  }
}), Yu = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, qt = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "PopperArrow",
  props: {
    width: {},
    height: {},
    asChild: { type: Boolean },
    as: { default: "svg" }
  },
  setup(a2) {
    const { forwardRef: t } = R(), e = ju(), n = computed(() => Yu[e.placedSide.value]);
    return (l, s) => {
      var r, i, u, d;
      return openBlock(), createElementBlock("span", {
        ref: (p) => {
          unref(e).onArrowChange(p);
        },
        style: normalizeStyle({
          position: "absolute",
          left: (r = unref(e).arrowX) != null && r.value ? `${(i = unref(e).arrowX) == null ? void 0 : i.value}px` : void 0,
          top: (u = unref(e).arrowY) != null && u.value ? `${(d = unref(e).arrowY) == null ? void 0 : d.value}px` : void 0,
          [n.value]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[unref(e).placedSide.value],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[unref(e).placedSide.value],
          visibility: unref(e).shouldHideArrow.value ? "hidden" : void 0
        })
      }, [
        createVNode(qu, mergeProps(l.$attrs, {
          ref: unref(t),
          style: {
            display: "block"
          },
          as: l.as,
          "as-child": l.asChild,
          width: l.width,
          height: l.height
        }), {
          default: withCtx(() => [
            renderSlot(l.$slots, "default")
          ]),
          _: 3
        }, 16, ["as", "as-child", "width", "height"])
      ], 4);
    };
  }
}), Yt = /* @__PURE__ */ defineComponent({
  __name: "VisuallyHidden",
  props: {
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(a2) {
    return R(), (t, e) => (openBlock(), createBlock(unref(A), {
      as: t.as,
      "as-child": t.asChild,
      style: {
        // See: https://github.com/twbs/bootstrap/blob/master/scss/mixins/_screen-reader.scss
        position: "absolute",
        border: 0,
        width: "1px",
        display: "inline-block",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        wordWrap: "normal"
      }
    }, {
      default: withCtx(() => [
        renderSlot(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Xu = "data-radix-vue-collection-item", [eo, Zu] = Q("CollectionProvider");
function ga(a2 = Xu) {
  const t = ref(/* @__PURE__ */ new Map()), e = ref(), n = Zu({
    collectionRef: e,
    itemMap: t,
    attrName: a2
  }), { getItems: l } = Zt(n), s = computed(() => Array.from(n.itemMap.value.values())), r = computed(() => n.itemMap.value.size);
  return { getItems: l, reactiveItems: s, itemMapSize: r };
}
const ba = defineComponent({
  name: "CollectionSlot",
  setup(a2, { slots: t }) {
    const e = eo(), { primitiveElement: n, currentElement: l } = Re();
    return watch(l, () => {
      e.collectionRef.value = l.value;
    }), () => h(qn, { ref: n }, t);
  }
}), Xt = defineComponent({
  name: "CollectionItem",
  inheritAttrs: false,
  setup(a2, { slots: t, attrs: e }) {
    const n = eo(), { primitiveElement: l, currentElement: s } = Re(), { value: r, ...i } = e;
    return watchEffect((u) => {
      if (s.value) {
        const d = markRaw(s.value);
        n.itemMap.value.set(d, { ref: s.value, value: r }), u(() => n.itemMap.value.delete(d));
      }
    }), () => h(qn, { ...i, [n.attrName]: "", ref: l }, t);
  }
});
function Zt(a2) {
  const t = a2 ?? eo();
  return { getItems: () => {
    const n = t.collectionRef.value;
    if (!n)
      return [];
    const l = Array.from(n.querySelectorAll(`[${t.attrName}]`));
    return Array.from(t.itemMap.value.values()).sort(
      (i, u) => l.indexOf(i.ref) - l.indexOf(u.ref)
    );
  } };
}
const rd = "rovingFocusGroup.onEntryFocus", id = { bubbles: false, cancelable: true }, Xa = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function ud(a2, t) {
  return t !== "rtl" ? a2 : a2 === "ArrowLeft" ? "ArrowRight" : a2 === "ArrowRight" ? "ArrowLeft" : a2;
}
function ql(a2, t, e) {
  const n = ud(a2.key, e);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(n)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(n)))
    return Xa[n];
}
function Yl(a2, t = false) {
  const e = document.activeElement;
  for (const n of a2)
    if (n === e || (n.focus({ preventScroll: t }), document.activeElement !== e))
      return;
}
function dd(a2, t) {
  return a2.map((e, n) => a2[(t + n) % a2.length]);
}
const [cd, pd] = Q("RovingFocusGroup"), At = /* @__PURE__ */ defineComponent({
  __name: "RovingFocusGroup",
  props: {
    orientation: { default: void 0 },
    dir: {},
    loop: { type: Boolean, default: false },
    currentTabStopId: {},
    defaultCurrentTabStopId: {},
    preventScrollOnEntryFocus: { type: Boolean, default: false },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["entryFocus", "update:currentTabStopId"],
  setup(a2, { expose: t, emit: e }) {
    const n = a2, l = e, { loop: s, orientation: r, dir: i } = toRefs(n), u = Ce(i), d = ae(n, "currentTabStopId", l, {
      defaultValue: n.defaultCurrentTabStopId,
      passive: n.currentTabStopId === void 0
    }), p = ref(false), c = ref(false), f = ref(0), { getItems: v } = ga();
    function g(m) {
      const S = !c.value;
      if (m.currentTarget && m.target === m.currentTarget && S && !p.value) {
        const x = new CustomEvent(rd, id);
        if (m.currentTarget.dispatchEvent(x), l("entryFocus", x), !x.defaultPrevented) {
          const D = v().map(($) => $.ref).filter(($) => $.dataset.disabled !== ""), h2 = D.find(($) => $.getAttribute("data-active") === "true"), E = D.find(
            ($) => $.id === d.value
          ), P = [h2, E, ...D].filter(
            Boolean
          );
          Yl(P, n.preventScrollOnEntryFocus);
        }
      }
      c.value = false;
    }
    return t({
      getItems: v
    }), pd({
      loop: s,
      dir: u,
      orientation: r,
      currentTabStopId: d,
      onItemFocus: (m) => {
        d.value = m;
      },
      onItemShiftTab: () => {
        p.value = true;
      },
      onFocusableItemAdd: () => {
        f.value++;
      },
      onFocusableItemRemove: () => {
        f.value--;
      }
    }), (m, S) => (openBlock(), createBlock(unref(ba), null, {
      default: withCtx(() => [
        createVNode(unref(A), {
          tabindex: p.value || f.value === 0 ? -1 : 0,
          "data-orientation": unref(r),
          as: m.as,
          "as-child": m.asChild,
          dir: unref(u),
          style: { outline: "none" },
          onMousedown: S[0] || (S[0] = (x) => c.value = true),
          onFocus: g,
          onBlur: S[1] || (S[1] = (x) => p.value = false)
        }, {
          default: withCtx(() => [
            renderSlot(m.$slots, "default")
          ]),
          _: 3
        }, 8, ["tabindex", "data-orientation", "as", "as-child", "dir"])
      ]),
      _: 3
    }));
  }
}), Ot = /* @__PURE__ */ defineComponent({
  __name: "RovingFocusItem",
  props: {
    tabStopId: {},
    focusable: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    allowShiftKey: { type: Boolean },
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(a2) {
    const t = a2, e = cd(), n = computed(() => t.tabStopId || me()), l = computed(
      () => e.currentTabStopId.value === n.value
    ), { getItems: s } = Zt();
    onMounted(() => {
      t.focusable && e.onFocusableItemAdd();
    }), onUnmounted(() => {
      t.focusable && e.onFocusableItemRemove();
    });
    function r(i) {
      if (i.key === "Tab" && i.shiftKey) {
        e.onItemShiftTab();
        return;
      }
      if (i.target !== i.currentTarget)
        return;
      const u = ql(
        i,
        e.orientation.value,
        e.dir.value
      );
      if (u !== void 0) {
        if (i.metaKey || i.ctrlKey || i.altKey || !t.allowShiftKey && i.shiftKey)
          return;
        i.preventDefault();
        let d = [...s().map((p) => p.ref).filter((p) => p.dataset.disabled !== "")];
        if (u === "last")
          d.reverse();
        else if (u === "prev" || u === "next") {
          u === "prev" && d.reverse();
          const p = d.indexOf(
            i.currentTarget
          );
          d = e.loop.value ? dd(d, p + 1) : d.slice(p + 1);
        }
        nextTick(() => Yl(d));
      }
    }
    return (i, u) => (openBlock(), createBlock(unref(Xt), null, {
      default: withCtx(() => [
        createVNode(unref(A), {
          tabindex: l.value ? 0 : -1,
          "data-orientation": unref(e).orientation.value,
          "data-active": i.active,
          "data-disabled": i.focusable ? void 0 : "",
          as: i.as,
          "as-child": i.asChild,
          onMousedown: u[0] || (u[0] = (d) => {
            i.focusable ? unref(e).onItemFocus(n.value) : d.preventDefault();
          }),
          onFocus: u[1] || (u[1] = (d) => unref(e).onItemFocus(n.value)),
          onKeydown: r
        }, {
          default: withCtx(() => [
            renderSlot(i.$slots, "default")
          ]),
          _: 3
        }, 8, ["tabindex", "data-orientation", "data-active", "data-disabled", "as", "as-child"])
      ]),
      _: 3
    }));
  }
});
const [zc, Kc] = Q("RadioGroupRoot"), hy = /* @__PURE__ */ defineComponent({
  __name: "RadioGroupRoot",
  props: {
    modelValue: {},
    defaultValue: {},
    disabled: { type: Boolean, default: false },
    name: {},
    required: { type: Boolean, default: false },
    orientation: { default: void 0 },
    dir: {},
    loop: { type: Boolean, default: true },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(a2, { emit: t }) {
    const e = a2, n = t, { forwardRef: l } = R(), s = ae(e, "modelValue", n, {
      defaultValue: e.defaultValue,
      passive: e.modelValue === void 0
    }), { disabled: r, loop: i, orientation: u, name: d, required: p, dir: c } = toRefs(e), f = Ce(c);
    return Kc({
      modelValue: s,
      changeModelValue: (v) => {
        s.value = v;
      },
      disabled: r,
      loop: i,
      orientation: u,
      name: d == null ? void 0 : d.value,
      required: p
    }), (v, g) => (openBlock(), createBlock(unref(At), {
      "as-child": "",
      orientation: unref(u),
      dir: unref(f),
      loop: unref(i)
    }, {
      default: withCtx(() => [
        createVNode(unref(A), {
          ref: unref(l),
          role: "radiogroup",
          "data-disabled": unref(r) ? "" : void 0,
          "as-child": v.asChild,
          as: v.as,
          required: unref(p),
          "aria-orientation": unref(u),
          "aria-required": unref(p),
          dir: unref(f),
          name: unref(d)
        }, {
          default: withCtx(() => [
            renderSlot(v.$slots, "default", { modelValue: unref(s) })
          ]),
          _: 3
        }, 8, ["data-disabled", "as-child", "as", "required", "aria-orientation", "aria-required", "dir", "name"])
      ]),
      _: 3
    }, 8, ["orientation", "dir", "loop"]));
  }
}), Hc = ["value", "checked", "name", "disabled", "required"], Wc = /* @__PURE__ */ defineComponent({
  __name: "Radio",
  props: {
    id: {},
    value: {},
    disabled: { type: Boolean, default: false },
    required: { type: Boolean },
    checked: { type: Boolean, default: void 0 },
    name: {},
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  emits: ["update:checked"],
  setup(a2, { emit: t }) {
    const e = a2, l = ae(e, "checked", t, {
      passive: e.checked === void 0
    }), { value: s } = toRefs(e), { forwardRef: r, currentElement: i } = R(), u = Qe(i), d = computed(() => {
      var c;
      return e.id && i.value ? ((c = document.querySelector(`[for="${e.id}"]`)) == null ? void 0 : c.innerText) ?? e.value : void 0;
    });
    function p(c) {
      l.value = true, u.value && c.stopPropagation();
    }
    return (c, f) => (openBlock(), createBlock(unref(A), mergeProps(c.$attrs, {
      id: c.id,
      ref: unref(r),
      role: "radio",
      type: c.as === "button" ? "button" : void 0,
      as: c.as,
      "aria-checked": unref(l),
      "aria-label": d.value,
      "as-child": c.asChild,
      disabled: c.disabled ? "" : void 0,
      "data-state": unref(l) ? "checked" : "unchecked",
      "data-disabled": c.disabled ? "" : void 0,
      value: unref(s),
      required: c.required,
      name: c.name,
      onClick: withModifiers(p, ["stop"])
    }), {
      default: withCtx(() => [
        renderSlot(c.$slots, "default", { checked: unref(l) }),
        unref(u) ? (openBlock(), createElementBlock("input", {
          key: 0,
          type: "radio",
          tabindex: "-1",
          "aria-hidden": "",
          value: unref(s),
          checked: !!unref(l),
          name: c.name,
          disabled: c.disabled,
          required: c.required,
          style: {
            transform: "translateX(-100%)",
            position: "absolute",
            pointerEvents: "none",
            opacity: 0,
            margin: 0
          }
        }, null, 8, Hc)) : createCommentVNode("", true)
      ]),
      _: 3
    }, 16, ["id", "type", "as", "aria-checked", "aria-label", "as-child", "disabled", "data-state", "data-disabled", "value", "required", "name"]));
  }
}), [jc, Uc] = Q("RadioGroupItem"), yy = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "RadioGroupItem",
  props: {
    id: {},
    value: {},
    disabled: { type: Boolean, default: false },
    required: { type: Boolean },
    name: {},
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(a2) {
    const t = a2, { forwardRef: e, currentElement: n } = R(), l = zc(), s = computed(() => l.disabled.value || t.disabled), r = computed(() => l.required.value || t.required), i = computed(() => {
      var c;
      return ((c = l.modelValue) == null ? void 0 : c.value) === t.value;
    });
    Uc({ disabled: s, checked: i });
    const u = ref(false), d = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    je("keydown", (c) => {
      d.includes(c.key) && (u.value = true);
    }), je("keyup", () => {
      u.value = false;
    });
    function p() {
      setTimeout(() => {
        var c;
        u.value && ((c = n.value) == null || c.click());
      }, 0);
    }
    return (c, f) => (openBlock(), createBlock(unref(Ot), {
      checked: i.value,
      disabled: s.value,
      "as-child": "",
      focusable: !s.value,
      active: i.value
    }, {
      default: withCtx(() => [
        createVNode(Wc, mergeProps({ ...c.$attrs, ...t }, {
          ref: unref(e),
          checked: i.value,
          required: r.value,
          disabled: s.value,
          "onUpdate:checked": f[0] || (f[0] = (v) => unref(l).changeModelValue(c.value)),
          onKeydown: f[1] || (f[1] = withKeys(withModifiers(() => {
          }, ["prevent"]), ["enter"])),
          onFocus: p
        }), {
          default: withCtx(() => [
            renderSlot(c.$slots, "default")
          ]),
          _: 3
        }, 16, ["checked", "required", "disabled"])
      ]),
      _: 3
    }, 8, ["checked", "disabled", "focusable", "active"]));
  }
});
function Vp(a2 = [], t, e) {
  const n = [...a2];
  return n[e] = t, n.sort((l, s) => l - s);
}
function Ds(a2, t, e) {
  const s = 100 / (e - t) * (a2 - t);
  return Kt(s, 0, 100);
}
function Fp(a2, t) {
  return t > 2 ? `Value ${a2 + 1} of ${t}` : t === 2 ? ["Minimum", "Maximum"][a2] : void 0;
}
function Lp(a2, t) {
  if (a2.length === 1)
    return 0;
  const e = a2.map((l) => Math.abs(l - t)), n = Math.min(...e);
  return e.indexOf(n);
}
function Np(a2, t, e) {
  const n = a2 / 2, s = Do([0, 50], [0, n]);
  return (n - s(t) * e) * e;
}
function zp(a2) {
  return a2.slice(0, -1).map((t, e) => a2[e + 1] - t);
}
function Kp(a2, t) {
  if (t > 0) {
    const e = zp(a2);
    return Math.min(...e) >= t;
  }
  return true;
}
function Do(a2, t) {
  return (e) => {
    if (a2[0] === a2[1] || t[0] === t[1])
      return t[0];
    const n = (t[1] - t[0]) / (a2[1] - a2[0]);
    return t[0] + n * (e - a2[0]);
  };
}
function Hp(a2) {
  return (String(a2).split(".")[1] || "").length;
}
function Wp(a2, t) {
  const e = 10 ** t;
  return Math.round(a2 * e) / e;
}
const $s = ["PageUp", "PageDown"], Bs = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], Is = {
  "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
  "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"]
}, [Ts, Rs] = Q(["SliderVertical", "SliderHorizontal"]), As = /* @__PURE__ */ defineComponent({
  __name: "SliderImpl",
  props: {
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  emits: ["slideStart", "slideMove", "slideEnd", "homeKeyDown", "endKeyDown", "stepKeyDown"],
  setup(a2, { emit: t }) {
    const e = a2, n = t, l = on();
    return (s, r) => (openBlock(), createBlock(unref(A), mergeProps({ "data-slider-impl": "" }, e, {
      onKeydown: r[0] || (r[0] = (i) => {
        i.key === "Home" ? (n("homeKeyDown", i), i.preventDefault()) : i.key === "End" ? (n("endKeyDown", i), i.preventDefault()) : unref($s).concat(unref(Bs)).includes(i.key) && (n("stepKeyDown", i), i.preventDefault());
      }),
      onPointerdown: r[1] || (r[1] = (i) => {
        const u = i.target;
        u.setPointerCapture(i.pointerId), i.preventDefault(), unref(l).thumbElements.value.includes(u) ? u.focus() : n("slideStart", i);
      }),
      onPointermove: r[2] || (r[2] = (i) => {
        i.target.hasPointerCapture(i.pointerId) && n("slideMove", i);
      }),
      onPointerup: r[3] || (r[3] = (i) => {
        const u = i.target;
        u.hasPointerCapture(i.pointerId) && (u.releasePointerCapture(i.pointerId), n("slideEnd", i));
      })
    }), {
      default: withCtx(() => [
        renderSlot(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), jp = /* @__PURE__ */ defineComponent({
  __name: "SliderHorizontal",
  props: {
    dir: {},
    min: {},
    max: {},
    inverted: { type: Boolean }
  },
  emits: ["slideEnd", "slideStart", "slideMove", "homeKeyDown", "endKeyDown", "stepKeyDown"],
  setup(a2, { emit: t }) {
    const e = a2, n = t, { max: l, min: s, dir: r, inverted: i } = toRefs(e), { forwardRef: u, currentElement: d } = R(), p = ref(), c = computed(() => (r == null ? void 0 : r.value) === "ltr" && !i.value || (r == null ? void 0 : r.value) !== "ltr" && i.value);
    function f(v) {
      const g = p.value || d.value.getBoundingClientRect(), m = [0, g.width], S = c.value ? [s.value, l.value] : [l.value, s.value], x = Do(m, S);
      return p.value = g, x(v - g.left);
    }
    return Rs({
      startEdge: c.value ? "left" : "right",
      endEdge: c.value ? "right" : "left",
      direction: c.value ? 1 : -1,
      size: "width"
    }), (v, g) => (openBlock(), createBlock(As, {
      ref: unref(u),
      dir: unref(r),
      "data-orientation": "horizontal",
      style: {
        "--radix-slider-thumb-transform": "translateX(-50%)"
      },
      onSlideStart: g[0] || (g[0] = (m) => {
        const S = f(m.clientX);
        n("slideStart", S);
      }),
      onSlideMove: g[1] || (g[1] = (m) => {
        const S = f(m.clientX);
        n("slideMove", S);
      }),
      onSlideEnd: g[2] || (g[2] = () => {
        p.value = void 0, n("slideEnd");
      }),
      onStepKeyDown: g[3] || (g[3] = (m) => {
        const S = c.value ? "from-left" : "from-right", x = unref(Is)[S].includes(m.key);
        n("stepKeyDown", m, x ? -1 : 1);
      }),
      onEndKeyDown: g[4] || (g[4] = (m) => n("endKeyDown", m)),
      onHomeKeyDown: g[5] || (g[5] = (m) => n("homeKeyDown", m))
    }, {
      default: withCtx(() => [
        renderSlot(v.$slots, "default")
      ]),
      _: 3
    }, 8, ["dir"]));
  }
}), Up = /* @__PURE__ */ defineComponent({
  __name: "SliderVertical",
  props: {
    min: {},
    max: {},
    inverted: { type: Boolean }
  },
  emits: ["slideEnd", "slideStart", "slideMove", "homeKeyDown", "endKeyDown", "stepKeyDown"],
  setup(a2, { emit: t }) {
    const e = a2, n = t, { max: l, min: s, inverted: r } = toRefs(e), { forwardRef: i, currentElement: u } = R(), d = ref(), p = computed(() => !r.value);
    function c(f) {
      const v = d.value || u.value.getBoundingClientRect(), g = [0, v.height], m = p.value ? [l.value, s.value] : [s.value, l.value], S = Do(g, m);
      return d.value = v, S(f - v.top);
    }
    return Rs({
      startEdge: p.value ? "bottom" : "top",
      endEdge: p.value ? "top" : "bottom",
      size: "height",
      direction: p.value ? 1 : -1
    }), (f, v) => (openBlock(), createBlock(As, {
      ref: unref(i),
      "data-orientation": "vertical",
      style: {
        "--radix-slider-thumb-transform": "translateY(50%)"
      },
      onSlideStart: v[0] || (v[0] = (g) => {
        const m = c(g.clientY);
        n("slideStart", m);
      }),
      onSlideMove: v[1] || (v[1] = (g) => {
        const m = c(g.clientY);
        n("slideMove", m);
      }),
      onSlideEnd: v[2] || (v[2] = () => {
        d.value = void 0, n("slideEnd");
      }),
      onStepKeyDown: v[3] || (v[3] = (g) => {
        const m = p.value ? "from-bottom" : "from-top", S = unref(Is)[m].includes(g.key);
        n("stepKeyDown", g, S ? -1 : 1);
      }),
      onEndKeyDown: v[4] || (v[4] = (g) => n("endKeyDown", g)),
      onHomeKeyDown: v[5] || (v[5] = (g) => n("homeKeyDown", g))
    }, {
      default: withCtx(() => [
        renderSlot(f.$slots, "default")
      ]),
      _: 3
    }, 512));
  }
}), Gp = ["value", "name", "disabled", "step"], [on, qp] = Q("SliderRoot"), Ny = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "SliderRoot",
  props: {
    name: {},
    defaultValue: { default: () => [0] },
    modelValue: {},
    disabled: { type: Boolean, default: false },
    orientation: { default: "horizontal" },
    dir: {},
    inverted: { type: Boolean, default: false },
    min: { default: 0 },
    max: { default: 100 },
    step: { default: 1 },
    minStepsBetweenThumbs: { default: 0 },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue", "valueCommit"],
  setup(a2, { emit: t }) {
    const e = a2, n = t, { min: l, max: s, step: r, minStepsBetweenThumbs: i, orientation: u, disabled: d, dir: p } = toRefs(e), c = Ce(p), { forwardRef: f, currentElement: v } = R(), g = Qe(v);
    ga();
    const m = ae(e, "modelValue", n, {
      defaultValue: e.defaultValue,
      passive: e.modelValue === void 0
    }), S = ref(0), x = ref(m.value);
    function D(I) {
      const k = Lp(m.value, I);
      P(I, k);
    }
    function h2(I) {
      P(I, S.value);
    }
    function E() {
      const I = x.value[S.value];
      m.value[S.value] !== I && n("valueCommit", toRaw(m.value));
    }
    function P(I, k, { commit: L } = { commit: false }) {
      var J;
      const O = Hp(r.value), V = Wp(Math.round((I - l.value) / r.value) * r.value + l.value, O), H = Kt(V, l.value, s.value), Y = Vp(m.value, H, k);
      if (Kp(Y, i.value * r.value)) {
        S.value = Y.indexOf(H);
        const N = String(Y) !== String(m.value);
        N && L && n("valueCommit", Y), N && ((J = $.value[S.value]) == null || J.focus(), m.value = Y);
      }
    }
    const $ = ref([]);
    return qp({
      modelValue: m,
      valueIndexToChangeRef: S,
      thumbElements: $,
      orientation: u,
      min: l,
      max: s,
      disabled: d
    }), (I, k) => (openBlock(), createElementBlock(Fragment, null, [
      createVNode(unref(ba), null, {
        default: withCtx(() => [
          (openBlock(), createBlock(resolveDynamicComponent(unref(u) === "horizontal" ? jp : Up), mergeProps(I.$attrs, {
            ref: unref(f),
            "as-child": I.asChild,
            as: I.as,
            min: unref(l),
            max: unref(s),
            dir: unref(c),
            inverted: I.inverted,
            "aria-disabled": unref(d),
            "data-disabled": unref(d) ? "" : void 0,
            onPointerdown: k[0] || (k[0] = () => {
              unref(d) || (x.value = unref(m));
            }),
            onSlideStart: k[1] || (k[1] = (L) => !unref(d) && D(L)),
            onSlideMove: k[2] || (k[2] = (L) => !unref(d) && h2(L)),
            onSlideEnd: k[3] || (k[3] = (L) => !unref(d) && E()),
            onHomeKeyDown: k[4] || (k[4] = (L) => !unref(d) && P(unref(l), 0, { commit: true })),
            onEndKeyDown: k[5] || (k[5] = (L) => !unref(d) && P(unref(s), unref(m).length - 1, { commit: true })),
            onStepKeyDown: k[6] || (k[6] = (L, O) => {
              if (!unref(d)) {
                const Y = unref($s).includes(L.key) || L.shiftKey && unref(Bs).includes(L.key) ? 10 : 1, J = S.value, N = unref(m)[J], F = unref(r) * Y * O;
                P(N + F, J, { commit: true });
              }
            })
          }), {
            default: withCtx(() => [
              renderSlot(I.$slots, "default", { modelValue: unref(m) })
            ]),
            _: 3
          }, 16, ["as-child", "as", "min", "max", "dir", "inverted", "aria-disabled", "data-disabled"]))
        ]),
        _: 3
      }),
      unref(g) ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(unref(m), (L, O) => (openBlock(), createElementBlock("input", {
        key: O,
        value: L,
        type: "number",
        style: { display: "none" },
        name: I.name ? I.name + (unref(m).length > 1 ? "[]" : "") : void 0,
        disabled: unref(d),
        step: unref(r)
      }, null, 8, Gp))), 128)) : createCommentVNode("", true)
    ], 64));
  }
}), Yp = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "SliderThumbImpl",
  props: {
    index: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(a2) {
    const t = a2, e = on(), n = Ts(), { forwardRef: l, currentElement: s } = R(), r = computed(() => {
      var v, g;
      return (g = (v = e.modelValue) == null ? void 0 : v.value) == null ? void 0 : g[t.index];
    }), i = computed(() => r.value === void 0 ? 0 : Ds(r.value, e.min.value ?? 0, e.max.value ?? 100)), u = computed(() => {
      var v, g;
      return Fp(t.index, ((g = (v = e.modelValue) == null ? void 0 : v.value) == null ? void 0 : g.length) ?? 0);
    }), d = Il(s), p = computed(() => d[n.size].value), c = computed(() => p.value ? Np(p.value, i.value, n.direction) : 0), f = Ha();
    return onMounted(() => {
      e.thumbElements.value.push(s.value);
    }), onUnmounted(() => {
      const v = e.thumbElements.value.findIndex((g) => g === s.value) ?? -1;
      e.thumbElements.value.splice(v, 1);
    }), (v, g) => (openBlock(), createBlock(unref(Xt), null, {
      default: withCtx(() => [
        createVNode(unref(A), mergeProps(v.$attrs, {
          ref: unref(l),
          role: "slider",
          "data-radix-vue-collection-item": "",
          tabindex: unref(e).disabled.value ? void 0 : 0,
          "aria-label": v.$attrs["aria-label"] || u.value,
          "data-disabled": unref(e).disabled.value ? "" : void 0,
          "data-orientation": unref(e).orientation.value,
          "aria-valuenow": r.value,
          "aria-valuemin": unref(e).min.value,
          "aria-valuemax": unref(e).max.value,
          "aria-orientation": unref(e).orientation.value,
          "as-child": v.asChild,
          as: v.as,
          style: {
            transform: "var(--radix-slider-thumb-transform)",
            position: "absolute",
            [unref(n).startEdge]: `calc(${i.value}% + ${c.value}px)`,
            /**
             * There will be no value on initial render while we work out the index so we hide thumbs
             * without a value, otherwise SSR will render them in the wrong position before they
             * snap into the correct position during hydration which would be visually jarring for
             * slower connections.
             */
            display: !unref(f) && r.value === void 0 ? "none" : void 0
          },
          onFocus: g[0] || (g[0] = () => {
            unref(e).valueIndexToChangeRef.value = v.index;
          })
        }), {
          default: withCtx(() => [
            renderSlot(v.$slots, "default")
          ]),
          _: 3
        }, 16, ["tabindex", "aria-label", "data-disabled", "data-orientation", "aria-valuenow", "aria-valuemin", "aria-valuemax", "aria-orientation", "as-child", "as", "style"])
      ]),
      _: 3
    }));
  }
}), zy = /* @__PURE__ */ defineComponent({
  __name: "SliderThumb",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(a2) {
    const t = a2, { getItems: e } = Zt(), { forwardRef: n, currentElement: l } = R(), s = computed(() => l.value ? e().findIndex((r) => r.ref === l.value) : -1);
    return (r, i) => (openBlock(), createBlock(Yp, mergeProps({ ref: unref(n) }, t, { index: s.value }), {
      default: withCtx(() => [
        renderSlot(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["index"]));
  }
}), Ky = /* @__PURE__ */ defineComponent({
  __name: "SliderTrack",
  props: {
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(a2) {
    const t = on();
    return R(), (e, n) => (openBlock(), createBlock(unref(A), {
      "as-child": e.asChild,
      as: e.as,
      "data-disabled": unref(t).disabled.value ? "" : void 0,
      "data-orientation": unref(t).orientation.value
    }, {
      default: withCtx(() => [
        renderSlot(e.$slots, "default")
      ]),
      _: 3
    }, 8, ["as-child", "as", "data-disabled", "data-orientation"]));
  }
}), Hy = /* @__PURE__ */ defineComponent({
  __name: "SliderRange",
  props: {
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(a2) {
    const t = on(), e = Ts();
    R();
    const n = computed(() => {
      var r, i;
      return (i = (r = t.modelValue) == null ? void 0 : r.value) == null ? void 0 : i.map(
        (u) => Ds(u, t.min.value, t.max.value)
      );
    }), l = computed(() => t.modelValue.value.length > 1 ? Math.min(...n.value) : 0), s = computed(() => 100 - Math.max(...n.value));
    return (r, i) => (openBlock(), createBlock(unref(A), {
      "data-disabled": unref(t).disabled.value ? "" : void 0,
      "data-orientation": unref(t).orientation.value,
      "as-child": r.asChild,
      as: r.as,
      style: normalizeStyle({
        [unref(e).startEdge]: `${l.value}%`,
        [unref(e).endEdge]: `${s.value}%`
      })
    }, {
      default: withCtx(() => [
        renderSlot(r.$slots, "default")
      ]),
      _: 3
    }, 8, ["data-disabled", "data-orientation", "as-child", "as", "style"]));
  }
});
function of() {
  if (typeof matchMedia == "function")
    return matchMedia("(pointer:coarse)").matches ? "coarse" : "fine";
}
of() === "coarse";
const zf = /* @__PURE__ */ defineComponent({
  __name: "Toggle",
  props: {
    defaultValue: { type: Boolean },
    pressed: { type: Boolean, default: void 0 },
    disabled: { type: Boolean, default: false },
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  emits: ["update:pressed"],
  setup(a2, { emit: t }) {
    const e = a2, n = t;
    R();
    const l = ae(e, "pressed", n, {
      defaultValue: e.defaultValue,
      passive: e.pressed === void 0
    });
    function s() {
      l.value = !l.value;
    }
    const r = computed(() => l.value ? "on" : "off");
    return (i, u) => (openBlock(), createBlock(unref(A), {
      type: i.as === "button" ? "button" : void 0,
      "as-child": e.asChild,
      as: i.as,
      "aria-pressed": unref(l),
      "data-state": r.value,
      "data-disabled": i.disabled ? "" : void 0,
      disabled: i.disabled,
      onClick: s
    }, {
      default: withCtx(() => [
        renderSlot(i.$slots, "default", { pressed: unref(l) })
      ]),
      _: 3
    }, 8, ["type", "as-child", "as", "aria-pressed", "data-state", "data-disabled", "disabled"]));
  }
}), [ar, Uf] = Q("ToolbarRoot"), bg = /* @__PURE__ */ defineComponent({
  __name: "ToolbarRoot",
  props: {
    orientation: { default: "horizontal" },
    dir: {},
    loop: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  setup(a2) {
    const t = a2, { orientation: e, dir: n } = toRefs(t), l = Ce(n), { forwardRef: s } = R();
    return Uf({ orientation: e, dir: l }), (r, i) => (openBlock(), createBlock(unref(At), {
      "as-child": "",
      orientation: unref(e),
      dir: unref(l),
      loop: r.loop
    }, {
      default: withCtx(() => [
        createVNode(unref(A), {
          ref: unref(s),
          role: "toolbar",
          "aria-orientation": unref(e),
          "as-child": r.asChild,
          as: r.as
        }, {
          default: withCtx(() => [
            renderSlot(r.$slots, "default")
          ]),
          _: 3
        }, 8, ["aria-orientation", "as-child", "as"])
      ]),
      _: 3
    }, 8, ["orientation", "dir", "loop"]));
  }
}), Gf = /* @__PURE__ */ defineComponent({
  __name: "ToolbarButton",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(a2) {
    const t = a2, { forwardRef: e } = R();
    return (n, l) => (openBlock(), createBlock(unref(Ot), {
      "as-child": "",
      focusable: !n.disabled
    }, {
      default: withCtx(() => [
        createVNode(unref(A), mergeProps({
          ref: unref(e),
          type: n.as === "button" ? "button" : void 0
        }, t), {
          default: withCtx(() => [
            renderSlot(n.$slots, "default")
          ]),
          _: 3
        }, 16, ["type"])
      ]),
      _: 3
    }, 8, ["focusable"]));
  }
}), nr = "tooltip.open", [Ro, qf] = Q("TooltipProvider"), Sg = /* @__PURE__ */ defineComponent({
  __name: "TooltipProvider",
  props: {
    delayDuration: { default: 700 },
    skipDelayDuration: { default: 300 },
    disableHoverableContent: { type: Boolean, default: false },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean, default: false }
  },
  setup(a2) {
    const t = a2, { delayDuration: e, skipDelayDuration: n, disableHoverableContent: l, disableClosingTrigger: s, ignoreNonKeyboardFocus: r, disabled: i } = toRefs(t);
    R();
    const u = ref(true), d = ref(false), { start: p, stop: c } = Kn(() => {
      u.value = true;
    }, n, { immediate: false });
    return qf({
      isOpenDelayed: u,
      delayDuration: e,
      onOpen() {
        c(), u.value = false;
      },
      onClose() {
        p();
      },
      isPointerInTransitRef: d,
      disableHoverableContent: l,
      disableClosingTrigger: s,
      disabled: i,
      ignoreNonKeyboardFocus: r
    }), (f, v) => renderSlot(f.$slots, "default");
  }
}), [fn, Yf] = Q("TooltipRoot"), Eg = /* @__PURE__ */ defineComponent({
  __name: "TooltipRoot",
  props: {
    defaultOpen: { type: Boolean, default: false },
    open: { type: Boolean, default: void 0 },
    delayDuration: { default: void 0 },
    disableHoverableContent: { type: Boolean, default: void 0 },
    disableClosingTrigger: { type: Boolean, default: void 0 },
    disabled: { type: Boolean, default: void 0 },
    ignoreNonKeyboardFocus: { type: Boolean, default: void 0 }
  },
  emits: ["update:open"],
  setup(a2, { emit: t }) {
    const e = a2, n = t;
    R();
    const l = Ro(), s = computed(() => e.disableHoverableContent ?? l.disableHoverableContent.value), r = computed(() => e.disableClosingTrigger ?? l.disableClosingTrigger.value), i = computed(() => e.disabled ?? l.disabled.value), u = computed(() => e.delayDuration ?? l.delayDuration.value), d = computed(() => e.ignoreNonKeyboardFocus ?? l.ignoreNonKeyboardFocus.value), p = ae(e, "open", n, {
      defaultValue: e.defaultOpen,
      passive: e.open === void 0
    });
    watch(p, (h2) => {
      l.onClose && (h2 ? (l.onOpen(), document.dispatchEvent(new CustomEvent(nr))) : l.onClose());
    });
    const c = ref(false), f = ref(), v = computed(() => p.value ? c.value ? "delayed-open" : "instant-open" : "closed"), { start: g, stop: m } = Kn(() => {
      c.value = true, p.value = true;
    }, u, { immediate: false });
    function S() {
      m(), c.value = false, p.value = true;
    }
    function x() {
      m(), p.value = false;
    }
    function D() {
      g();
    }
    return Yf({
      contentId: "",
      open: p,
      stateAttribute: v,
      trigger: f,
      onTriggerChange(h2) {
        f.value = h2;
      },
      onTriggerEnter() {
        l.isOpenDelayed.value ? D() : S();
      },
      onTriggerLeave() {
        s.value ? x() : m();
      },
      onOpen: S,
      onClose: x,
      disableHoverableContent: s,
      disableClosingTrigger: r,
      disabled: i,
      ignoreNonKeyboardFocus: d
    }), (h2, E) => (openBlock(), createBlock(unref(It), null, {
      default: withCtx(() => [
        renderSlot(h2.$slots, "default", { open: unref(p) })
      ]),
      _: 3
    }));
  }
}), Pg = /* @__PURE__ */ defineComponent({
  __name: "TooltipTrigger",
  props: {
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(a2) {
    const t = a2, e = fn(), n = Ro();
    e.contentId || (e.contentId = me(void 0, "radix-vue-tooltip-content"));
    const { forwardRef: l, currentElement: s } = R(), r = ref(false), i = ref(false), u = computed(() => e.disabled.value ? {} : {
      click: m,
      focus: v,
      pointermove: c,
      pointerleave: f,
      pointerdown: p,
      blur: g
    });
    onMounted(() => {
      e.onTriggerChange(s.value);
    });
    function d() {
      r.value = false;
    }
    function p() {
      r.value = true, document.addEventListener("pointerup", d, { once: true });
    }
    function c(S) {
      S.pointerType !== "touch" && !i.value && !n.isPointerInTransitRef.value && (e.onTriggerEnter(), i.value = true);
    }
    function f() {
      e.onTriggerLeave(), i.value = false;
    }
    function v(S) {
      var x, D;
      r.value || e.ignoreNonKeyboardFocus.value && !((D = (x = S.target).matches) != null && D.call(x, ":focus-visible")) || e.onOpen();
    }
    function g() {
      e.onClose();
    }
    function m() {
      e.disableClosingTrigger.value || e.onClose();
    }
    return (S, x) => (openBlock(), createBlock(unref(Tt), { "as-child": "" }, {
      default: withCtx(() => [
        createVNode(unref(A), mergeProps({
          ref: unref(l),
          "aria-describedby": unref(e).open.value ? unref(e).contentId : void 0,
          "data-state": unref(e).stateAttribute.value,
          as: S.as,
          "as-child": t.asChild,
          "data-grace-area-trigger": ""
        }, toHandlers(u.value)), {
          default: withCtx(() => [
            renderSlot(S.$slots, "default")
          ]),
          _: 3
        }, 16, ["aria-describedby", "data-state", "as", "as-child"])
      ]),
      _: 3
    }));
  }
}), or = /* @__PURE__ */ defineComponent({
  __name: "TooltipContentImpl",
  props: {
    ariaLabel: {},
    asChild: { type: Boolean },
    as: {},
    side: { default: "top" },
    sideOffset: { default: 0 },
    align: { default: "center" },
    alignOffset: {},
    avoidCollisions: { type: Boolean, default: true },
    collisionBoundary: { default: () => [] },
    collisionPadding: { default: 0 },
    arrowPadding: { default: 0 },
    sticky: { default: "partial" },
    hideWhenDetached: { type: Boolean, default: false }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(a2, { emit: t }) {
    const e = a2, n = t, l = fn(), { forwardRef: s } = R(), r = useSlots(), i = computed(() => {
      var p;
      return (p = r.default) == null ? void 0 : p.call(r);
    }), u = computed(() => {
      var f;
      if (e.ariaLabel)
        return e.ariaLabel;
      let p = "";
      function c(v) {
        typeof v.children == "string" ? p += v.children : Array.isArray(v.children) && v.children.forEach((g) => c(g));
      }
      return (f = i.value) == null || f.forEach((v) => c(v)), p;
    }), d = computed(() => {
      const { ariaLabel: p, ...c } = e;
      return c;
    });
    return onMounted(() => {
      je(window, "scroll", (p) => {
        const c = p.target;
        c != null && c.contains(l.trigger.value) && l.onClose();
      }), je(window, nr, l.onClose);
    }), (p, c) => (openBlock(), createBlock(unref(yt), {
      "as-child": "",
      "disable-outside-pointer-events": false,
      onEscapeKeyDown: c[0] || (c[0] = (f) => n("escapeKeyDown", f)),
      onPointerDownOutside: c[1] || (c[1] = (f) => {
        var v;
        unref(l).disableClosingTrigger.value && ((v = unref(l).trigger.value) != null && v.contains(f.target)) && f.preventDefault(), n("pointerDownOutside", f);
      }),
      onFocusOutside: c[2] || (c[2] = withModifiers(() => {
      }, ["prevent"])),
      onDismiss: c[3] || (c[3] = (f) => unref(l).onClose())
    }, {
      default: withCtx(() => [
        createVNode(unref(Pt), mergeProps({
          ref: unref(s),
          "data-state": unref(l).stateAttribute.value
        }, { ...p.$attrs, ...d.value }, { style: {
          "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
          "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
          "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
        } }), {
          default: withCtx(() => [
            renderSlot(p.$slots, "default"),
            createVNode(unref(Yt), {
              id: unref(l).contentId,
              role: "tooltip"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(u.value), 1)
              ]),
              _: 1
            }, 8, ["id"])
          ]),
          _: 3
        }, 16, ["data-state"])
      ]),
      _: 3
    }));
  }
}), Xf = /* @__PURE__ */ defineComponent({
  __name: "TooltipContentHoverable",
  props: {
    ariaLabel: {},
    asChild: { type: Boolean },
    as: {},
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean }
  },
  setup(a2) {
    const e = Bt(a2), { forwardRef: n, currentElement: l } = R(), { trigger: s, onClose: r } = fn(), i = Ro(), { isPointerInTransit: u, onPointerExit: d } = $l(s, l);
    return i.isPointerInTransitRef = u, d(() => {
      r();
    }), (p, c) => (openBlock(), createBlock(or, mergeProps({ ref: unref(n) }, unref(e)), {
      default: withCtx(() => [
        renderSlot(p.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Dg = /* @__PURE__ */ defineComponent({
  __name: "TooltipContent",
  props: {
    forceMount: { type: Boolean },
    ariaLabel: {},
    asChild: { type: Boolean },
    as: {},
    side: { default: "top" },
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(a2, { emit: t }) {
    const e = a2, n = t, l = fn(), s = xe(e, n), { forwardRef: r } = R();
    return (i, u) => (openBlock(), createBlock(unref(Pe), {
      present: i.forceMount || unref(l).open.value
    }, {
      default: withCtx(() => [
        (openBlock(), createBlock(resolveDynamicComponent(unref(l).disableHoverableContent.value ? or : Xf), mergeProps({ ref: unref(r) }, unref(s)), {
          default: withCtx(() => [
            renderSlot(i.$slots, "default")
          ]),
          _: 3
        }, 16))
      ]),
      _: 3
    }, 8, ["present"]));
  }
}), $g = /* @__PURE__ */ defineComponent({
  __name: "TooltipArrow",
  props: {
    width: { default: 10 },
    height: { default: 5 },
    asChild: { type: Boolean },
    as: { default: "svg" }
  },
  setup(a2) {
    const t = a2;
    return R(), (e, n) => (openBlock(), createBlock(unref(qt), normalizeProps(guardReactiveProps(t)), {
      default: withCtx(() => [
        renderSlot(e.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Bg = /* @__PURE__ */ defineComponent({
  __name: "TooltipPortal",
  props: {
    to: {},
    disabled: { type: Boolean },
    forceMount: { type: Boolean }
  },
  setup(a2) {
    const t = a2;
    return (e, n) => (openBlock(), createBlock(unref(ht), normalizeProps(guardReactiveProps(t)), {
      default: withCtx(() => [
        renderSlot(e.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
function tryOnScopeDispose(fn2) {
  if (getCurrentScope()) {
    onScopeDispose(fn2);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const isDef = (val) => typeof val !== "undefined";
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {
};
function createFilterWrapper(filter, fn2) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn2.apply(this, args), { fn: fn2, thisArg: this, args })).then(resolve).catch(reject);
    });
  }
  return wrapper;
}
const bypassFilter = (invoke2) => {
  return invoke2();
};
function pausableFilter(extendFilter = bypassFilter) {
  const isActive = ref(true);
  function pause() {
    isActive.value = false;
  }
  function resume() {
    isActive.value = true;
  }
  const eventFilter = (...args) => {
    if (isActive.value)
      extendFilter(...args);
  };
  return { isActive: readonly(isActive), pause, resume, eventFilter };
}
function increaseWithUnit(target, delta) {
  var _a;
  if (typeof target === "number")
    return target + delta;
  const value = ((_a = target.match(/^-?\d+\.?\d*/)) == null ? void 0 : _a[0]) || "";
  const unit = target.slice(value.length);
  const result = Number.parseFloat(value) + delta;
  if (Number.isNaN(result))
    return target;
  return result + unit;
}
function objectEntries(obj) {
  return Object.entries(obj);
}
function getLifeCycleTarget(target) {
  return getCurrentInstance();
}
function toRef(...args) {
  if (args.length !== 1)
    return toRef$1(...args);
  const r = args[0];
  return typeof r === "function" ? readonly(customRef(() => ({ get: r, set: noop }))) : ref(r);
}
function watchWithFilter(source, cb, options = {}) {
  const {
    eventFilter = bypassFilter,
    ...watchOptions
  } = options;
  return watch(
    source,
    createFilterWrapper(
      eventFilter,
      cb
    ),
    watchOptions
  );
}
function watchPausable(source, cb, options = {}) {
  const {
    eventFilter: filter,
    ...watchOptions
  } = options;
  const { eventFilter, pause, resume, isActive } = pausableFilter(filter);
  const stop = watchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter
    }
  );
  return { stop, pause, resume, isActive };
}
function tryOnMounted(fn2, sync = true, target) {
  const instance = getLifeCycleTarget();
  if (instance)
    onMounted(fn2, target);
  else if (sync)
    fn2();
  else
    nextTick(fn2);
}
function useToggle(initialValue = false, options = {}) {
  const {
    truthyValue = true,
    falsyValue = false
  } = options;
  const valueIsRef = isRef(initialValue);
  const _value = ref(initialValue);
  function toggle(value) {
    if (arguments.length) {
      _value.value = value;
      return _value.value;
    } else {
      const truthy = toValue(truthyValue);
      _value.value = _value.value === truthy ? toValue(falsyValue) : truthy;
      return _value.value;
    }
  }
  if (valueIsRef)
    return toggle;
  else
    return [_value, toggle];
}
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
const defaultWindow = isClient ? window : void 0;
function useEventListener(...args) {
  let target;
  let events2;
  let listeners;
  let options;
  if (typeof args[0] === "string" || Array.isArray(args[0])) {
    [events2, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events2, listeners, options] = args;
  }
  if (!target)
    return noop;
  if (!Array.isArray(events2))
    events2 = [events2];
  if (!Array.isArray(listeners))
    listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn2) => fn2());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options2) => {
    el.addEventListener(event, listener, options2);
    return () => el.removeEventListener(event, listener, options2);
  };
  const stopWatch = watch(
    () => [unrefElement(target), toValue(options)],
    ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      const optionsClone = isObject(options2) ? { ...options2 } : options2;
      cleanups.push(
        ...events2.flatMap((event) => {
          return listeners.map((listener) => register(el, event, listener, optionsClone));
        })
      );
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
function useMounted() {
  const isMounted = ref(false);
  const instance = getCurrentInstance();
  if (instance) {
    onMounted(() => {
      isMounted.value = true;
    }, instance);
  }
  return isMounted;
}
function useSupported(callback) {
  const isMounted = useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function useMediaQuery(query, options = {}) {
  const { window: window2 = defaultWindow } = options;
  const isSupported = useSupported(() => window2 && "matchMedia" in window2 && typeof window2.matchMedia === "function");
  let mediaQuery;
  const matches = ref(false);
  const handler = (event) => {
    matches.value = event.matches;
  };
  const cleanup = () => {
    if (!mediaQuery)
      return;
    if ("removeEventListener" in mediaQuery)
      mediaQuery.removeEventListener("change", handler);
    else
      mediaQuery.removeListener(handler);
  };
  const stopWatch = watchEffect(() => {
    if (!isSupported.value)
      return;
    cleanup();
    mediaQuery = window2.matchMedia(toValue(query));
    if ("addEventListener" in mediaQuery)
      mediaQuery.addEventListener("change", handler);
    else
      mediaQuery.addListener(handler);
    matches.value = mediaQuery.matches;
  });
  tryOnScopeDispose(() => {
    stopWatch();
    cleanup();
    mediaQuery = void 0;
  });
  return matches;
}
function useBreakpoints(breakpoints, options = {}) {
  function getValue2(k, delta) {
    let v = toValue(breakpoints[toValue(k)]);
    if (delta != null)
      v = increaseWithUnit(v, delta);
    if (typeof v === "number")
      v = `${v}px`;
    return v;
  }
  const { window: window2 = defaultWindow, strategy = "min-width" } = options;
  function match(query) {
    if (!window2)
      return false;
    return window2.matchMedia(query).matches;
  }
  const greaterOrEqual = (k) => {
    return useMediaQuery(() => `(min-width: ${getValue2(k)})`, options);
  };
  const smallerOrEqual = (k) => {
    return useMediaQuery(() => `(max-width: ${getValue2(k)})`, options);
  };
  const shortcutMethods = Object.keys(breakpoints).reduce((shortcuts, k) => {
    Object.defineProperty(shortcuts, k, {
      get: () => strategy === "min-width" ? greaterOrEqual(k) : smallerOrEqual(k),
      enumerable: true,
      configurable: true
    });
    return shortcuts;
  }, {});
  function current() {
    const points = Object.keys(breakpoints).map((i) => [i, greaterOrEqual(i)]);
    return computed(() => points.filter(([, v]) => v.value).map(([k]) => k));
  }
  return Object.assign(shortcutMethods, {
    greaterOrEqual,
    smallerOrEqual,
    greater(k) {
      return useMediaQuery(() => `(min-width: ${getValue2(k, 0.1)})`, options);
    },
    smaller(k) {
      return useMediaQuery(() => `(max-width: ${getValue2(k, -0.1)})`, options);
    },
    between(a, b) {
      return useMediaQuery(() => `(min-width: ${getValue2(a)}) and (max-width: ${getValue2(b, -0.1)})`, options);
    },
    isGreater(k) {
      return match(`(min-width: ${getValue2(k, 0.1)})`);
    },
    isGreaterOrEqual(k) {
      return match(`(min-width: ${getValue2(k)})`);
    },
    isSmaller(k) {
      return match(`(max-width: ${getValue2(k, -0.1)})`);
    },
    isSmallerOrEqual(k) {
      return match(`(max-width: ${getValue2(k)})`);
    },
    isInBetween(a, b) {
      return match(`(min-width: ${getValue2(a)}) and (max-width: ${getValue2(b, -0.1)})`);
    },
    current,
    active() {
      const bps = current();
      return computed(() => bps.value.length === 0 ? "" : bps.value.at(-1));
    }
  });
}
function cloneFnJSON(source) {
  return JSON.parse(JSON.stringify(source));
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
const handlers = /* @__PURE__ */ getHandlers();
function getHandlers() {
  if (!(globalKey in _global))
    _global[globalKey] = _global[globalKey] || {};
  return _global[globalKey];
}
function getSSRHandler(key, fallback) {
  return handlers[key] || fallback;
}
function guessSerializerType(rawInit) {
  return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
}
const StorageSerializers = {
  boolean: {
    read: (v) => v === "true",
    write: (v) => String(v)
  },
  object: {
    read: (v) => JSON.parse(v),
    write: (v) => JSON.stringify(v)
  },
  number: {
    read: (v) => Number.parseFloat(v),
    write: (v) => String(v)
  },
  any: {
    read: (v) => v,
    write: (v) => String(v)
  },
  string: {
    read: (v) => v,
    write: (v) => String(v)
  },
  map: {
    read: (v) => new Map(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v.entries()))
  },
  set: {
    read: (v) => new Set(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v))
  },
  date: {
    read: (v) => new Date(v),
    write: (v) => v.toISOString()
  }
};
const customStorageEventName = "vueuse-storage";
function useStorage(key, defaults2, storage, options = {}) {
  var _a;
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults: mergeDefaults2 = false,
    shallow,
    window: window2 = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e);
    },
    initOnMounted
  } = options;
  const data = (shallow ? shallowRef : ref)(typeof defaults2 === "function" ? defaults2() : defaults2);
  if (!storage) {
    try {
      storage = getSSRHandler("getDefaultStorage", () => {
        var _a2;
        return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
      })();
    } catch (e) {
      onError(e);
    }
  }
  if (!storage)
    return data;
  const rawInit = toValue(defaults2);
  const type = guessSerializerType(rawInit);
  const serializer = (_a = options.serializer) != null ? _a : StorageSerializers[type];
  const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
    data,
    () => write(data.value),
    { flush, deep, eventFilter }
  );
  if (window2 && listenToStorageChanges) {
    tryOnMounted(() => {
      useEventListener(window2, "storage", update);
      useEventListener(window2, customStorageEventName, updateFromCustomEvent);
      if (initOnMounted)
        update();
    });
  }
  if (!initOnMounted)
    update();
  function dispatchWriteEvent(oldValue, newValue) {
    if (window2) {
      window2.dispatchEvent(new CustomEvent(customStorageEventName, {
        detail: {
          key,
          oldValue,
          newValue,
          storageArea: storage
        }
      }));
    }
  }
  function write(v) {
    try {
      const oldValue = storage.getItem(key);
      if (v == null) {
        dispatchWriteEvent(oldValue, null);
        storage.removeItem(key);
      } else {
        const serialized = serializer.write(v);
        if (oldValue !== serialized) {
          storage.setItem(key, serialized);
          dispatchWriteEvent(oldValue, serialized);
        }
      }
    } catch (e) {
      onError(e);
    }
  }
  function read(event) {
    const rawValue = event ? event.newValue : storage.getItem(key);
    if (rawValue == null) {
      if (writeDefaults && rawInit != null)
        storage.setItem(key, serializer.write(rawInit));
      return rawInit;
    } else if (!event && mergeDefaults2) {
      const value = serializer.read(rawValue);
      if (typeof mergeDefaults2 === "function")
        return mergeDefaults2(value, rawInit);
      else if (type === "object" && !Array.isArray(value))
        return { ...rawInit, ...value };
      return value;
    } else if (typeof rawValue !== "string") {
      return rawValue;
    } else {
      return serializer.read(rawValue);
    }
  }
  function update(event) {
    if (event && event.storageArea !== storage)
      return;
    if (event && event.key == null) {
      data.value = rawInit;
      return;
    }
    if (event && event.key !== key)
      return;
    pauseWatch();
    try {
      if ((event == null ? void 0 : event.newValue) !== serializer.write(data.value))
        data.value = read(event);
    } catch (e) {
      onError(e);
    } finally {
      if (event)
        nextTick(resumeWatch);
      else
        resumeWatch();
    }
  }
  function updateFromCustomEvent(event) {
    update(event.detail);
  }
  return data;
}
function usePreferredDark(options) {
  return useMediaQuery("(prefers-color-scheme: dark)", options);
}
function useColorMode(options = {}) {
  const {
    selector = "html",
    attribute = "class",
    initialValue = "auto",
    window: window2 = defaultWindow,
    storage,
    storageKey = "vueuse-color-scheme",
    listenToStorageChanges = true,
    storageRef,
    emitAuto,
    disableTransition = true
  } = options;
  const modes = {
    auto: "",
    light: "light",
    dark: "dark",
    ...options.modes || {}
  };
  const preferredDark = usePreferredDark({ window: window2 });
  const system = computed(() => preferredDark.value ? "dark" : "light");
  const store = storageRef || (storageKey == null ? toRef(initialValue) : useStorage(storageKey, initialValue, storage, { window: window2, listenToStorageChanges }));
  const state = computed(() => store.value === "auto" ? system.value : store.value);
  const updateHTMLAttrs = getSSRHandler(
    "updateHTMLAttrs",
    (selector2, attribute2, value) => {
      const el = typeof selector2 === "string" ? window2 == null ? void 0 : window2.document.querySelector(selector2) : unrefElement(selector2);
      if (!el)
        return;
      let style;
      if (disableTransition) {
        style = window2.document.createElement("style");
        const styleString = "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}";
        style.appendChild(document.createTextNode(styleString));
        window2.document.head.appendChild(style);
      }
      if (attribute2 === "class") {
        const current = value.split(/\s/g);
        Object.values(modes).flatMap((i) => (i || "").split(/\s/g)).filter(Boolean).forEach((v) => {
          if (current.includes(v))
            el.classList.add(v);
          else
            el.classList.remove(v);
        });
      } else {
        el.setAttribute(attribute2, value);
      }
      if (disableTransition) {
        window2.getComputedStyle(style).opacity;
        document.head.removeChild(style);
      }
    }
  );
  function defaultOnChanged(mode) {
    var _a;
    updateHTMLAttrs(selector, attribute, (_a = modes[mode]) != null ? _a : mode);
  }
  function onChanged(mode) {
    if (options.onChanged)
      options.onChanged(mode, defaultOnChanged);
    else
      defaultOnChanged(mode);
  }
  watch(state, onChanged, { flush: "post", immediate: true });
  tryOnMounted(() => onChanged(state.value));
  const auto = computed({
    get() {
      return emitAuto ? store.value : state.value;
    },
    set(v) {
      store.value = v;
    }
  });
  try {
    return Object.assign(auto, { store, system, state });
  } catch (e) {
    return auto;
  }
}
function useDark(options = {}) {
  const {
    valueDark = "dark",
    valueLight = "",
    window: window2 = defaultWindow
  } = options;
  const mode = useColorMode({
    ...options,
    onChanged: (mode2, defaultHandler) => {
      var _a;
      if (options.onChanged)
        (_a = options.onChanged) == null ? void 0 : _a.call(options, mode2 === "dark", defaultHandler, mode2);
      else
        defaultHandler(mode2);
    },
    modes: {
      dark: valueDark,
      light: valueLight
    }
  });
  const system = computed(() => {
    if (mode.system) {
      return mode.system.value;
    } else {
      const preferredDark = usePreferredDark({ window: window2 });
      return preferredDark.value ? "dark" : "light";
    }
  });
  const isDark = computed({
    get() {
      return mode.value === "dark";
    },
    set(v) {
      const modeVal = v ? "dark" : "light";
      if (system.value === modeVal)
        mode.value = "auto";
      else
        mode.value = modeVal;
    }
  });
  return isDark;
}
function useVModel(props, key, emit, options = {}) {
  var _a, _b, _c;
  const {
    clone = false,
    passive = false,
    eventName,
    deep = false,
    defaultValue,
    shouldEmit
  } = options;
  const vm = getCurrentInstance();
  const _emit = emit || (vm == null ? void 0 : vm.emit) || ((_a = vm == null ? void 0 : vm.$emit) == null ? void 0 : _a.bind(vm)) || ((_c = (_b = vm == null ? void 0 : vm.proxy) == null ? void 0 : _b.$emit) == null ? void 0 : _c.bind(vm == null ? void 0 : vm.proxy));
  let event = eventName;
  event = event || `update:${key.toString()}`;
  const cloneFn = (val) => !clone ? val : typeof clone === "function" ? clone(val) : cloneFnJSON(val);
  const getValue2 = () => isDef(props[key]) ? cloneFn(props[key]) : defaultValue;
  const triggerEmit = (value) => {
    if (shouldEmit) {
      if (shouldEmit(value))
        _emit(event, value);
    } else {
      _emit(event, value);
    }
  };
  if (passive) {
    const initialValue = getValue2();
    const proxy = ref(initialValue);
    let isUpdating = false;
    watch(
      () => props[key],
      (v) => {
        if (!isUpdating) {
          isUpdating = true;
          proxy.value = cloneFn(v);
          nextTick(() => isUpdating = false);
        }
      }
    );
    watch(
      proxy,
      (v) => {
        if (!isUpdating && (v !== props[key] || deep))
          triggerEmit(v);
      },
      { deep }
    );
    return proxy;
  } else {
    return computed({
      get() {
        return getValue2();
      },
      set(value) {
        triggerEmit(value);
      }
    });
  }
}
function useWindowSize(options = {}) {
  const {
    window: window2 = defaultWindow,
    initialWidth = Number.POSITIVE_INFINITY,
    initialHeight = Number.POSITIVE_INFINITY,
    listenOrientation = true,
    includeScrollbar = true
  } = options;
  const width = ref(initialWidth);
  const height = ref(initialHeight);
  const update = () => {
    if (window2) {
      if (includeScrollbar) {
        width.value = window2.innerWidth;
        height.value = window2.innerHeight;
      } else {
        width.value = window2.document.documentElement.clientWidth;
        height.value = window2.document.documentElement.clientHeight;
      }
    }
  };
  update();
  tryOnMounted(update);
  useEventListener("resize", update, { passive: true });
  if (listenOrientation) {
    const matches = useMediaQuery("(orientation: portrait)");
    watch(matches, () => update());
  }
  return { width, height };
}
export {
  $g as $,
  Bg as B,
  Dg as D,
  Eg as E,
  Gf as G,
  Hy as H,
  Ky as K,
  Ny as N,
  Pg as P,
  Sg as S,
  useDark as a,
  useToggle as b,
  useVModel as c,
  zy as d,
  useWindowSize as e,
  useEventListener as f,
  tryOnScopeDispose as g,
  hy as h,
  bg as i,
  objectEntries as o,
  tryOnMounted as t,
  useBreakpoints as u,
  yy as y,
  zf as z
};
