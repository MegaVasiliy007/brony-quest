<template>
  <main class="main-town">
    <template v-if="pageState !== -1">
    <h2>Ты в команде - {{ getCommandName }}</h2>

    <h3 align="center">Пройдено {{ getPoints.length - 1 }} из {{ getAllCount }} заданий!</h3>

    <br>

    <hr>

    <ul>
      <li
        class="point-ul__li"
        v-for="index in getAllCount"
        :key="index"
        @click="showQuestion(index)"
        :class="{ 'point-ul__li--checked': pointIsComplete(index - 1), 'point-ul__li--failed': pointIsFailed(index - 1) }"
      >
        <span class="point-ul__index">{{ index }}.</span>

        <p class="point-ul__text">
          {{ typeof getPoints[index - 1] !== 'undefined' ? getPoints[index - 1].name : '' }}
        </p>
      </li>
    </ul>
    </template>

    <modal
      name="question"
      :scrollable="true"
      :clickToClose="true"
      :focusTrap="true"
      :adaptive="true"
      :shiftY="0"
      :shiftX="0"
      :reset="true"
      width="100vw"
      height="auto"
      classes="modal"
    >
      <form class="modal__form form">
        <p v-if="question.question" v-html="question.question" class="modal__question"/>
        <img v-if="question.image" :src="question.image" alt="" class="modal__image">

        <p v-if="!question.question && !question.image" class="modal__question">
          Открыта следующая точка маршрута!
        </p>

        <div v-if="question.question">
          <ul v-if="question.variants.length > 0">
            <li v-for="variant of question.variants" class="modal__option option">
              <label class="check">
                <input v-model="answer" type="radio" name="question" :value="variant" class="check__input">
                <span class="check__box"/>
                <span v-html="variant" class="option__text"/>
              </label>
            </li>
          </ul>

          <input v-else v-model="answer" type="text" class="modal__input form__input" placeholder="Ответ">

          <button @click.prevent="checkPoint" class="modal__button">Отправить</button>
        </div>

        <div v-else-if="question.image">
          <button @click.prevent="closeImage" class="modal__button">Закрыть</button>
        </div>

        <div v-else>
          <button @click.prevent="checkPoint" class="modal__button">Полетели дальше!</button>
        </div>
      </form>
    </modal>

    <modal
      name="right-ans"
      :adaptive="true"
      :shiftY="0"
      :shiftX="0"
      width="100vw"
      :reset="true"
      classes="modal modal_alert modal_right">
      <p>ya got</p>
    </modal>

    <modal
      name="fail-ans"
      :adaptive="true"
      :shiftY="0"
      :shiftX="0"
      width="100vw"
      :reset="true"
      classes="modal modal_alert modal_fail">
      <p>Сори...</p>
      <img src="~static/images/answer_fail.png" alt="" class="modal__failImage">
    </modal>

    <modal
      name="help"
      :adaptive="true"
      :shiftY="0"
      :shiftX="0"
      :scrollable="true"
      :reset="true"
      height="auto"
      width="100vw"
      classes="modal">
      <p style="white-space: pre-line">
        Привет! И добро пожаловать на наш квест.
        Тебе в составе твоей команды предстоит выполнить все наши задания и пройти весь путь от начала до конца. Нужно будет пройти весь Вечнозелёный лес и найти Сноуфолл Фрост, используя наши подсказки.
        Ориентировочное время всего маршрута составит 1,5 - 2 часа. Задача команды собрать как можно больше баллов.
        Важный момент — вся команда проходит одно задание одновременно, они синхронизированы.

        Для прохождения точки необходимо нажать на элемент в списке и ответить на вопрос, если он есть.

        Ознакомиться повторно с этой информацией можно нажав на кнопку помощь внизу страницы.
        По всем вопросам — <a style="color: black;" href="tel:+79912970870">+79912970870</a>
        <br>
        <button @click.prevent="$modal.hide('help')" class="modal__button">Закрыть</button>
      </p>
    </modal>

    <modal
      name="qr-error"
      height="auto"
      :scrollable="true"
      :clickToClose="false"
      :focusTrap="true"
      :adaptive="true"
      :shiftY="0"
      :shiftX="0"
      :reset="true"
      width="100vw"
      classes="modal modal_alert modal_error">
      <p align="center">
        QR-Код сломался!
        <br>
        Обратитесь, пожалуйста, к администраторам!
      </p>
    </modal>

    <modal
      name="auth-error"
      height="auto"
      :scrollable="true"
      :clickToClose="false"
      :focusTrap="true"
      :adaptive="true"
      :shiftY="0"
      :shiftX="0"
      :reset="true"
      width="100vw"
      classes="modal modal_alert modal_error">
      <p align="center">
        Ошибка авторизации!
        <br>
        Обратитесь, пожалуйста, к администраторам!
      </p>
    </modal>

    <button @click="help" class="modal__button">Помощь</button>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'town',

  layout: 'town',

  data: () => ({
    credentials: {
      login: undefined,
      password: undefined,
    },

    question: {},
    questionIndex: null,

    answer: '',

    pageState: 0, //-1 - Ошибка;
  }),

  computed: {
    ...mapGetters(
        'town',
        ['isTownQuestAuthOk', 'getPoints', 'getCommandName', 'pointIsComplete', 'pointIsFailed', 'getAllCount', 'lastHandshakeIsNotValid']
    ),
  },

  async mounted() {
    this.credentials.login = this.$route.query?.login || localStorage.getItem('login');
    this.credentials.password = this.$route.query?.password || localStorage.getItem('password');

    if (
        (typeof this.$route.query?.login === 'undefined' || typeof this.$route.query?.password === 'undefined') &&
        (typeof this.credentials.login === 'undefined' || typeof this.credentials.password === 'undefined')
    ) { // Ошибка куара
      this.pageState = -1;
      this.$modal.show('qr-error');

      return;
    }

    if (typeof this.$route.query?.login !== 'undefined' && typeof this.$route.query?.password !== 'undefined') { // Первый заход
      this.$modal.show('help');
      await this.$router.replace({ 'query': null });
    }

    await this.doAuth(this.credentials);

    if (!this.isTownQuestAuthOk) { // Ошибка авторизации
      this.pageState = -1;
      this.$modal.show('auth-error');

      return;
    }

    this.startPollingPoints();

    this.$store.commit('town/updateLastHandshake');
    this.initHeartbeat();
  },

  methods: {
    ...mapActions('town', ['doAuth', 'postAnswer', 'startPollingPoints']),

    showQuestion(index) {
      if (this.pointIsComplete(index - 1)
          || this.pointIsFailed(index - 1)
          || typeof this.getPoints[index - 1]?.name === 'undefined') {
        return
      }

      this.question = this.getPoints[index - 1];
      this.$modal.show('question');
    },

    async checkPoint() {
      const result = await this.postAnswer(this.answer.toLocaleLowerCase().trim());
      this.answer = '';

      if (result === 'OK') {
        this.$modal.show('right-ans');
      } else if (result === 'error') {
        this.$modal.show('fail-ans');
      } else {
        window.location.reload();
      }

      this.$modal.hide('question');
    },

    help() {
      this.$modal.show('help');
    },

    initHeartbeat() {
      setTimeout(() => {
        if (this.lastHandshakeIsNotValid) window.location.reload();
        else this.initHeartbeat();

        this.$store.commit('town/updateLastHandshake');
      }, 7000)
    },
  }
};
</script>

<style scoped>
.main-town {
  width: 100%;
  color: #695D41;
}

h2 {
  text-align: center;
  padding: 10px 0;
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
.point-ul__li {
  font-size: 20px;
  display: grid;
  grid-template-columns: 50px auto;
  margin: 15px 0;
  padding: 5px 0;
  position: relative;
  border-radius: 10px;
}
.point-ul__index {
  font-family: var(--equestria);
  text-align: center;
  font-size: 40px;
  align-self: center;
}
.point-ul__text {
  text-decoration: underline;
}
.point-ul__li--checked,
.point-ul__li--failed {
  color: #695D4150;
}
.point-ul__li--checked {
  background: #3CB328;
}
.point-ul__li--checked::after {
  content: '✅️';
  color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
}
.point-ul__li--failed {
  background: #E15D51;
}
.point-ul__li--failed::after {
  content: '❌️';
  color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
}
</style>
