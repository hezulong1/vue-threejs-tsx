import { defineComponent, onMounted, ref, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useWindowSize } from '@vueuse/core';
import { isDark } from '../composables';

const BG_LIGHT = 0xf6eedc;
const BG_DARK = 0x44596c;

export default defineComponent({
  name: 'Model',
  setup(props, ctx) {
    const containerRef = ref<HTMLElement>();
    const { width, height } = useWindowSize();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark.value ? BG_DARK : BG_LIGHT);

    const camera = new THREE.PerspectiveCamera(45, width.value / height.value, 0.1, 150);
    camera.position.set(1.5, 4, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width.value, height.value, true);

    const render = () => {
      renderer.render(scene, camera);
    };

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.target.set(0, 2, 0);
    controls.update();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/gltf/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.setPath('/AVIFTest/');
    gltfLoader.load('forest_house.glb', function (gltf) {
      scene.add(gltf.scene);
      render();
    });

    watch(isDark, dark => {
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
      containerRef,
    };
  },
  render() {
    return (
      <div class="GridView Model">
        <div class="info">
          <span>
            Forest House by{' '}
            <a href="https://sketchfab.com/peachyroyalty" target="_blank" rel="noopener">
              peachyroyalty
            </a>
          </span>
        </div>
        <div ref="containerRef" class="Dashboard"></div>
      </div>
    );
  },
});
