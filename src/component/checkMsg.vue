<template>
  <div class="msg-bg" v-if="isShow">
    <div class="msg">
      <p v-text="txt"></p>
      <div class="btns">
        <span class="btn" @click="ok">确定</span>
        <span class="btn" @click="hide">取消</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["msg"],
  data() {
    return {
      isShow: false,
      txt: ""
    };
  },
  methods: {
    show(txt) {
      this.txt = txt;
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    ok() {
      this.$emit("ok");
      this.hide();
    }
  }
};
</script>
<style scoped lang="scss">
.msg-bg {
  /* background-color: rgba(0, 0, 0, 0.5); */
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .msg {
    color: #fff;
    flex-direction: column;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.8);
    min-width: 400px;
    min-height: 30vh;
    display: flex;
    p {
      flex-grow: 1000;
      padding: 10px 20px;
    }
    .btns {
      display: flex;
      .btn {
        width: 50%;
        text-align: center;
        border-top: 1px solid #fff;
        padding: 1em;
        & + .btn {
          border-left: 1px solid #fff;
        }
        &:active {
          background-color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }
}
</style>