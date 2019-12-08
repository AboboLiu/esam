<template>
  <div class="e-sign">
    <div class="sign">
      <i @click="showMe" :class="icon"></i>
      <div v-if="show" class="tag" :class="type">
        <span v-text="txt"></span>
        <ul class="menu">
          <li @click="toInfo" :class="{'no':!dev}" v-html="menu1"></li>
          <li @click="toList" :class="{'no':!staff}" v-html="menu2"></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      id: String,
      staff: Number,
      dev: String,
      icon: String,
      txt: String,
      type: String,
      menu1: String,
      menu2: String,
      list: Array
    },
    data() {
      return {
        show: false
      };
    },
    methods: {
      close() {
        this.show = false;
      },
      showMe() {
        this.show = !this.show;
        this.$emit('click', this.id);
      },
      liClick(id) {
        this.$emit('click', id);
      },
      toInfo() {
        if (!this.dev) {
          return;
        }
        this.$router.push({
          path: '/info',
          query: {
            id: this.id
          }
        });
      },
      toList() {
        console.log(this.staff);
        if (!this.staff) {
          return;
        }
        this.$router.push({
          path: '/List',
          query: {
            id: this.id
          }
        });
      },
      click() {
        if (this.list && this.list.length > 1) {
          this.show = true;
        } else {
          this.$emit('click', this.id);
        }
      }
    }
  };

</script>
<style lang="less">
  .e-sign {
    position: absolute;

    .sign {
      width: 34px;
      height: 39px;
      position: relative;
      margin: -19.5px 0 0 -17px;

      i {
        cursor: pointer;
        display: block;
        width: 100%;
        height: 100%;
        background-image: url('/img/dq.png');
        background-size: contain;

        &.star {
          background-image: url('/img/star.png');
        }
      }

      .tag {
        position: absolute;
        top: -1px;
        left: 110%;
        height: 33px;
        display: flex;
        align-items: center;
        z-index: 1;

        span {
          background: linear-gradient(180deg, rgba(244, 48, 48, 1) 0%, rgba(205, 3, 3, 1) 100%);
          box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.16);
          color: #fff;
          font-size: 14px;
          font-weight: 400;
          display: block;
          border-radius: 3px;
          padding: 7px 15px;
          white-space: nowrap;

          &:before {
            content: "";
            display: block;
            width: 0;
            height: 0;
            position: absolute;
            left: -10px;
            top: 50%;
            margin-top: -5px;
            border: 5px solid;
            border-color: transparent rgba(244, 48, 48, 1) transparent transparent;
          }
        }

        ul {
          list-style: none;
          display: block;
          width: 100px;
          background: linear-gradient(360deg, rgba(238, 238, 238, 1) 0%, rgba(255, 255, 255, 1) 100%);
          box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.16);
          border-radius: 3px;
          margin: 0 0 0 20px;
          padding: 0;
          position: relative;

          &:before {
            content: "";
            display: block;
            width: 0;
            height: 0;
            position: absolute;
            left: -10px;
            top: 50%;
            margin-top: -5px;
            border: 5px solid;
            border-color: transparent #fff transparent transparent;
          }

          li {
            cursor: pointer;
            font-size: 14px;
            padding: 10px;

            &.no {
              display: none;
            }

            &:first-of-type {
              border-bottom: 1xp solid rgba(225, 225, 225, 1);
            }
          }
        }

        &.left {
          left: inherit;
          right: 110%;

          span {
            order: 2;

            &:before {
              left: inherit;
              right: -10px;
              border-color: transparent transparent transparent rgba(244, 48, 48, 1);

            }
          }

          ul {
            order: 1;
            margin: 0 20px 0 0;

            &:before {
              left: inherit;
              right: -10px;
              border-color: transparent transparent transparent #fff;

            }
          }

        }

      }
    }
  }

</style>
