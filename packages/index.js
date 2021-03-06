/**
 * Create by Chelly
 * 2020/8/7
 */

// 导入单个组件
import DrawCanvas from './DrawCanvas/index.js'

// 以数组的结构保存组件，便于遍历
const components = [
    DrawCanvas
]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue) {
    // 判断是否安装
    if (install.installed) return
    install.installed = true
    // 遍历并注册全局组件
    components.map(component => Vue.component(component.name, component))
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
    install,
    // 组件列表
    ...components
}