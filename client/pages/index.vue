<template>
  <main class="main">
    <!--  Auth  -->
    <div v-if="page === 0" class="authorization">
      <h1 class="authorization__title">Собери команду</h1>
      <form class="authorization__form form">
        <label>
          <span class="srOnly">Введите ваше имя</span>
          <input v-model="username" type="text" placeholder="Имя" class="form__input">
        </label>
        <button @click.prevent="login" class="authorization__button">Полетели</button>
      </form>
    </div>

    <!--  Scan  -->
    <div v-if="page === 1" class="collection">
      <h1 class="srOnly">Ваш профиль</h1>
      <div class="collection__head">
        <p class="collection__name">{{ username }}</p>
        <img src="~static/images/collectBg.png" alt="">
      </div>
      <button @click="scan" class="collection__scanButton">Сканировать код</button>
      <button @click="help" class="collection__helpButton">Помощь</button>

      <section class="collection__team team">
        <h2 class="team__title">Ваша команда</h2>
        <ul class="team__list">
          <li v-for="i in tasks.all" class="team__item">
            <img v-if="tasks.complete.indexOf(i-1) > -1" :src="`/images/${i-1}.jpg`" alt=""/>
            <img v-if="tasks.failed.indexOf(i-1) > -1" src="/images/inaccessible.jpg" alt=""/>
          </li>
        </ul>
      </section>
    </div>

    <!--  Qrcode  -->
    <div v-if="page === 2" class="camera">
      <qrcode-stream @decode="onDecode"></qrcode-stream>
    </div>

    <modal name="question"
           :scrollable="true"
           :clickToClose="false"
           :focusTrap="true"
           :adaptive="true"
           :maxWidth="320"
           height="auto"
           classes="modal"
    >
      <form class="modal__form form">
        <p v-if="question.text" v-html="question.text" class="modal__question"/>
        <img v-if="question.image" :src="question.image" alt="" class="modal__image">

        <div v-if="question.text">
          <ul v-if="questionHasVariants">
            <li v-for="variant of question.variants" class="modal__option option">
              <label class="check">
                <input v-model="answer" type="radio" name="question" :value="variant" class="check__input">
                <span class="check__box"/>
                <span v-html="variant" class="option__text"/>
              </label>
            </li>
          </ul>

          <input v-else v-model="answer" type="text" class="modal__input form__input" placeholder="Ответ">

          <button @click.prevent="sendAnswer" class="modal__button">Отправить</button>
        </div>
        <div v-else>
          <button @click.prevent="closeImage" class="modal__button">Закрыть</button>
        </div>
      </form>
    </modal>

    <modal name="right-ans" :adaptive="true" :maxWidth="320" classes="modal modal_alert modal_right">
      <p>ya got</p>
      <p class="modal__rightName">{{ question.character }}</p>
    </modal>

    <modal name="fail-ans" :adaptive="true" :maxWidth="320" classes="modal modal_alert modal_fail">
      <p>Сорри...</p>
      <img src="~static/images/answer_fail.png" alt="" class="modal__failImage">
    </modal>

    <modal name="help" :adaptive="true" :maxWidth="320" height="auto" classes="modal">
      <p>Привет! Найди на территории фестиваля 7 QR-кодов и, кажется, Духи Рождества тоже что-то знают. Выполни задания. Постарайся отвечать правильно, не подсказывай другим и не используй чужие подсказки. После выполнения всех заданий на инфостенде тебя ждёт приз.</p>
    </modal>

    <modal name="exit" :scrollable="true" :clickToClose="false" height="auto" :focusTrap="true" :adaptive="true" :maxWidth="320"
           classes="modal modal_alert modal_exit">
      <p align="center">Выполнено заданий: {{ tasks.complete.length }}/7<br>{{ exitInfo }}</p>
    </modal>

    <modal name="already-scan" :adaptive="true" :maxWidth="320" classes="modal modal_alert modal_exit">
      <p align="center">Ты уже находил этот QR-код</p>
    </modal>
  </main>
</template>

<script>
import {QrcodeStream} from 'vue-qrcode-reader';
import {mapGetters} from 'vuex';

export default {
  name: 'index',
  components: {
    QrcodeStream
  },
  computed: {
    ...mapGetters(['isAuth', 'getName']),
    questionHasVariants() {
      return this.question.variants && this.question.variants.length;
    },
    exitInfo() {
      return `Забери ${this.tasks.failed.length > 1 ? 'утешительный ' : ''}приз на инфостенде!`;
    }
  },
  watch: {
    tasks: {
      deep: true,
      handler() {
        if (this.tasks.all > 6) {
          this.$modal.show('exit');
        }
      }
    }
  },
  async asyncData({$axios}) {
    let tasks = {tasks: {all: 0, complete: [], failed: []}};
    if (localStorage.name)
      tasks = await $axios.$get('/sync');

    tasks = tasks.tasks;

    return {
      page: localStorage.name ? 1 : 0,
      username: localStorage.name,
      tasks,
      question: {},
      answer: '',
      hash: null,
      step: false
    }
  },
  mounted() {
    if (this.tasks.all > 6) {
      this.$modal.show('exit');
    }
  },
  methods: {
    async login() {
      if (this.isAuth) return;

      const {status, hash} = await this.$axios.$post('/registration', {username: this.username});
      if (status !== 'OK') return;

      this.$store.commit('auth', {username: this.username, hash});
      this.page = 1;
    },

    scan() {
      this.page = 2;
    },

    help() {
      this.$modal.show('help');
    },

    async onDecode(hash) {
      const {status, question} = await this.$axios.$post('/scan', {hash});
      this.page = 1;

      if (status !== 'OK') {
        this.$modal.show('already-scan');
        return;
      }

      console.log(question);
      this.question = question;
      this.answer = this.question.variants[0];
      this.hash = hash;
      this.step = false;
      this.$modal.show('question');
    },

    async sendAnswer() {
      const {status: statusAns} = await this.$axios.$post('/check', {hash: this.hash, answer: this.answer.trim()});

      if (statusAns === 'OK') {
        this.tasks.complete.push(this.tasks.all++);
        this.$modal.hide('question');
        this.$modal.show('right-ans');
        return;
      }

      this.$modal.show('fail-ans');

      if (this.step) {
        this.$modal.hide('question');
        this.tasks.failed.push(this.tasks.all++);
        return;
      }

      const {status, question} = await this.$axios.$post('/scan', {hash: this.hash});
      if (status !== 'OK') return;

      this.question = question;
      this.answer = this.question.variants[0];
      this.step = true;
    },
    closeImage() {
      this.tasks.complete.push(this.tasks.all++);
      this.$modal.hide('question');
      this.$modal.show('right-ans');
    }
  }
};
</script>

<style>
.main {
  margin: auto;
}

.authorization {
  padding-top: calc(10% + 294px + 4%);
  padding-bottom: 100px;
  background-image: url('~static/images/authBg.png');
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

/* Modals */
.vm--overlay {
  background: #F2994A;
  opacity: 0.6;
}

.modal {
  padding: 16px;
  border-radius: 20px;
  color: var(--color-gray1);
}

.modal_alert {
  display: flex;
  align-items: center;
  padding: 24px 10px 24px 32px;
  font-family: var(--equestria);
  font-size: 58px;
  color: #fff;
}

.modal_exit {
  padding: 8px;
  font-size: 50px;
  color: var(--color-gray1) !important;
}

.modal_fail {
  background: linear-gradient(91.88deg, rgba(247, 22, 22, 0.7) -11.44%, rgba(146, 13, 13, 0.7) 106.2%), #C26FCF;
}

.modal__failImage {
  position: absolute;
  width: 201px;
  right: 10px;
}

.modal_right {
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 24px;
  background: linear-gradient(91.88deg, rgba(94, 163, 41, 0.7) -11.44%, rgba(186, 217, 0, 0.7) 106.2%), #3CB328;
}

.modal__rightName {
  margin-top: 16px;
  font-size: 50px;
  line-height: 1;
}

.modal__question {
  font-family: var(--equestria);
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
}

.modal__question a {
  color: #7C29A3;
}

.modal__image {
  margin-bottom: 24px;
  border-radius: 5px;
}

.modal__option + .modal__option {
  margin-top: 12px;
}

.check {
  padding-left: 1.2em;
}

.check__input {
  position: absolute;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.check__box {
  position: absolute;
  margin-top: 4px;
  margin-left: -20px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: inset 1px 1px 5px rgba(212, 64, 219, 0.5);
}

.check__input:checked + .check__box:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 8px;
  height: 8px;
  margin: auto;
  border-radius: 50%;
  background-color: #E57CEA;
}

.modal__input {
  background: linear-gradient(91.88deg, rgba(124, 41, 163, 0.4) -11.44%, rgba(212, 0, 217, 0.4) 106.2%);
}

.modal__button {
  margin-top: 16px;
}

.camera {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh - 50px);
  z-index: 1000;
}
</style>
