/**
 * Create by Chelly
 * 2020/8/7
 */
import DrawCanvas from './src/DrawCanvas.vue';

/* istanbul ignore next */
DrawCanvas.install = function(Vue) {
    Vue.component(DrawCanvas.name, DrawCanvas);
};

export default DrawCanvas;