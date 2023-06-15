<script lang="ts">
	import { user } from '$lib/stores';
	import LoginForm from '$comp/auth/LoginForm.svelte';
	import { logout } from '$lib/auth';
</script>

<svelte:head>
	<title>NeoSphere</title>
</svelte:head>

{#if $user}
<div class="flex-row justify-center bg-gradient-to-r from-green-500 to-purple-500 border-b-2 border-white">
  <div class="flex-row justify-between max-w-5xl w-full">
  <div class="w-full text-3xl font-title px-5 py-2">neoSphere</div>
  <div class="flex-row gap-3 px-3">
    <button class="btn my-auto" on:click={logout}>Logout</button>
  </div>
</div>
</div>
	<slot />
{:else}
	<div class="m-3 flex-col justify-center items-center">
		<div class="max-w-xs w-full">
			<LoginForm />
		</div>
	</div>
{/if}
