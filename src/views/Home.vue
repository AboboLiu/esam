<template>
  <div class="bg">
    <strong class="back" @click="back" v-if="step*1===2"></strong>
    <strong class="nav" @click="toKs">智慧党建党性体验区</strong>
    <div class="hz" v-show="step*1===1">
      <div class="txt">
        <strong v-html="t.city"></strong>
        <span v-html="t.city_en"></span>
      </div>
      <i class="dq" @click="step=2;"></i>
    </div>
    <div class="dt" v-show="step*1===2">
      <div class="txt">
        <strong v-html="t.area"></strong>
        <span v-html="t.area_en"></span>
        <span class="tl" v-html="t.legend"></span>
      </div>
      <e-sign v-for="(item, id) in taxList" :txt="item.name" :type="item.type" :style="{left:item.x, top:item.y}" @click="closeOther" :list="item.list" :id="id" :icon="item.icon" ref="d" :dev="item.dev" :staff="item.staff?item.staff.length:0" :menu1="t.menu1" :menu2="t.menu2" :key="id"></e-sign>
    </div>
  </div>
</template>

<script>
  import eSign from '@/component/sign';
  export default {
    components: {
      eSign
    },
    data() {
      return {
        step: this.$route.query.t || 1,
        taxList: [],
        t: {}
      }
    },
    created() {
      this.getdata();
      this.getConfig();
    },
    methods: {
      back() {
        this.$router.push('/');
        this.step = 1;
      },
      toKs() {
        this.$router.push('/esa');
      },
      closeOther(id) {
        for (let item of this.$refs.d) {
          if (item.id !== id) {
            item.close();
          }
        }
      },
      getdata() {
        this.$http({
          method: 'GET',
          url: '/data/data.json'
        }).then(r => {
          if (r.status === 200) {
            let map = JSON.parse(JSON.stringify(r.data));
            for (let key in map) {
              map[key].list = [{
                id: key,
                name: map[key].name
              }];
              for (let key2 in map) {
                if (map[key].x === map[key2].x && map[key].y === map[key2].y && map[key] !== map[key2]) {
                  map[key].list.push({
                    id: key2,
                    name: map[key2].name
                  });
                  delete map[key2];
                }
              }
            }
            this.taxList = map;
          } else {
            alert(`[${r.status}]${r.msg}`);
          }
        }).catch(err => {
          alert(err);
        });
      },
      getConfig() {
        this.$http({
          method: 'GET',
          url: '/data/config.json'
        }).then(r => {
          this.t = r.data.home;
        });
      }
    }
  }

</script>
<style lang="less">
  .bg {
    width: 1920px;
    height: 1080px;
    background-image: url('/img/bbg.png');
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;

    .hz {
      width: 1175px;
      height: 964px;
      background-image: url(/img/hz.png);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      .txt {
        left: 343px;
        top: 188px;
      }
    }

    .dt {
      width: 1267px;
      height: 999px;
      background-image: url(/img/dt.png);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      .txt {
        left: 343px;
        top: 188px;
      }
    }

    .txt {
      position: absolute;
      left: 0;
      color: #fff;
      line-height: 1;

      strong {
        display: block;
        font-size: 40px;
        line-height: 1;
        font-weight: 500;
        margin-bottom: 20px
      }

      span {
        font-weight: normal;
        line-height: 1;
        display: block;
        font-size: 24px;
        line-height: 34px;
        color: rgba(266, 255, 255, .6);
      }

      .tl {
        color: #fff;
        height: 28px;
        font-size: 20px;
        font-weight: 400;
        line-height: 28px;
        height: 28px;
        margin-top: 40px;
        background-image: url('/img/dq.png');
        background-position: left center;
        background-repeat: no-repeat;
        background-size: contain;
        padding-left: 30px;
      }
    }

    .dq {
      cursor: pointer;
      width: 63px;
      height: 71px;
      display: block;
      background-image: url('/img/dq.png');
      background-size: contain;
      position: absolute;
      left: 908px;
      top: 546px;
    }
  }

</style>
