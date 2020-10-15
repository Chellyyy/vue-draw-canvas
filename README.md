# vue-draw-canvas

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Quick Start
```
import Vue from 'vue'
import DrawCanvas from 'vue-draw-canvas'

Vue.use(DrawCanvas)

// or
import { DrawCanvase } from 'vue-draw-canvas'

Vue.component(DrawCanvase.name, DrawCanvase)

//use like
<DrawCanvas :id="id" :config="config" :layer.sync="layer"></DrawCanvas>

```
### Usage
![image](https://github.com/Chellyyy/vue-draw-canvas/blob/master/examples/assets/example.png?raw=true)  

* Component Attributes  

|参数|说明|类型|可选值|默认值|
|:---:|:---:|:---:|:---:|:---:|
|id|每个组件的唯一标志|string|—|""|
|config|组件相关配置|object|—|null|
|layer|图形参数|array|—|—|
|showBgImg|是否显示背景图片|boolean|—|true|

* Config Attributes

|参数|说明|类型|可选值|默认值|
|:---:|:---:|:---:|:---:|:---:|
|src|图片地址|string|—|""|
|magnify|是否局部放大|boolean|—|false|
|multiple|缩小倍数|number|—|1|
|width|当前显示的宽度|number|—|—|
|height|当前显示的高度|number|—|—|


* Layer Attributes

|参数|说明|类型|可选值|默认值|
|:---:|:---:|:---:|:---:|:---:|
|id|图形唯一标志|string|—|""|
|type|类型|string|zone/line/rect/direct/circle/arrow|—|
|radius|半径(仅对圆有效)|number|—|—|
|sharp|箭头角度(仅对箭头有效)|number|—|—|
|size|箭头长度(仅对箭头有效)|number|—|—|
|theta|旋转角度顺时针(仅对箭头有效)|number|—|—|
|limit|限制个数|number|—|—|
|color|线条颜色|string|—|—|
|fill|填充颜色|string|—|—|
|text|显示的名称|string|—|—|
|point|坐标点|object|—|—|
|show|是否绘制图形|boolean|—|—|
|showNumber|是否显示锚点数字|boolean|—|—|
|draw|图形是否可绘制|boolean|—|—|


* Events

|方法名|说明|回调参数|
|:---:|:---:|:---:|
|onLimit|超过限制个数时触发的回调|(图形id,限制个数)|