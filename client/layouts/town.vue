<template>
  <div class="page__body--town container">
    <nuxt/>
    <footer class="footer">
      <p>Powered by <a href="https://vare.pw" target="_blank" rel="noopener">VaRe</a><br>For <a href="https://vk.com/katushiny_posidelki" target="_blank" rel="noopener">Катюшины Посиделки</a></p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'town',
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  },
  mounted() {
    if (localStorage.name)
      this.$store.commit('auth', {username: localStorage.name, hash: localStorage.hash});
  }
};
</script>

// Global styles
<style>
.page__body--town {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font: normal 16px/132% var(--roboto);
  color: #fff;
  word-break: break-word;
  overflow-x: hidden;
  background: #F5F1CF;
}
</style>
