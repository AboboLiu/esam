<template>
  <div class="bg">
    <strong class="back" @click="back" v-if="step!==1"></strong>
    <div class="content" v-if="step">
      <h1>
        <img :src="src" />
        <span v-text="h1"></span>
      </h1>
      <h4 v-text="h4"></h4>
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
      <h2 v-if="step!==3" v-text="h2"></h2>
    </div>
    <div v-else class="content ks">
      <h1>
        <img :src="src" />
        <span v-html="h1"></span>
      </h1>
      <p class="time">
        交卷倒计时
        <strong :class="{'red':time<this.count*3}" v-text="time"></strong>
        秒
      </p>
      <p class="ask" v-text="formatAsk(t.q)"></p>
      <ol class="aws" type="A">
        <li v-for="(aw,i) in t.a" :key="i">
          <span
            :class="{'cur':i===huida,'on':huida===null,'y':i===t.r*1,'n':i!==t.r*1}"
            v-text="aw"
            @click="answer(i)"
          ></span>
        </li>
      </ol>
      <div class="btns">
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
      h4: "",
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
      mainH1: null,
      mainH2: null,
      mainSrc: null,
      src: null,
      item: null,
      key: ""
    };
  },
  components: { checkMsg },
  created() {
    this.getData();
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
          this.h1 = this.data.h1;
          this.h2 = this.data.h2;
          this.h4 = "";
          this.src = this.data.src;
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
          this.data = r.data;
          this.time = r.data.time * 1;
          this.list = r.data.list;
          this.count = r.data.count;
          this.map = r.data.letter;
          this.empty = r.data.empty;
          this.h1 = r.data.h1;
          this.h2 = r.data.h2;
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
      this.h4 = this.item.title;
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
      this.time = this.data.time;
      this.huida = null;
      this.fen = 0;
      this.step = 0;
      this.inv = setInterval(() => {
        this.time -= 1;
        if (this.time <= 0) {
          this.submit();
        }
      }, 1000);
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
@keyframes last {
  0% {
    color: #fff;
  }
  80% {
    color: #f00;
  }
}
@keyframes r {
  0% {
    background-color: rgba(0, 255, 0, 0.1);
    border: 1px solid #0f0;
    color: #0f0;
  }
  90% {
    background-color: rgba(255, 255, 255, 0.4);
  }
}
@keyframes err {
  0% {
    background-color: #f00;
    color: #fff;
  }
  5% {
    left: 2px;
  }
  10% {
    left: -4px;
  }
  15% {
    left: 2px;
  }
  20% {
    left: -4px;
  }
  25% {
    left: 2px;
  }
  30% {
    left: 0;
    color: #f00;
    // background-color: rgba(255, 255, 255, 0.4);
  }
}
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
      height: 100vh;
      border-radius: 0;
      box-sizing: border-box;
      padding: 0 30px;
      display: flex;
      flex-direction: column;
      .time {
        flex-shrink: 0;
        color: rgba(255, 255, 255, 0.5);
        margin: 0;
        height: 4vh;
        display: block;
        text-align: right;
        padding-right: 2vw;
        font-size: 2.4vh;
        strong {
          color: rgba(255, 255, 255, 1);
          opacity: 1;
          font-size: 1.2em;
          &.red {
            color: #f00;
            font-weight: 600;
            font-size: 2em;
            animation: last 0.2s linear 0s infinite alternate;
          }
        }
      }
      .ask {
        font-size: 3vh;
        margin: 4vh 0;
        flex-shrink: 0;
      }
      .aws {
        flex-shrink: 0;
        font-size: 2.2vh;
        display: flex;
        flex-direction: column;
        margin: 0 0 0 3em;
        padding: 0;
        li {
          width: auto;
          line-height: 1.6;
          span {
            position: relative;
            display: block;
            border-radius: 0.5vh;
            float: left;
            padding: 0 2vw 0 0.5vw;
            border: 1px solid;
            border-color: rgba(0, 0, 0, 0);
            &.on:active {
              background-color: rgba(255, 255, 255, 0.4);
              border-color: rgba(0, 0, 0, 0);
            }
            &.cur {
              // background-color: rgba(255, 255, 255, 0.4);
              // border-color: rgba(0, 0, 0, 0);
              &.y {
                animation: r 1s linear;
                color: #0f0;
              }
              &.n {
                animation: err 1s linear;
                color: #f00;
              }
            }
          }
          & + li {
            padding-top: 2.6vh;
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
      .btns {
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        justify-items: center;
        flex-grow: 100;
        flex-shrink: 1;
        .next {
          width: 200px;
        }
        .ok {
          width: 300px;
          color: #0f0;
          background-color: rgba(0, 255, 0, 0.1);
          border: 1px solid #0f0;
        }
        .err {
          border: 1px solid #f00;
          background-color: rgba(255, 0, 0, 0.1);
          width: 400px;
          color: rbga(255, 255, 255, 0.6);
          .r {
            color: #0f0;
          }
        }
      }
    }
    h1 {
      text-align: center;
      margin: 0;
      font-size: 3.5vh;
      line-height: 2em;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6vh 0;
      img {
        height: 1.2em;
        margin-right: 0.5em;
      }
    }
    h2 {
      color: rgba(255, 255, 255, 0.9);
      text-align: center;
      padding: 0;
      font-size: 3vh;
      margin: 0 auto 4vh;
      font-weight: 400;
    }
    h4 {
      text-align: center;
      font-size: 3vh;
      position: relative;
      top: -6vh;
      font-weight: 400;
      line-height: 1;
      margin: 3vh 0
    }

    .btn {
      font-size: 2.4vh;
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
      margin: 0 auto 4vh;
      padding: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: space-between;
      height: 32vh;
      width: 700px;
      li {
        width: 300px;
        // margin: 0 0 6vh;
      }
    }
    .menu {
      margin-bottom: 12vh;
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