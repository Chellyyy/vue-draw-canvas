<template>
  <div @mousemove="handleMousemove"
       @mouseleave="handleCLeave"
       @click="handleCClick"
       @mousedown="handleCMouseDown"
       style="position: absolute;z-index: 3000" v-bind:style="{ width: width +'px', height: height + 'px' }" :id="id">
    <template v-for="(item,index) of narrowP">
      <template v-if="type==='zone'">
        <div v-bind:style="{ top: (item.y-5) +'px', left: (item.x-5) + 'px' }"
             :id="id+index"
             :key="index" class="common-box"
             :class="type+'-'+id +' '+type+'-'+id+'-'+index" @click="handlePClick"
             @mousedown="handlePMouseDown"></div>
      </template>
      <template v-if="type==='rect'">
        <div v-bind:style="{ top: (item.y-5) +'px', left: (item.x-5) + 'px' }"
             :id="id+(2*index)"
             :key="(2*index)" class="common-box"
             :class="type+'-'+id +' '+type+'-'+id+'-'+index" @click="handlePClick"
             @mousedown="handlePMouseDown"></div>
        <div v-bind:style="{ top: (item.y+item.h-5) +'px', left: (item.x+item.w-5) + 'px' }"
             :id="id+(2*index+1)"
             :key="(2*index+1)" class="common-box"
             :class="type+'-'+id +' '+type+'-'+id+'-'+index" @click="handlePClick"
             @mousedown="handlePMouseDown"></div>
      </template>
      <template v-if="type==='line'">
        <template v-for="(i,iI) of item">
          <div v-bind:style="{ top: (i.y-5) +'px', left: (i.x-5) + 'px' }"
               :id="id+(index*2+iI)"
               :key="(index*2+iI)" class="common-box"
               :class="type+'-'+id +' '+type+'-'+id+'-'+index" @click="handlePClick"
               @mousedown="handlePMouseDown"></div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "CPoint",
  data: function () {
    return {
      clickFlag: false,
      moveFlag: false,
      current: null,
      currentX: 0,
      currentY: 0,
      tempX: 0,
      tempY: 0,
      myPoint: []
      // tempP:null,
    }
  },
  props: {
    id: String,
    point: Array,
    width: Number,
    height: Number,
    type: String,
    limit: Number,
    multiple: Number,
  },
  computed: {
    // drawPoint:function() {
    //     if(this.type==='rect'){
    //         let p = [];
    //         for(let item of this.point){
    //             p.push({x:item.x,y:item.y})
    //             p.push
    //         }
    //
    //     }
    //     return this.point;
    // }
    narrowP: function () {
      let p = [];
      if (this.type === "line") {
        this.myPoint.map(pItem => {
          let pi = [];
          pItem.map(item => {
            pi.push({
              x: parseFloat((item.x * this.multiple).toFixed(4)),
              y: parseFloat((item.y * this.multiple).toFixed(4))
            })
          });
          p.push(pi);
        });

      } else if (this.type === 'zone') {
        this.myPoint.map(item => {
          p.push({
            x: parseFloat((item.x * this.multiple).toFixed(4)),
            y: parseFloat((item.y * this.multiple).toFixed(4))
          })
        });
      } else if (this.type === 'rect') {
        this.myPoint.map(item => {
          p.push({
            x: parseFloat((item.x * this.multiple).toFixed(4)),
            y: parseFloat((item.y * this.multiple).toFixed(4)),
            w: parseFloat((item.w * this.multiple).toFixed(4)),
            h: parseFloat((item.h * this.multiple).toFixed(4)),
          })
        });
      }
      return p;
    },
    realW: function () {
      return Math.round(this.width * this.realM)
    },
    realH: function () {
      return Math.round(this.height * this.realM)
    },
    realM: function () {
      return (1 / this.multiple).toFixed(4);
    }
  },
  created() {
    this.myPoint = this.point.slice();
  },
  beforeMount() {
    // 设置节流
    this.handleMousemove = this.throttle(this.handleCMouseMove, 100)
  },
  updated() {
  },
  methods: {
    handleCClick() {
      if (this.moveFlag) {
        this.moveFlag = false;
        this.tempX = 0;
        this.tempY = 0;
      }
      if (this.clickFlag) {
        this.clickFlag = false;
        this.current = null;
        this.currentX = 0;
        this.currentY = 0;
      }
    },
    handlePClick() {
      if (this.clickFlag) {
        this.clickFlag = false;
        this.current = null;
        this.currentX = 0;
        this.currentY = 0;
      }
    },
    checkInRect(x, y) {
      let result = false;
      let item = this.narrowP[0];
      if ((x >= item.x && x < (item.x + item.w)) && (y > item.y && y < (item.y + item.h))) {
        result = true;
      }
      return result
    },
    handleCLeave() {
      if (this.clickFlag) {
        console.log("leave");
        this.clickFlag = false;
        this.current = null;
        this.currentX = 0;
        this.currentY = 0;
      }
    },
    handlePMouseDown(e) {
      console.log('down');
      this.clickFlag = true;
      this.current = e.currentTarget.id;
      this.currentX = e.pageX - e.currentTarget.offsetLeft;
      this.currentY = e.pageY - e.currentTarget.offsetTop;
    },
    handleCMouseDown(e) {
      if (!this.clickFlag) {
        let x = e.offsetX;
        let y = e.offsetY;
        if (this.type === 'rect') {
          if (this.point.length) {
            this.tempX = x;
            this.tempY = y;
            if (this.checkInRect(x, y)) {
              this.moveFlag = true;
              return
            }
          }
          x = this.getRealPoint(x, 'x');
          y = this.getRealPoint(y, 'y');
          this.myPoint.splice(0, 1, {x, y, w: 0, h: 0});
          this.clickFlag = true;
          this.currentX = e.pageX - e.offsetX;
          this.currentY = e.pageY - e.offsetY;
        } else if (this.type === 'zone') {
          if (this.pointInPolygon({x, y})) {
            this.moveFlag = true;
            this.tempX = x;
            this.tempY = y;
            return
          }
          if (this.myPoint.length === this.limit) {
            this.$emit('handleLimit', this.id, this.point.length);
            return
          }
          x = this.getRealPoint(x, 'x');
          y = this.getRealPoint(y, 'y');
          this.myPoint.push({x, y})
        } else if (this.type === 'line') {
          x = this.getRealPoint(x, 'x');
          y = this.getRealPoint(y, 'y');
          if (this.myPoint.length * 2 === this.limit && this.myPoint[this.myPoint.length - 1].length === 2) {
            this.$emit('handleLimit', this.id, this.myPoint.length * 2);
            return
          }
          if (this.myPoint.length && this.myPoint[this.myPoint.length - 1] && this.myPoint[this.myPoint.length - 1].length === 1) {
            this.myPoint[this.myPoint.length - 1].push({x, y})
          } else {
            this.myPoint.push([{x, y}])
          }
        }
        this.$emit('update:point', this.myPoint)
      }
    },
    handleCMouseMove(e) {
      console.log('mousemove', new Date().getTime());
      if (this.clickFlag) {
        let x = e.pageX - this.currentX;
        let y = e.pageY - this.currentY;
        if (x >= this.width || y >= this.height) {
          this.clickFlag = false;
          return
        }
        if (this.type === 'rect') {
          let x1 = e.pageX - this.currentX;
          let y1 = e.pageY - this.currentY;
          console.log('rect-bf', x1, y1);
          x1 = this.getRealPoint(x1);
          y1 = this.getRealPoint(y1);
          console.log('rect-af', x1, y1);
          let tempPoint1 = this.point[0];
          tempPoint1.w = Math.abs(tempPoint1.x - x1);
          tempPoint1.h = Math.abs(tempPoint1.y - y1);
          this.myPoint.splice(0, 1, tempPoint1);
          this.$emit('update:point', this.myPoint);
          return
        }
        x = this.getRealPoint(x, 'x');
        y = this.getRealPoint(y, 'y');
        if (this.type === 'line') {
          let tempId = this.current.slice(this.id.length);
          let tempIndex = parseInt(tempId / 2);
          let tempPoint = this.point[tempIndex];
          tempPoint.splice(tempId % 2, 1, {x, y});
          this.myPoint.splice(tempIndex, 1, tempPoint);
        } else if (this.type === 'zone') {
          this.myPoint.splice(this.current.slice(this.id.length), 1, {x, y});
        }
        this.$emit('update:point', this.myPoint)
      }
      if (this.moveFlag) {
        let cX = e.offsetX;
        let cY = e.offsetY;
        let tX = cX - this.tempX;
        let tY = cY - this.tempY;
        console.log('bf', tX, tY);
        tX = this.getRealPoint(tX);
        tY = this.getRealPoint(tY);
        console.log('af', tX, tY);
        if (this.type === 'rect') {
          let tempPoint2 = this.myPoint[0];
          tempPoint2.x = tempPoint2.x + tX;
          tempPoint2.y = tempPoint2.y + tY;
          let w = this.realW;
          let h = this.realH;
          if (tempPoint2.x <= 5 || tempPoint2.x + tempPoint2.w >= w - 5 || tempPoint2.y <= 5 || tempPoint2.y + tempPoint2.h >= h - 5) {
            this.moveFlag = false;
            this.tempX = 0;
            this.tempY = 0;
            return
          }
          this.myPoint.splice(0, 1, tempPoint2);
        } else if (this.type === 'zone') {
          let tempP = this.myPoint;
          for (let i = 0; i < tempP.length; i++) {
            let w = this.realW;
            let h = this.realH;
            let moveX = tempP[i].x + tX;
            let moveY = tempP[i].y + tY;
            console.log(moveX, moveY, tempP[i].x, tempP[i].y, tX, tY);
            if (moveX >= w - 5 || moveX <= 5 ||
              moveY >= h - 5 || moveY <= 5) {
              console.log('over', moveX, moveY, tempP[i].x, tempP[i].y, tX, tY);
              this.moveFlag = false;
              this.tempP = null;
              return
            }
            tempP[i].x = moveX;
            tempP[i].y = moveY;
          }
          this.myPoint = tempP;
          this.myPoint.splice(0, 0);
        }
        this.tempX = cX;
        this.tempY = cY;
        this.$emit('update:point', this.myPoint)
      }
    },
    pointInPolygon(p) {
      p.x = this.getRealPoint(p.x, 'x');
      p.y = this.getRealPoint(p.y, 'y');
      let nCross = 0;
      let ptPolygon = this.point;
      let nCount = ptPolygon.length;
      for (let i = 0; i < nCount; i++) {
        let
          p1 = ptPolygon[i];//当前节点
        let
          p2 = ptPolygon[(i + 1) % nCount];//下一个节点

        // 求解 y=p.y 与 p1p2 的交点

        if (p1.y === p2.y) // p1p2 与 y=p0.y平行
          continue;
        if (p.y < Math.min(p1.y, p2.y)) // 交点在p1p2延长线上
          continue;
        if (p.y >= Math.max(p1.y, p2.y)) // 交点在p1p2延长线上
          continue;

        // 从P发射一条水平射线 求交点的 X 坐标 ------原理: ((p2.y-p1.y)/(p2.x-p1.x))=((y-p1.y)/(x-p1.x))
        //直线k值相等 交点y=p.y
        let
          x = (p.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;

        if (x > p.x)
          nCross++; // 只统计单边交点
      }

      // 单边交点为偶数，点在多边形之外 ---
      return (nCross % 2 == 1);
    },
    getRealPoint(x, type) {
      if (type) {
        x = x < 0 ? 0 : x;
        let max = 0;
        if (type === 'x') {
          max = this.width;
        } else if (type === 'y') {
          max = this.height;
        }
        x = x > max ? max : x;
      }
      return Math.round(x * this.realM)
    },
    debounce(fn, s) {
      let timeout = null;
      return function () {
        let that = this;
        let args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          fn.apply(that, args)
        }, s)
      }
    },
    throttle(fn, s) {
      let timeout = null;
      return function () {
        let that = this;
        let args = arguments;
        if (!timeout) {
          timeout = setTimeout(() => {
            fn.apply(that, args);
            clearTimeout(timeout);
            timeout = null;
          }, s)
        }
      }
    },
    // handleMousemove:e=>{
    //     this.stroll(()=>{this.handleCMouseMove(e)},500)
    // }
  }
}
</script>

<style scoped>
.common-box {
  width: 10px;
  height: 10px;
  background-color: #0000FF;
  position: absolute;
}
</style>