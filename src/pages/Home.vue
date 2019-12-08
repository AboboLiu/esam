<template>
  <div class="bg">
    <strong class="back" @click="back" v-if="step!==1"></strong>
    <div class="content" v-if="step">
      <div class="title">
        <h1>
          <img :src="src" />
          <span v-text="h1"></span>
        </h1>
        <h2 v-text="h2"></h2>
      </div>
      <ul v-if="step===1" class="fmenu">
        <li v-for="(t,i) in list" class="btn" v-text="t.title" :key="i" @click="check(t,i)"></li>
      </ul>
      <div v-else-if="step===2" class="menu">
        <h3 class="btn" @click="go(1)">模拟测试</h3>
        <h3 class="btn" @click="go(2)">在线考试</h3>
      </div>
      <div v-else-if="step===3" class="submit">
        <h3>
          考试成绩:
          <strong v-text="parseInt(fen)">0</strong> 分
        </h3>
        <h5>
          我是 No.
          <strong v-text="no"></strong> 位, 成绩总排名为第
          <strong v-text="rank"></strong> 名
        </h5>
      </div>
    </div>
    <div v-else class="content ks">
      <div class="title">
        <h1>
          <img :src="src" />
          <span v-text="h1"></span>
        </h1>
        <h2 v-text="h2"></h2>
      </div>
      <p class="time">
        交卷倒计时
        <strong v-text="time"></strong>
        秒
      </p>
      <p class="ask" v-text="formatAsk(t.q)"></p>
      <ol class="aws" type="A">
        <li v-for="(aw,i) in t.a" :key="i">
          <span :class="{'cur':i===huida,'on':huida===null}" v-text="aw" @click="answer(i)"></span>
        </li>
      </ol>
      <span v-if="huida===null" class="btn next" @click="next" v-text="btnTxt"></span>
      <span
        v-else-if="huida.toString()===t.r"
        class="btn ok"
        @click="next"
        v-text="`回答正确, ${btnTxt}`"
      ></span>
      <span v-else class="btn err" @click="next">
        回答错误, 正确答案(
        <strong class="r" v-text="map[t.r]"></strong>),
        <br />
        <span v-text="btnTxt"></span>
      </span>
    </div>
    <check-msg ref="tiao" @ok="toNext"></check-msg>
    <check-msg ref="submit" @ok=" submit();step=3"></check-msg>
  </div>
</template>
<script>
import checkMsg from "@/component/checkMsg";
export default {
  data() {
    return {
      h1: "",
      h2: "",
      step: 1,
      time: 600,
      mode: 1,
      qList: null,
      list: null,
      t: null,
      cur: 0,
      count: 1,
      huida: null,
      map: [],
      inv: null,
      fen: 0,
      rank: 0,
      no: 0,
      empty: null,
      mainH: null,
      src: null,
      item: null,
      key: ""
    };
  },
  components: { checkMsg },
  created() {
    this.getData();
    this.inv = setInterval(() => {
      this.time -= 1;
    }, 1000);
  },
  computed: {
    btnTxt() {
      if (this.cur === this.count - 1) {
        return "交卷";
      } else {
        return "下一题";
      }
    }
  },
  methods: {
    back() {
      if (!this.step) {
        this.$refs.submit.show("交卷吗?");
      } else {
        this.step -= 1;
        if (this.step === 1) {
          this.h1 = this.mainH1;
          this.h2 = this.mainH2;
        }
      }
    },
    formatAsk(str) {
      return `${this.cur + 1}.${str.replace("@", this.empty)}`;
    },
    getData() {
      this.$http({
        method: "GET",
        url: "/data/qlist.json"
      })
        .then(r => {
          this.list = r.data.list;
          this.count = r.data.count;
          this.map = r.data.letter;
          this.empty = r.data.empty;
          this.h1 = r.data.h1;
          this.h2 = r.data.h2;
          this.mainH1 = r.data.h1;
          this.mainH2 = r.data.h2;
          this.src = r.data.src;
        })
        .catch(() => {
          //-
        });
    },
    setDefCount() {
      let defCount = parseInt(localStorage.getItem("defCount"));
      defCount = isNaN(defCount)
        ? parseInt(Math.random() * 200 + 1000)
        : defCount;
      localStorage.setItem("defCount", defCount);
      let ks = JSON.parse(localStorage.getItem(this.key));
      if (!ks || ks.length < defCount) {
        let count = ks ? ks.length : 0;
        ks = ks || [];
        for (let i = 0; i < defCount - count; i++) {
          ks.push({
            time: new Date().getTime(),
            g: (100 / this.count) * this.random(this.count)
          });
        }
        localStorage.setItem(this.key, JSON.stringify(ks));
      }
    },
    check(item, i) {
      this.key = `ks${i}`;
      this.item = item;
      this.h1 = this.item.h1;
      this.h2 = this.item.h2;
      this.src = this.item.src || this.src;
      this.step = 2;
      this.setDefCount();
    },
    random(max) {
      return Math.floor(Math.random() * (max + 1));
    },
    go(mode) {
      this.mode = mode;
      let tmpList = [];
      for (let i = 0; i < this.count; i++) {
        tmpList.push(
          ...this.item.qs.splice(this.random(this.item.qs.length), 1)
        );
      }
      this.qList = tmpList;
      this.t = this.qList[this.cur];
      this.cur = 0;
      this.huida = null;
      this.fen = 0;
      this.step = 0;
    },
    answer(huida) {
      if (this.huida === null) {
        this.huida = huida;
      }
      if (huida + "" === this.t.r) {
        this.fen += 100 / this.count;
      }
    },
    toNext() {
      this.cur += 1;
      this.t = this.qList[this.cur];
      this.huida = null;
    },
    next() {
      if (this.cur >= this.count - 1) {
        this.submit();
        return;
      } else if (this.huida === null) {
        this.$refs["tiao"].show("您确定跳过这一题?");
      } else {
        this.toNext();
      }
    },
    submit() {
      this.step = 3;
      clearInterval(this.inv);
      let d = new Date().getTime();
      this.addNew({
        time: d,
        g: this.grade
      });
      let ks = JSON.parse(localStorage.getItem(this.key));
      let c = ks.filter(r => {
        return r.g > this.fen || (r.g === this.fen && r.time < d);
      });
      this.no = ks.length;
      this.rank = c.length + 1;
    },
    addNew(item) {
      let ks = localStorage.getItem(this.key);
      if (ks) {
        ks = JSON.parse(ks);
      } else {
        ks = [];
      }
      ks.push(item);
      localStorage.setItem(this.key, JSON.stringify(ks));
    }
  }
};
</script>
<style lang="scss">
.bg {
  user-select: none;
  width: 100%;
  height: 100%;
  background-image: url("/img/bg.jpg");
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  .content {
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
    width: 960px;
    max-width: 100%;
    margin: 0 auto;
    height: 70vh;
    border-radius: 1vh;
    &.ks {
      height: 100%;
      border-radius: 0;
      box-sizing: border-box;
      padding: 0 30px;
      h1 {
        padding: 10vh 0 5vh;
      }
      .time {
        color: rgba(255, 255, 255, 0.5);
        margin: 0;
        display: block;
        text-align: right;
        padding-right: 2vw;
        font-size: 2.4vh;
        strong {
          color: rgba(255, 255, 255, 1);
          opacity: 1;
          font-size: 1.2em;
        }
      }
      .ask {
        font-size: 3vh;
        margin: 4vh 0;
      }
      .aws {
        font-size: 2.2vh;
        li {
          margin-bottom: 4vh;
          width: auto;
          span {
            display: inline-block;
            border-radius: 0.5vh;
            padding: 1vh 2vw 1vh 0.5vw;
            &.on:active,
            &.cur {
              background-color: rgba(255, 255, 255, 0.4);
              font-weight: 600;
            }
          }
          &.r {
            color: #0f0;
          }
          &.wr {
            color: rgba(0, 255, 0, 0.8);
          }
          &.w {
            color: #f00;
            span {
              text-decoration: line-through;
            }
          }
        }
      }
      .next {
        width: 200px;
        margin: 10vh auto 0;
      }
      .ok {
        width: 300px;
        margin: 10vh auto 0;
        color: #0f0;
        background-color: rgba(0, 255, 0, 0.1);
        border: 1px solid #0f0;
      }
      .err {
        border: 1px solid #f00;
        background-color: rgba(255, 0, 0, 0.1);
        width: 400px;
        margin: 10vh auto 0;
        font-size: 2.6vh;
        color: rbga(255, 255, 255, 0.6);
        .r {
          color: #0f0;
        }
      }
    }
    .title {
      display: flex;
      height: 24vh;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      h1 {
        width: 100%;
        margin: 0;
        font-size: 3.5vh;
        font-weight: 400;
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        img {
          height: 2em;
          margin-right: 0.5em;
        }
      }
      h2 {
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        padding: 0;
        font-size: 3vh;
        margin: 0;
        font-weight: 400;
      }
    }

    .btn {
      font-size: 3vh;
      display: block;
      text-align: center;
      font-weight: 400;
      padding: 1.5vh 0;
      border-radius: 0.5vh;
      background-color: rgba(255, 255, 255, 0.2);
      &:active {
        background-color: rgba(255, 255, 255, 0.7);
      }
    }
    .fmenu {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 700px;
      margin: 0 auto;
      li {
        width: 300px;
        margin: 0 0 6vh;
      }
    }
    .menu {
      h3 {
        width: 500px;
        margin: 0 auto 5vh;
      }
    }
    .submit {
      text-align: center;
      strong {
        color: #f00;
        font-size: 1.5em;
      }
      h3 {
        font-weight: 400;
        font-size: 4vh;
      }
      h5 {
        font-weight: 400;
        font-size: 3vh;
      }
    }
  }
}
</style>