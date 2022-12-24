<template>
  <div class="page__body container">
    <nuxt/>
    <footer class="footer">
      <p>Powered by <a href="https://vare.pw" target="_blank" rel="noopener">VaRe</a><br>For <a href="https://vk.com/katushiny_posidelki" target="_blank" rel="noopener">Катюшины Посиделки</a></p>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'default',
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
:root {
  /* Colors */
  --color-gray1: #333;

  /* Fonts */
  --equestria: 'Equestria', serif;
  --roboto:    'Roboto', 'Arial', sans-serif;

  /* Other */
  --container-width: 340px;
}

* {
  margin: 0;
  padding: 0;
  line-height: 1.32;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.page__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font: normal 16px/132% var(--roboto);
  color: #fff;
  word-break: break-word;
  overflow-x: hidden;
  background: linear-gradient(168.75deg, #F6F3B0 10.76%, #E99557 65.82%, #E15D51 95.82%);
}

main {
  margin: auto;
}

ul {
  list-style: none;
}

a {
  color: #fff;
  border-bottom: 1px solid #fff;
  text-decoration: none;
}

a:hover {
  color: #7C29A3;
  border-color: #7C29A3;
}

h1 {
  font-family: var(--equestria);
  font-size: 48px;
  font-weight: 400;
}

button,
.button {
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  padding: 17px 0;
  text-align: center;
  font-family: var(--equestria);
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: 50px;
  background: linear-gradient(91.88deg, rgba(124, 41, 163, 0.7) -11.44%, rgba(212, 0, 217, 0.7) 106.2%);
  box-shadow: 2px 4px 6px rgba(221, 34, 214, 0.25);
}

svg {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.icon {
  fill: var(--color-gray1);
}

img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center;
}

.container{
  padding-left:  calc(50% - var(--container-width) / 2) !important;
  padding-right: calc(50% - var(--container-width) / 2) !important;
}

.srOnly {
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  word-wrap: normal !important;
}

.fixed {
  overflow: hidden;
}

/* Forms */
.form__input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  color: #fff;
  border: none;
  border-radius: 50px;
  background: linear-gradient(91.88deg, rgba(124, 41, 163, 0.4) -11.44%, rgba(212, 0, 217, 0.4) 106.2%);
  box-shadow: inset 2px 4px 6px rgba(0, 0, 0, 0.25);
}

.form__input::placeholder {
  padding-bottom: 4px;
  border-bottom: 1px solid #fff;
  color: #fff;
}

.form__input:focus {
  outline: none;
}


.footer {
  margin: 16px 0;
}
</style>

// Fonts
<style>
/* Equestria-regular */
@font-face {
  font-display: swap;
  font-family: 'Equestria';
  font-style: normal;
  font-weight: 400;
  src: local(''),
  url('~static/fonts/Equestria.woff2') format('woff2'),
  url('~static/fonts/Equestria.woff') format('woff');
}

/* Roboto-regular */
@font-face {
  font-display: swap;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto'), local('Roboto-Regular'),
  url('~static/fonts/roboto-v20-latin_cyrillic-regular.woff2') format('woff2'),
  url('~static/fonts/roboto-v20-latin_cyrillic-regular.woff') format('woff');
}
</style>
