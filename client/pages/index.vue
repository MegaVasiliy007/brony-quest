<template>
	<div>
		<h1>Main page</h1>
		<div v-if="state === 0">
			<input v-model="username" type="text" placeholder="Имя">
			<button @click="login">Полетели</button>
		</div>
		<div v-if="state === 1">
			<p>{{ username }}</p>
			<button @click="scan">Сканировать</button>
			<div>
				<p>Команда:</p>
				<div v-for="i in tasks.all">
					<span v-if="tasks.complete.indexOf(i) > -1">+</span>
					<span v-if="tasks.failed.indexOf(i) > -1">-</span>
				</div>
			</div>
		</div>
		<div v-if="state === 2">
			<qrcode-capture @decode="onDecode"></qrcode-capture>
		</div>
	</div>
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
		let tasks;
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

</style>