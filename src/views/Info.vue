<template>
  <div class="info" :class="{'nos':user}">
    <div class="content" v-if="ment" :class="{'nos':user}">
      <h1 v-text="ment.name"></h1>
      <h3 v-text="`${t.title}：${ment.title}`"></h3>
      <div class="banner" :class="{'small':smallImg}" v-show="show">
        <img class="banner" :src="`/img/banners/${id}.jpg`" @error="show=false" @load="getImg" ref="img">
      </div>
      <section v-text="ment.dev"></section>
    </div>
    <strong class="back" @click="back"></strong>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        show: true,
        ment: null,
        id: this.$route.query.id,
        user: null,
        smallImg: false,
        t: {}
      };
    },
    created() {
      this.getdata();
      this.getConfig();
    },
    methods: {
      getImg() {
        this.smallImg = this.$refs.img.naturalWidth < 880;
      },
      getdata() {
        this.$http({
          method: 'GET',
          url: '/data/data.json'
        }).then(r => {
          if (r.status === 200) {
            this.ment = r.data[this.id];
          } else {
            alert(`[${r.status}]${r.msg}`);
          }
        }).catch(err => {
          alert(err);
        });
      },
      back() {
        this.$router.push('/?t=2');
      },
      getConfig() {
        this.$http({
          method: 'GET',
          url: '/data/config.json'
        }).then(r => {
          this.t = r.data.info;
        });
      }
    }
  };

</script>
<style lang="less">
  .nos {
    overflow: hidden;
  }

  .info {
    background-image: url("/img/bg.png");
    min-height: 100%;
    width: 100%;
    background-attachment: fixed;

    .content {
      width: 960px;
      background-color: #fff;
      min-height: 100%;
      margin: 0 auto;
      color: #000;
      box-sizing: border-box;

      h1 {
        font-size: 24px;
        color: #000;
        display: block;
        text-align: center;
        padding: 45px 0 20px;
        font-weight: 600;
        line-height: 1;
        margin: 0;
      }

      h3 {
        font-size: 24px;
        font-weight: 400;
        text-align: center;
        line-height: 1;
        padding: 0;
        margin: 0 0 45px 0;
        color: #D0021B;
      }

      .banner {
        display: flex;
        width: 880px;
        height: 360px;
        margin: 0 auto;
        overflow: hidden;
        align-items: center;

        img {
          width: 880px;
          height: auto;
        }

        &.small {
          height: auto;
          max-height: 360px;

          img {
            max-width: 880px;
            height: auto;
            width: auto;
          }
        }
      }

      section {
        width: 880px;
        text-align: justify;
        display: block;
        margin: 45px auto 0;
        text-indent: 2em;
        line-height: 1.5;
        padding-bottom: 40px;
      }
    }
  }

</style>
