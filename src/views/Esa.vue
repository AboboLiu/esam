<template>
  <div class="esa">
    <strong class="nav" @click="toMap">在线地图</strong>
    <div class="content">
      <div class="title">
        <h1 class="bt">
          <i></i>“红旗高扬”在我心 努力学习固根本
        </h1>
        <p class="da d1" v-if="isOver" v-text="`考试成绩: ${grade} 分`"></p>
        <p class="da" v-if="isOver" v-text="`我是 No.${pCount} 位, 成绩总排名为第 ${ranking+1} 名`"></p>
        <button @click="replay" v-if="isOver">再试一次</button>
        <span class="time" v-if="!isOver" v-text="`剩余时间:${time}秒`"></span>
      </div>
      <ul v-if="!isOver">
        <li
          v-for="(item, i) in list"
          :key="i"
          :class="{'err':(item.u && item.u !== letter[item.r]), 'submit':isSubmit, 'empty':!item.u}"
          v-show="i===cur"
        >
          <strong v-text="(i+1)+'. '+item.q"></strong>
          <ul>
            <li
              v-for="(t, j) in item.a"
              :key="j"
              :class="{'check':letter[j] === item.u, 'real':item.r === j}"
            >
              <input
                type="radio"
                :id="i+','+j"
                :name="i"
                @change="setU(i,letter[j])"
                :disabled="!ing"
              />
              <label :for="i+','+j" v-text="letter[j] +'. ' + t"></label>
            </li>
          </ul>
        </li>
      </ul>
      <button @click="next" v-if="!isOver && cur+1 < count">下一题</button>
      <button @click="submit" v-if="!isOver && cur+1>= count">交卷</button>
      <p class="realp" v-if="isSubmit && !isOver">
        <span class="success" v-if="letter[curT.r] === curT.u ">回答正确</span>
        <span v-else>
          <strong>正确答案:</strong>
          <span v-text="letter[list[cur].r]+'.'+list[cur].a[list[cur].r]"></span>
        </span>
      </p>
    </div>
  </div>
</template>
<script>
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      list: [],
      letter: [],
      count: 0,
      isSubmit: false,
      time: 0,
      inv: null,
      pCount: 0,
      ranking: 0,
      cur: 0,
      isOver: false
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ing() {
      return this.list.length && !this.isSubmit;
    },
    grade() {
      let zq = this.list.filter(r => {
        return this.letter[r.r] === r.u;
      });
      return (zq.length * 100) / this.count;
    },
    curT() {
      return this.list[this.cur];
    }
  },
  methods: {
    toMap() {
      this.$router.push("/");
    },
    getData() {
      this.$http({
        method: "GET",
        url: "/data/question.json"
      }).then(r => {
        let { question, upset, count, letter, time } = r.data;
        this.count = count;
        this.time = time;
        this.timeStar();
        this.letter = letter.split("");
        question = question.map(r => {
          r.u = null;
          return r;
        });
        this.list = this.getQ(question);
        this.setDefCount();
      });
    },
    setDefCount() {
      let defCount = parseInt(localStorage.getItem("defCount"));
      defCount = isNaN(defCount)
        ? parseInt(Math.random() * 200 + 1000)
        : defCount;
      localStorage.setItem("defCount", defCount);
      let ks = JSON.parse(localStorage.getItem("ks"));
      let fsx = [];
      for (let i = 0; i <= this.list.length; i++) {
        fsx.push((i * 100) / this.list.length);
      }
      if (!ks || ks.length < defCount) {
        let count = ks ? ks.length : 0;
        ks = ks || [];
        for (let i = 0; i < defCount - count; i++) {
          ks.push({
            time: new Date().getTime(),
            g: fsx[parseInt(Math.random() * fsx.length)]
          });
        }
        localStorage.setItem("ks", JSON.stringify(ks));
      }
    },
    timeStar() {
      this.inv = setInterval(() => {
        if (--this.time === 0) {
          clearInterval(this.inv);
          this.submit(1);
        }
      }, 1000);
    },
    getQ(list) {
      let q = [];
      for (let i = 0; i < this.count; i++) {
        q.push(...list.splice(parseInt(Math.random() * list.length), 1));
      }
      return q;
    },
    setU(i, l) {
      this.list[i].u = l;
      this.isSubmit = true;
    },
    next() {
      if (this.curT.u === null) {
        MessageBox.confirm("此题并未解答, 确定放弃吗?", "确认", {
          lockScroll: false
        })
          .then(r => {
            this.isSubmit = false;
            this.cur++;
          })
          .catch(() => {
            // .
          });
      } else {
        this.isSubmit = false;
        this.cur++;
      }
    },
    check() {
      this.list[this.cur].o = true;
      return this.curT.u === this.letter[this.curT.r];
    },
    submit(over) {
      if (over === 1) {
        this.submitDo();
      } else {
        MessageBox.confirm("您确定要交卷吗?", "确认", {
          lockScroll: false
        })
          .then(r => {
            this.submitDo();
          })
          .catch(() => {
            // .
          });
      }
    },
    submitDo() {
      this.isOver = true;
      this.isSubmit = true;
      let d = new Date().getTime();
      this.addNew({
        time: d,
        g: this.grade
      });
      let ks = JSON.parse(localStorage.getItem("ks"));
      let c = ks.filter(r => {
        return r.g > this.grade || (r.g === this.grade && r.time < d);
      });
      this.pCount = ks.length;
      this.ranking = c.length;
    },
    addNew(item) {
      let ks = localStorage.getItem("ks");
      if (ks) {
        ks = JSON.parse(ks);
      } else {
        ks = [];
      }
      ks.push(item);
      localStorage.setItem("ks", JSON.stringify(ks));
    },
    replay() {
      this.list = [];
      this.cur = 0;
      this.getData();
      this.isSubmit = false;
      this.isOver = false;
    }
  }
};
</script>
<style lang="less">
.esa {
  background-image: url("/img/bg.png");
  min-height: 100%;
  width: 100%;
  background-attachment: fixed;

  .content {
    width: 960px;
    background-color: #fff;
    min-height: 100%;
    margin: 0 auto;
    padding-top: 30px;
    color: #000;
    box-sizing: border-box;
    font-size: 20px;

    .da {
      display: block;
      text-align: center;
      padding-top: 10px;

      &.d1 {
        padding-top: 100px;
      }
    }

    .title {
      font-size: 24px;
      padding: 20px 60px;

      .bt {
        color: #f00;
        font-size: 44px;
        margin: 0 auto 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "华文行楷";
        font-weight: bold;

        i {
          display: block;
          background-image: url("/img/dh.jpg");
          background-size: contain;
          background-repeat: no-repeat;
          width: 1.5em;
          height: 1.5em;
        }
      }

      .time {
        font-size: 20px;
        float: right;
      }

      &:after {
        content: "";
        clear: both;
        display: block;
      }
    }

    ul {
      margin: 0;
      padding: 40px 0 0;
      list-style: none;
      margin: 0 60px;
      font-size: 24px;

      li {
        strong {
          font-weight: 400;
          color: #000;
        }

        ul {
          margin: 40px 0 20px 50px;
          color: #666;

          li {
            display: flex;
            align-items: center;

            input {
              width: 20px;
              height: 20px;
              margin: 0 10px 0 0;
              padding: 0;
              position: relative;
              top: 3px;
            }

            label {
              display: block;
              width: 100%;
              padding: 15px 0;
            }
          }
        }

        &.submit {
          &.err,
          &.empty {
            display: block;

            ul {
              li.check {
                color: rgba(255, 0, 0, 0.5);
              }
            }
          }
        }

        &:last-of-type {
          ul {
            margin-bottom: 0;
          }
        }
      }
    }

    button {
      display: block;
      margin: 40px auto 0;
      font-size: 24px;
      padding: 10px 30px;
    }

    .realp {
      border: 1px solid #0f0;
      background-color: rgba(0, 255, 0, 0.1);
      padding: 30px 70px;
      width: 690px;
      margin: 40px auto 0;

      strong {
        padding-right: 20px;
        color: #0a0;
      }

      .success {
        font-weight: 600;
        text-align: center;
        display: block;
        color: #0a0;
      }
    }
  }
}

.el-message-box__wrapper {
  .el-message-box {
    width: 20em;
    font-size: 30px;

    .el-message-box__title {
      font-size: 0.8em;
    }

    .el-message-box__content {
      font-size: 0.7em;
    }

    .el-button {
      font-size: 0.7em;

      &:hover {
        background-color: rgba(255, 0, 0, 0.3);
        border-color: #f00;
        color: #f00;
      }

      &.el-button--primary {
        background-color: rgba(255, 0, 0, 0.8);
        border-color: #f00;

        &:hover {
          background-color: rgba(255, 0, 0, 1);
          color: #fff;
        }
      }
    }
  }
}
</style>
