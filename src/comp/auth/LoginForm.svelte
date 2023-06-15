<script lang="ts">
	import { user } from '$lib/stores';
	import { login, logout, signUp } from '$lib/auth';
	let username: string;
	let password: string;
	function keypressLogin(e: KeyboardEvent) {
		if (e.key == 'Enter') login(username, password);
	}
</script>

<div class="flex-col flex-center rounded-2xl p-5 mt-10 bg-gradient-to-br from-green-500 to-purple-500">
  <div class="w-full text-center font-japanese text-lg">ネオスフィア</div>
	<div class="w-full text-center text-4xl font-title mb-6">neoSphere</div>
	<div class="flex-col justify-center items-center gap-3 w-full">
		{#if $user}
			<div class="text-2xl flex-row gap-3">
				Signed in as {$user.username}
				<button class="btn" on:click={logout}>Logout</button>
			</div>
		{:else}
			<input class="w-full input" bind:value={username} />
			<input class="w-full input" bind:value={password} type="password" on:keypress={keypressLogin} />
			<button class="btn" on:click={() => login(username, password)}>Login</button>
		{/if}
	</div>
</div>

<style>
</style>
