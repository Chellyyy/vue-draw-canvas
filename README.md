# vue-draw-canvas

## Installation  
```
npm install vue-draw-canvas
```
## Quick Start
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

### Demo setup
```
npm install
```

### Compiles and hot-reloads for development demo
```
npm run serve
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

* Point 

|对应类型|示例|说明|
|:---:|:---:|:---:|
|zone|`[{x: 140,y: 192}, {x: 264, y: 188}, {x: 334, y: 255}]`|输入x,y坐标点组成的数组,会自动闭合|
|line|`[[{x: 170, y: 504}, {x: 606, y: 464}],[{x: 152, y: 432}, {x: 618, y: 400}]]`|输入两组坐标组成的数组|
|rect|`[{x: 123, y: 314, w: 64, h: 57}]`|输入x,y,w,h组成的对象数组|
|direct|`[{x: 500, y: 200}]`|输入x,y坐标,定义方向起始坐标点|
|circle|`[{x: 170, y: 450, radius: 30}, {x: 600, y: 430}]`|x,y表示圆心坐标,可以定义单个圆的半径|
|arrow|`[{x: 250, y: 160}, {x: 150, y: 80}]`|需要显示箭头的线的坐标,箭头默认指向第一个点|

* Events

|方法名|说明|回调参数|
|:---:|:---:|:---:|
|getImage|获得原始图片的blob对象|-|
|getCanvas|获得当前Canvas的blob对象|-|

* Methods

|方法名|说明|参数|返回值|
|:---:|:---:|:---:|:---:|
|getImage|获得原始图片的blob对象|-|blob|
|getCanvas|获得当前Canvas的blob对象|-|blob|