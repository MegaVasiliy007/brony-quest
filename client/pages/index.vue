<template>
  <main>
      <!--  Auth  -->
      <div v-if="state === 0" class="authorization">
        <h1 class="authorization__title">Собери команду</h1>
        <form class="authorization__form form">
          <label class="form__label">
            <span class="srOnly">Введите ваше имя</span>
            <input v-model="username" type="text" placeholder="Имя" class="form__input">
          </label>
          <button @click.prevent="login" class="authorization__button">Полетели</button>
        </form>
      </div>

      <!--  Scan  -->
      <div v-if="state === 1" class="collection">
        <h1 class="srOnly">Ваш профиль</h1>
        <div class="collection__head">
          <p class="collection__name">{{ username }}</p>
          <img src="/images/collectBg.png" alt="">
        </div>
        <button @click="scan" class="collection__scanButton">Сканировать код</button>
        <button @click="" class="collection__helpButton">Помощь</button>

        <section class="collection__team team">
          <h2 class="team__title">Ваша команда</h2>
          <ul class="team__list">
            <li v-for="i in tasks.all" class="team__item">
              <img v-if="tasks.complete.indexOf(i) > -1" :src="`/images/${i}.jpg`" alt=""/>
              <img v-if="tasks.failed.indexOf(i) > -1" src="/images/inaccessible.jpg" alt=""/>
            </li>
          </ul>
        </section>
      </div>

      <!--  Qrcode  -->
      <div v-if="state === 2">
        <qrcode-capture @decode="onDecode"></qrcode-capture>
      </div>
  </main>
</template>

<script>
import { QrcodeStream, QrcodeCapture } from 'vue-qrcode-reader';
import { mapGetters } from 'vuex';

export default {
	name: 'index',
	components: {
		QrcodeStream,
		QrcodeCapture
	},
	computed: {
		...mapGetters(['isAuth', 'getName'])
	},
	async asyncData({ $axios }) {
		let tasks = {};
		if (localStorage.name)
			tasks = await $axios.$get('/sync');

		return {
			state: localStorage.name ? 1 : 0,
			username: localStorage.name,
			tasks
		}
	},
	methods: {
		async login() {
			if (this.isAuth) return;

			const { status, hash } = await this.$axios.$post('/registration', {username: this.username});
			if (status !== 'OK') return;

			this.$store.commit('auth', {username: this.username, hash});
			this.state = 1;
		},

		scan() {
			this.state = 2;
		},

		async onDecode (hash) {
			console.log(hash);
			const { status, question } = await this.$axios.$post('/scan', {hash});
			if (status !== 'OK') return;

			console.log(question);
			this.state = 1;
		}
	}
};
</script>

<style scoped>
  .authorization {
    padding-top: calc(10% + 294px + 4%);
    padding-bottom: 100px;
    background-image: url('/images/authBg.png');
    background-size: 100% 294px;
    background-position: center 10%;
    background-repeat: no-repeat;
  }

  .authorization__title {
    margin-bottom: 48px;
  }

  .authorization__button {
    margin-top: 16px;
  }

  /* Collection */
  .collection__head {
    display: grid;
    justify-items: center;
  }

  .collection__name {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding-top: 24px;
    padding-bottom: 32px;
    font-family: var(--equestria);
    font-size: 32px;
    text-align: center;
    background: linear-gradient(180deg, rgba(242, 153, 74, 0.5) 0%, rgba(242, 153, 74, 0) 100%);
  }

  .collection__scanButton {
    margin-top: 24px;
    box-shadow: 2px 4px 6px rgba(221, 34, 214, 0.25);
  }

  .collection__helpButton {
    margin-top: 8px;
    padding: 0;
    background: none;
    box-shadow: none;
  }

  .collection__team {
    margin: 32px 0;
  }

  .team__title {
    margin-bottom: 16px;
    font-family: var(--equestria);
    font-size: 26px;
    font-weight: 400;
  }

  .team__list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 10px;
    flex-wrap: wrap;
  }

  .team__item {
    display: flex;
    border-radius: 50%;
    overflow: hidden;
  }
</style>
