<!-- 轮播图组件 -->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import {addClass} from 'common/js/dom';
  export default {
    name: 'slider',
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      };
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();

        if (this.autoPlay) {
          this._play();
        }
      }, 20);

      window.addEventListener('resize', () => {
        // slider没有初始化时，什么都不做
        if (!this.slider || !this.slider.enabled) {
          return;
        }
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          if (this.slider.isInTransition) {
            this._onScrollEnd();
          } else {
            if (this.autoPlay) {
              this._play();
            }
          }
        });
        this.refresh();
      });
    },
    activated() {
      this.slider.enable();
      let pageIndex = this.slider.getCurrentPage().pageX;
      if (pageIndex > this.dots.length) {
        pageIndex = pageIndex % this.dots.length;
      }
      this.slider.goToPage(pageIndex, 0, 0);
      if (this.loop) {
        pageIndex -= 1;
      }
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },
    deactivated() {
      this.slider.disable();
      clearTimeout(this.timer);
    },
    beforeDestroy() {
      this.slider.disable();
      clearTimeout(this.timer);
    },
    methods: {
      refresh() {
        if (this.slider) {
          this._setSliderWidth(true);
          this.slider.refresh();
        }
      },
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;

        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');

          child.style.width = sliderWidth + 'px';
          width += sliderWidth;
        }

        if (this.loop && !isResize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + 'px';
      },

      _initDots() {
        this.dots = new Array(this.children.length);
      },
      // momentum惯性
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        });
        // 滚动完毕会触发scrollEnd事件
        this.slider.on('scrollEnd', this._onScrollEnd);

        this.slider.on('touchend', () => {
          if (this.autoPlay) {
            this._play();
          }
        });

        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer);
          }
        });
      },
      _onScrollEnd() {
        let pageIndex = this.slider.getCurrentPage().pageX;
        if (this.loop) {
          pageIndex -= 1;
        }
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
          this._play();
        }
      },
      _play() {
        let pageIndex = this.slider.getCurrentPage().pageX + 1;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          // better-scroll的方法
          this.slider.goToPage(pageIndex, 0, 400);
        }, this.interval);
      }
    }
  };
</script>

<style lang="less">
  @import "../../common/less/variable.less";
  .slider{
    /* 设置min-height是保证渲染时BScroll有内容*/
    min-height: 1px;
    .slider-group{
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-item{
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        a{
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }
        img{
          display: block;
          width: 100%;
        }
      }
    }
    .dots{
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      text-align: center;
      font-size: 0;
      .dot{
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: @color-text-l;
        &.active{
          width: 20px;
          border-radius: 5px;
          background: @color-text-ll;
        }
      }
    }
  }

</style>
