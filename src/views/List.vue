<template>
  <div class="list" :class="{'nos':user}">
    <div class="content" v-if="ment" :class="{'nos':user}">
      <h1 v-text="ment.name"></h1>
      <section v-text="ment.msg"></section>
      <ul>
        <li v-for="(user, i) in ment.staff" @click="showInfo(user)">
          <div class="img">
            <img :src="`/img/staff/${id}/${user.name}.jpg`" :ref="'img'+i">
          </div>
          <strong v-text="showName(user.name)"></strong>
          <span v-text="user.position||defaultPosition"></span>
        </li>
      </ul>
      <strong class="back" @click="back"></strong>
    </div>
    <div class="zz" v-if="user">
      <div class="msg">
        <div class="mh">
          <i class="close" @click="user=null"></i>
        </div>
        <div class="mc">
          <div class="img">
            <img :src="`/img/staff/${id}/${user.name}.jpg`">
          </div>
          <div class="right">
            <h3 v-text="showName(user.name)"></h3>
            <span v-text="user.position||defaultPosition"></span>
            <p v-text="`${t.label1}：${user.date}`"></p>
            <div>
              <section v-text="`${t.label2}：${user.msg}`"></section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        show: true,
        ment: null,
        map: {},
        id: this.$route.query.id,
        defaultPosition: '',
        user: null,
        t: {}
      };
    },
    created() {
      this.getdata();
      this.getConfig();
    },
    methods: {
      showName(name) {
        if (name) {
          return name.replace(/_/g, '');
        }
        return name;
      },
      getdata() {
        this.$http({
          method: 'GET',
          url: '/data/data.json'
        }).then(r => {
          if (r.status === 200) {
            this.ment = r.data[this.id];
            this.$nextTick(() => {
              for (let key in this.$refs) {
                this.$refs[key][0].onerror = e => {
                  e.target.setAttribute('src', '/img/ddq.png');
                }
              }
            });
          } else {
            alert(`[${r.status}]${r.msg}`);
          }
        }).catch(err => {
          alert(err);
        });
      },
      showInfo(user) {
        if (user.msg) {
          this.user = user;
        }
      },
      back() {
        this.$router.push('/?t=2');
      },
      getConfig() {
        this.$http({
          method: 'GET',
          url: '/data/config.json'
        }).then(r => {
          this.t = r.data.list;
          this.defaultPosition = this.t.def;
        });
      }
    }
  };

</script>
<style lang="less">
  .nos {
    overflow: hidden;
  }

  .list {
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
        display: block;
        text-align: center;
        padding: 80px 0 20px;
        font-weight: 500;
        line-height: 1;
        margin: 0;
      }

      .banner {
        display: block;
        width: 880px;
        margin: 0 auto;
      }

      section {
        width: 880px;
        text-align: justify;
        display: block;
        margin: 0 auto 0;
        text-indent: 2em;
        line-height: 1.5;
        margin-bottom: 65px
      }

      ul {
        list-style: none;
        width: 900px;
        margin: 0 auto;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        padding-left: 25px;

        li {
          text-align: center;
          width: 124px;
          margin: 0 26px 40px 0;
          transition: all 300ms;
          cursor: pointer;

          .img {
            width: 124px;
            height: 160.08px;
            overflow: hidden;

            img {
              display: block;
              width: 100%;
            }
          }

          strong {
            display: block;
            font-size: 16px;
            font-weight: 500;
            padding: 16px 0 4px;
          }

          span {
            display: block;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
    }

    .zz {
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, .5);
      display: flex;
      align-items: center;
      justify-content: center;

      .msg {
        width: 960px;
        max-height: 100%;
        background-color: #fff;
        border-radius: 8px;

        .mh {
          height: 60px;
          width: 100%;
          box-sizing: border-box;
          padding: 0 0 0 0;
          text-align: right;

          .close {
            display: block;
            cursor: pointer;
            width: 50px;
            height: 50px;
            background-image: url('/img/icons/close.png');
            background-size: 16px 16px;
            background-position: center;
            background-repeat: no-repeat;
            float: right;
          }
        }

        .mc {
          display: flex;
          box-sizing: border-box;
          padding: 0 40px 40px;
          height: 365px;

          .img {
            width: 248px;
            height: 320px;
            margin-right: 40px;
            overflow: hidden;
            img{
              width: 100%;
            }
          }

          .right {
            h3 {
              font-size: 24px;
              font-weight: 600;
              margin: 0 0 8px 0;
            }

            span {
              font-size: 16px;
              font-weight: 400;
              margin-bottom: 24px;
              display: block;
              line-height: 22px;
            }

            p {
              line-height: 1;
              margin: 0 0 8px 0;
              padding: 0;
              line-height: 24px;
            }

            div {
              height: 240px;
              overflow-y: auto;

              section {
                font-size: 14px;
                font-weight: 400;
                line-height: 24px;
                padding-right: 10px;
              }
            }
          }
        }
      }
    }
  }

</style>
