<template>
	<div>
		<h1>Main page</h1>
		<div v-if="state === 0">
			<input v-model="username" type="text" placeholder="Имя">
			<button @click="login">Полетели</button>
		</div>
		<div v-if="state === 1">
			<button @click="scan">Сканировать</button>
		</div>
		<div v-if="state === 2">
			<qrcode-stream @decode="onDecode"></qrcode-stream>
		</div>
	</div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader';
import { mapGetters } from 'vuex';

export default {
	name: 'index',
	components: {
		QrcodeStream
	},
	computed: {
		...mapGetters(['isAuth', 'getName'])
	},
	data() {
		return {
			state: localStorage.name ? 1 : 0,
			username: localStorage.name
		}
	},
	methods: {
		async login() {
			const { status, hash } = await this.$axios.$post('/registration', {username: this.username});
			if (status !== 'OK') return;

			this.$store.commit('auth', {username: this.username, hash});
			this.state = 1;
		},

		scan() {
			this.state = 2;
		},

		onDecode (decodedString) {
			console.log(decodedString);
			this.state = 1;
		}
	}
};
</script>

<style scoped>

</style>