<template>
  <div style="position:relative;">
    <img v-if="showBg" src="" ref="bgImg" v-bind:style="{ width: config.width +'px', height: config.height + 'px' }"
         style="z-index: 1000;position:absolute;top: 0;left: 0;">
    <canvas ref="can" v-bind:width="config.width" v-bind:height="config.height"
            style="z-index: 2000;position: absolute;top: 0;left: 0;"></canvas>
    <canvas v-if="magnify" ref="mCan" width="200" height="200" class="magnify-canvas"
            style="z-index: 2001;position: absolute;"></canvas>
    <div class="point" v-bind:style="{ width: config.width +'px', height: config.height + 'px' }">
      <template v-for="item of layer">
        <CPoint v-if="item.draw"
                :multiple="multiple"
                :type="item.type" v-bind:key="item.id" :id="item.id"
                v-on:update:point="updatePoint($event, item.id)"
                v-bind:point="item.point"
                :limit="item.limit"
                :width="config.width" :height="config.height" @handleLimit="handleLimit"></CPoint>
      </template>
    </div>
  </div>
</template>

<script>
const png404 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEsCAYAAADtt+XCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAIcmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA4LTIyVDE1OjIwOjE2KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA4LTA3VDE0OjA1OjQ1KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wOC0wN1QxNDowNTo0NSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowYTliNWM3ZS04ZWMzLTViNDMtOTUzYS1lZWUwZmQ1ODBmOWYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2OTNjOWVmMC1kMjkxLTBiNGMtODlkNC1hZGE2NzZlMWI0Y2IiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5ZjY5ZTU4Zi0xZDI2LTcxNDQtYjFmZi0zMjRlN2VmNjE4Y2UiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjlmNjllNThmLTFkMjYtNzE0NC1iMWZmLTMyNGU3ZWY2MThjZSIgc3RFdnQ6d2hlbj0iMjAxOC0wOC0yMlQxNToyMDoxNiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3OGIzZTg1YS1mMjYzLWExNGEtYjUyZi0zNmU1NmYyNjk2MzciIHN0RXZ0OndoZW49IjIwMTgtMDgtMjJUMTU6MjA6MTYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MGE5YjVjN2UtOGVjMy01YjQzLTk1M2EtZWVlMGZkNTgwZjlmIiBzdEV2dDp3aGVuPSIyMDIwLTA4LTA3VDE0OjA1OjQ1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i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";
const regPicPath = /(data:image\/jpeg;base64,)(.*)/;
import CPoint from './CPoint'

export default {
  name: "DrawCanvas",
  components: {
    CPoint,
  },
  props: {
    id: String,
    config: Object,
    layer: Array,
  },
  data: function () {
    return {
      ctx: null,
      centerX: 0,
      centerY: 0,
      // myLayer: {}
    }
  },
  created() {

  },
  computed: {
    src: function () {
      return this.config.src;
    },
    multiple: function () {
      return (this.config.multiple ? this.config.multiple : 1);

    },
    magnify: function () {
      return (this.config.magnify ? this.config.magnify : false);
    },
    showBg: function () {
      return this.config.showBgImg !== false;
    },
    myLayer: function () {
      return this.layer.slice()
    }
  },
  updated() {
    this.initCanvas();
  },
  mounted() {
    // this.myLayer = this.layer.slice();
    console.log("vue-draw-canvas mounted");
    this.initCanvas();
    if (this.showBg) {
      this.changeImg();
    }

  },
  destroyed() {
    console.log("vue-draw-canvas destroyed");
  },

  methods: {
    dataURLtoBlob(dataUrl) {
      let bstr = atob(dataUrl),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: '*'
      });
    },
    getImage(){

      let c = document.createElement("canvas");
      let ctx = c.getContext("2d");
      const img = this.$refs.bgImg
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      let url = c.toDataURL("image/jpeg");
      let s = url.match(regPicPath);
      s = s[2];
      return this.dataURLtoBlob(s);
    },
    getCanvas() {
      const regPicPath = /(data:image\/jpeg;base64,)(.*)/;
      let c = document.createElement("canvas");
      let ctx = c.getContext("2d");
      const img = this.$refs.bgImg
      c.width = img.width;
      c.height = img.height;
      ctx.drawImage(img, 0, 0, this.config.width, this.config.height);
      ctx.save();
      ctx.drawImage(this.$refs.can,0,0)
      let url = c.toDataURL("image/jpeg");
      let s = url.match(regPicPath);
      s = s[2];
      return this.dataURLtoBlob(s);
    },
    updatePoint(point, id) {
      this.myLayer.map(item => {
        if (item.id === id) {
          item.point = point;
        }
      });
      // console.log(point);
      this.$emit('update:config', this.myLayer);
    },
    draw(ctx, config, handleFn) {
      // let _that = this;
      // let name = config.id;
      let type = config.type;
      let point = config.point;
      let color = config.color;
      let number = config.showNumber;
      let fill = config.fill;
      let text = config.text;
      let sharp = config.sharp;
      let size = config.size;
      let theta = config.theta || 0;

      function thetaPoint(center, point, angle) {
        let b = {};
        if (angle === 0) {
          b.x = point.x;
          b.y = point.y;
        } else {
          b.x = (point.x - center.x) * Math.cos(Math.PI / 180 * angle) - (point.y - center.y) * Math.sin(Math.PI / 180 * angle) + center.x;
          b.y = (point.x - center.x) * Math.sin(Math.PI / 180 * angle) + (point.y - center.y) * Math.cos(Math.PI / 180 * angle) + center.y;
        }
        return b;
      }

      function drawZone(item) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(handleFn(item[0].x, "x"), handleFn(item[0].y, "y"));
        ctx.font = 'bold 15px SimSun';
        ctx.fillStyle = color;
        if (number) {
          ctx.fillText(1, handleFn(item[0].x, "x"), handleFn(item[0].y, "y"));
        }
        if (text) {
          ctx.fillText(text, handleFn(item[0].x, "x") + 10, (handleFn(item[0].y, "y") - 5));
        }

        for (let i = 1; i < item.length; i++) {
          ctx.lineTo(handleFn(item[i].x, "x"), handleFn(item[i].y, "y"));
          ctx.font = 'bold 15px SimSun';
          ctx.fillStyle = color;
          if (number) {
            ctx.fillText((i + 1), handleFn(item[i].x, "x"), handleFn(item[i].y, "y"));
          }
        }
        ctx.closePath();
        if (fill) {
          ctx.fillStyle = fill;
          // ctx.globalAlpha = 0.5;
          ctx.fill();
        }
        ctx.stroke();
      }

      function drawRect(item) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        item = item[0];
        let x = handleFn(item.x, "x"),
          y = handleFn(item.y, "y"),
          w = handleFn(item.w, "w"),
          h = handleFn(item.h, "h");
        ctx.rect(x, y, w, h);
        if (fill) {
          // ctx.globalAlpha = 0.5;
          ctx.fillStyle = fill;
          ctx.fillRect(x, y, w, h);
        }
        ctx.font = 'bold 12px SimSun';
        ctx.fillStyle = color;
        if (number) {
          ctx.fillText(1, x, y);
          ctx.fillText(2, x + w, y + h);
        }
        if (text) {
          ctx.fillText(text, x + 10, y - 5);
        }
        ctx.stroke();
      }

      function drawLine(item) {
        for (let i = 0; i < item.length; i++) {
          ctx.beginPath();
          ctx.strokeStyle = color;
          if (item[i].length > 1) {
            ctx.moveTo(handleFn(item[i][0].x, "x"), handleFn(item[i][0].y, "y"));
            ctx.lineTo(handleFn(item[i][1].x, "x"), handleFn(item[i][1].y, "y"));
            ctx.closePath();
            ctx.font = 'bold 15px SimSun';
            ctx.fillStyle = color;
            if (number) {
              ctx.fillText((i + 1), handleFn(item[i][0].x, "x"), handleFn(item[i][0].y, "y"));
            }

          }
          ctx.stroke();
        }
        if (text) {
          drawLineNumber(ctx, text, item)
        }

      }

      function drawLineNumber(ctx, text, position) {
        let nowPosition = getLineMiddlePosition(position);
        let lineStartNum = 1;
        let length = nowPosition.length;
        for (let i = 0; i < length; i++) {
          ctx.font = 'bold 12px SimSun';
          ctx.fillStyle = color;
          let nowNumber = 0;
          nowNumber = parseInt(i + lineStartNum);
          ctx.fillText(text + nowNumber, handleFn(nowPosition[i].x, "x"), handleFn(nowPosition[i].y, "y"));
        }
      }

      function getLineMiddlePosition(line) {
        let middlePosition = [];
        for (let i = 0; i < line.length - 1; i++) {
          if (line[i].length > 1 && line[i + 1].length > 1) {
            let x0 = getMiddle(line[i][0].x, line[i][1].x);
            let x1 = getMiddle(line[i + 1][0].x, line[i + 1][1].x);
            let middleX = getMiddle(x0, x1);
            let y0 = getMiddle(line[i][0].y, line[i][1].y);
            let y1 = getMiddle(line[i + 1][0].y, line[i + 1][1].y);
            let middleY = getMiddle(y0, y1);
            middlePosition.push({x: middleX - 12, y: middleY});
          }
        }
        return middlePosition;
      }

      function getMiddle(x1, x2) {
        return (x1 + x2) / 2;
      }

      function drawDirect(item) {
        let w = 30, h = 40;
        let x = item[0].x ? handleFn(item[0].x, "x") : handleFn(0, "x");
        let y = item[0].y ? handleFn(item[0].y, "y") : handleFn(0, "y");
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + h);
        ctx.moveTo(x - w / 2, y + h / 2);
        ctx.lineTo(x + w / 2, y + h / 2);
        ctx.fillStyle = color;
        ctx.fillText(text, x - 5, y - 5);
        ctx.stroke();
        drawArrow(ctx, [{x: x, y: y + 50}, {x: x, y: y}], color)
      }

      function drawCircle(item) {
        let radius = config.radius || 5;
        ctx.strokeStyle = color;
        ctx.font = 'bold 15px SimSun';
        ctx.fillStyle = color;
        if (text) {
          ctx.fillText(text, handleFn(item[0].x, "x") + 10, (handleFn(item[0].y, "y") - 5));
        }

        for (let i = 0; i < item.length; i++) {
          ctx.beginPath();
          ctx.arc(handleFn(item[i].x, "x"), handleFn(item[i].y, "y"), item[i].radius ? handleFn(item[i].radius, "r") : handleFn(radius, "r"), 0, 2 * Math.PI);
          ctx.font = 'bold 15px SimSun';
          ctx.fillStyle = color;
          if (number) {
            ctx.fillText((i + 1), handleFn(item[i].x - 10, "x"), handleFn(item[i].y + 10, "y"));
          }
          ctx.closePath();
          if (fill) {
            ctx.fillStyle = fill;
            // ctx.globalAlpha = 0.5;
            ctx.fill();
          }
          ctx.stroke();
        }
      }

      function drawArrows(item) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        let point1 = {x: handleFn(item[0].x, "x"), y: handleFn(item[0].y, "y")};
        let point2 = {x: handleFn(item[1].x, "x"), y: handleFn(item[1].y, "y")};
        point2 = thetaPoint(point1, point2, theta);
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.stroke();
        ctx.font = 'bold 15px SimSun';
        ctx.fillStyle = color;
        ctx.fillText(text, point2.x + 15 * ((point2.x - point1.x) / Math.abs(point2.x - point1.x)), point2.y + 15 * ((point2.y - point1.y) / Math.abs(point2.y - point1.y)));
        drawArrow(ctx, [point1, point2], color)

      }

      function drawArrow(ctx, point, color) {
        let option = {};
        if (color) {
          option.color = color
        }
        if (sharp) {
          option.sharp = sharp;
        }
        if (size) {
          option.size = size;
        }

        for (let i = 0; i < point.length; i++) {
          option.sp = {x: point[0].x, y: point[0].y};
          option.ep = {x: point[1].x, y: point[1].y};
          paint(option, ctx)
        }
      }

      function paint(a, context) {
        let sp = a.sp;
        // let ep = {x: (a.ep.x + a.sp.x) / 2, y: (a.sp.y + a.ep.y) / 2};
        let ep = a.ep;
        if (context === undefined)
          return;
        context.beginPath();
        //画箭头头部
        let h = _calcH(a, sp, ep, context);
        a.color ? context.strokeColor = a.color : "";
        context.moveTo(ep.x, ep.y);
        context.lineTo(h.h1.x, h.h1.y);
        context.moveTo(ep.x, ep.y);
        context.lineTo(h.h2.x, h.h2.y);

        context.stroke();

      }

      //计算头部坐标
      function _calcH(a, sp, ep) {
        let theta = Math.atan((ep.x - sp.x) / (ep.y - sp.y));
        let cep = _scrollXOY(ep, -theta);
        let csp = _scrollXOY(sp, -theta);
        let ch1 = {x: 0, y: 0};
        let ch2 = {x: 0, y: 0};
        let l = cep.y - csp.y;
        ch1.x = cep.x + l * (a.sharp || 0.1);
        ch1.y = cep.y - l * (a.size || 0.2);
        ch2.x = cep.x - l * (a.sharp || 0.1);
        ch2.y = cep.y - l * (a.size || 0.2);
        let h1 = _scrollXOY(ch1, theta);
        let h2 = _scrollXOY(ch2, theta);
        return {
          h1: h1,
          h2: h2
        };
      }

      //旋转坐标
      function _scrollXOY(p, theta) {
        return {
          x: p.x * Math.cos(theta) + p.y * Math.sin(theta),
          y: p.y * Math.cos(theta) - p.x * Math.sin(theta)
        };
      }

      switch (type) {
        case 'rect':
          drawRect(point);
          break;
        case 'zone':
          drawZone(point);
          break;
        case 'line':
          drawLine(point);
          break;
        case 'direct':
          drawDirect(point);
          break;
        case 'circle':
          drawCircle(point);
          break;
        case 'arrow':
          drawArrows(point);
          break
      }
      ctx.closePath();
    },
    initCanvas() {
      if (this.myLayer.length) {
        let c = this.$refs.can;
        let ctx = c.getContext("2d");

        ctx.clearRect(0, 0, 2000, 2000);
        // ctx.drawImage(img,0,0,_this.width,_this.height);
        this.myLayer.forEach(item => {
          if (item.point.length > 0 && item.show) {
            this.draw(ctx, item, this.narrowDraw)
          }

        });

        if (this.magnify && this.showBg) {
          this.$nextTick(function () {
            let mc = this.$refs.mCan;
            let biggerImg = this.$refs.bgImg; // 创建一个img元素
            let mctx = mc.getContext("2d");
            let _this = this;

            mc.style.display = "none";
            // 存储未绘制状态
            ctx.save();
            mctx.clearRect(0, 0, 300, 300);
            c.onmouseout = null;
            c.onmousemove = null;
            c.onmouseout = function () {
              mc.style.display = "none";
            };
            c.onmousemove = function (e) {
              mc.style.display = "block";
              mctx.clearRect(0, 0, 300, 300);
              // 图片被放大区域的中心点，也是放大镜的中心点
              let location = _this.getLocation("can", e.clientX, e.clientY);// getLocation()
              // 1224
              let centerPoint = {
                x: (location.x.toFixed(4)),
                y: (location.y.toFixed(4))
              };
              // 图片被放大区域的半径
              let originalRadius = 300;
              let multiple = (1 / _this.multiple).toFixed(4);
              mctx.drawImage(biggerImg,
                centerPoint.x * multiple - 100,
                centerPoint.y * multiple - 100,
                originalRadius, originalRadius,
                0, 0,
                originalRadius, originalRadius);
              _this.centerX = centerPoint.x;
              _this.centerY = centerPoint.y;
              _this.myLayer.forEach(item => {
                if (item.point.length > 0 && item.show) {
                  _this.draw(mctx, item, _this.magnifyDraw)
                }

              });
              let bbox = _this.$refs.bgImg.getBoundingClientRect();
              mc.style.left = (e.clientX - bbox.left) + "px";
              mc.style.top = (e.clientY - bbox.top) + "px";
            }
          })
          // biggerImg.src = _this.src; // 给img元素的src属性赋值
          // biggerImg.onload = function () {
          //     handleMagnify();
          //     biggerImg.onerror = null;
          //     biggerImg.onload = null
          // };
          // biggerImg.onerror = function () {
          //     biggerImg.src = png404;
          //     _this.config.multiple = 1;
          //     handleMagnify();
          //     biggerImg.onerror = null;
          //     biggerImg.onload = null
          // }

        }
      }
    },
    changeImg() {
      this.$nextTick(function () {
        let img = this.$refs.bgImg;
        img.src = this.src;
        img.onerror = function () {
          img.src = png404;
          img.onerror = null;
        }
      })
    },
    getLocation(id, x, y) {
      let c = this.$refs[id];
      let bbox = c.getBoundingClientRect();// getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
      return {
        x: (x - bbox.left) * (c.width / bbox.width),
        y: (y - bbox.top) * (c.height / bbox.height)
      };
    },
    handleLimit(type, num) {
      this.$emit("onLimit", type, num);
    },
    sub(arg1, arg2) {
      let r1, r2, m, n;
      try {
        r1 = arg1.toString().split(".")[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split(".")[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2));
      n = (r1 >= r2) ? r1 : r2;
      return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(n));
    },
    narrowDraw(p) {
      return p * this.multiple
    },
    magnifyDraw(p, type) {
      if (type === "w" || type === "h" || type === "r") {
        return p;
      }
      let multiple = (1 / this.multiple).toFixed(4);
      let tempP = 0;
      if (type === "x") {
        tempP = parseFloat((this.centerX * multiple - 100).toFixed(4));
      }
      if (type === "y") {
        tempP = parseFloat((this.centerY * multiple - 100).toFixed(4));
      }
      return this.sub(p, tempP)
    }
  },
  watch: {
    // id: function () {
    //     if (this.id) {
    //         this.changeImg();
    //         this.initCanvas();
    //     }
    // },
    src: function () {
      if (this.showBg) {
        this.changeImg();
      }
    },
    config: {
      handler() {
        if (this.id) {
          if (this.showBg) {
            this.changeImg();
          }
          this.initCanvas();
        }
      },
      deep: true,
    }
  },
}
</script>

<style scoped>
.magnify-canvas {
  border: 2px solid #ccc;
  border-radius: 100px;
  position: absolute;
  display: none;
  z-index: 100;
}
</style>