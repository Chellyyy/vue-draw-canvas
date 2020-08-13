<template>
    <div id="app">
        <div v-bind:style="{ width: containerW +'px', height: containerH + 'px' }">
            <DrawCanvas :id="id" :config="config"></DrawCanvas>
        </div>
    </div>
</template>

<script>
    import testImg from './assets/test.jpg'
    import DrawCanvas from '../packages/DrawCanvas'
    export default {
        name: 'App',
        data: function () {
            return {
                containerW:400,
                containerH:300,
                config: {
                    multiple: 1, //缩小倍数
                    magnify: true, //是否放大
                    width: 400, //当前显示的宽度
                    height: 300, //当前显示的高度
                    src: '', //图片路径
                    layer: [
                        {
                            id: 'zone1',//每种图形的唯一ID，limit事件触发的时候会带过来
                            type: 'zone',//'zone：不规则图形|line：线条|rect：规则矩形框'
                            limit: 8,//锚点个数限制
                            color: 'red', //线的颜色
                            fill: 'rgba(225,0,0,0.5)', //填充的颜色，可为空
                            text: '画一个自闭合不规则区域',//显示的名字
                            point: [{"x":140,"y":192},{"x":264,"y":188},{"x":334,"y":255},{"x":394,"y":192},{"x":534,"y":191},{"x":344,"y":346}], //点的坐标,
                            show: true, //是否绘制图形
                            showNumber: false,//是否显示锚点数字
                            draw: false, //true当前是否可修改
                        },
                        {
                            id: 'line1',
                            type: 'line',
                            limit: 8,
                            color: 'blue',
                            fill: '',
                            text: '画两根线',
                            point: [[{"x":170,"y":504},{"x":606,"y":464}],[{"x":152,"y":432},{"x":618,"y":400}]],
                            show: true,
                            showNumber: true,
                            draw: false,
                        },
                        {
                            id: 'rect1',
                            type: 'rect',
                            limit: 6,
                            color: 'green',
                            fill: 'rgba(0,225,0,0.5)',
                            text: '画一个规则的矩形',
                            point: [{"x":123,"y":314,"w":64,"h":57}],
                            show: true,
                            showNumber: true,
                            draw: false
                        },
                        {
                            id: 'rect2',
                            type: 'rect',
                            limit: 6,
                            color: 'green',
                            fill: 'rgba(0,225,0,0.5)',
                            text: '画一个规则的矩形',
                            point: [{"x":598,"y":264,"w":68,"h":68}],
                            show: true,
                            showNumber: true,
                            draw: true
                        },
                        {
                            id: 'direct1',
                            type: 'direct',
                            limit: 0, // 无意义
                            color: 'green', // 颜色
                            fill: '',
                            text: '西',//箭头上方显示文字
                            point: [{"x": 500, "y": 200}],  //起始坐标
                            show: true,
                            showNumber: false,
                            draw: false
                        }
                    ]
                },
                id: "test",
            }
        },
        components: {
            DrawCanvas
        },
        methods:{
            getImageInfo(src){
                return new Promise((resolve, reject) => {
                    let img = new Image();
                    let res={
                        width:800,
                        height:600
                    };
                    img.src = src;
                    img.onload = function () {
                        res.width= img.width;res.height = img.height;
                        img.onload = null;
                        img.onerror = null;
                        resolve(res);
                    };
                    img.onerror = function () {
                        img.onload = null;
                        img.onerror=null;
                        reject(res);
                    }
                })
            },
        },
        mounted(){
            let that = this;
            this.getImageInfo(testImg).then(res=>{
                let mul = that.containerW / res.width ;
                let height = res.height * mul;
                that.config.height = height;
                that.config.multiple = mul;
                that.config.src = testImg;
            })
        },
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
