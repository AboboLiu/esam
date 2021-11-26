<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
* {
  transition: all 0.1s;
}
html,
body,
#app {
  user-select: none;
  margin: 0;
  padding: 0;
  width: 100%;
  font-family: "微软雅黑";
  overflow-x: hidden;

  .nav {
    cursor: pointer;
    position: fixed;
    right: 40px;
    top: 40px;
    font-size: 18px;
    display: block;
    padding: 10px 20px;
    border-radius: 6px;
    background-color: #fff;
    color: #666;
    font-weight: 400;
  }

  .back {
    cursor: pointer;
    position: fixed;
    left: 40px;
    top: 40px;
    display: block;
    width: 64px;
    height: 64px;
    background-image: url("/img/back.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
}

::-webkit-scrollbar {
  display: none;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.8);
}

::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
