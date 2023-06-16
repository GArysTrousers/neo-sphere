<script lang="ts">
	import { user } from '$lib/stores';
	import LoginForm from '$comp/auth/LoginForm.svelte';
	import { logout } from '$lib/auth';

	import { page } from '$app/stores';

	let links = [
		{
			url: '/',
			pattern: '^/$',
			label: 'Nodes'
		},
		{
			url: '/jobs',
			pattern: '^/jobs',
			label: 'Jobs'
		}
	];

	function isThisPage(pattern: string, page: string) {
		return page.match(pattern) ? true : false;
	}
</script>

<svelte:head>
	<title>NeoSphere</title>
</svelte:head>

{#if $user}
	<div
		class="flex-row justify-center bg-gradient-to-r from-green-500 to-purple-500 border-b-2 border-white"
	>
		<div class="grid grid-cols-3 max-w-5xl w-full">
			<div class="w-full text-3xl font-title px-5 py-2">neoSphere</div>
			<div class="grid grid-cols-2 justify-center gap-1 p-1 my-1 rounded-lg bg-transblack">
				{#each links as link}
					<a
						class={`nav-link ${isThisPage(link.pattern, $page.url.pathname) ? ' active' : ''}`}
						href={link.url}
					>
						<span class="nav-link-text">{link.label}</span>
					</a>
				{/each}
			</div>
			<div class="flex-row justify-end gap-3 px-3">
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

<style>
	.bg-transblack {
		background: rgba(0, 0, 0, 0.3);
	}
	.nav-link {
    transition: background-color 0.3s ease-out, color 0.5s ease-out;
		@apply flex flex-row justify-center items-center rounded-lg;
	}
	.nav-link.active {
		@apply bg-white text-black;
	}
</style>
