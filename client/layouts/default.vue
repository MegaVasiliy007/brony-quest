<template>
	<div>
		<nuxt/>
	</div>
</template>

<script>
export default {
	name: 'default',
	mounted() {
		if (localStorage.name)
			this.$store.commit('auth', {username: localStorage.name, hash: localStorage.hash});
	}
};
</script>

<style scoped>

</style>