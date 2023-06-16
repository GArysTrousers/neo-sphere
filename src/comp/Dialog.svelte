<script lang="ts">
	import { faMultiply } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';

	export let dialog: HTMLDialogElement;
	export let title = '';

	function backdropClose(event: MouseEvent) {
		var rect = dialog.getBoundingClientRect();
		var isInDialog =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;
		if (!isInDialog) {
			dialog.close();
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog bind:this={dialog} on:click={backdropClose}>
	<div class="flex-col gap-3">
		<div class="flex-row justify-between items-baseline gap-4">
			<div class="text-xl">{title}</div>
			<button class="btn" on:click={() => dialog.close()}><Fa icon={faMultiply} /></button>
		</div>
		<slot />
	</div>
</dialog>

<style>
	dialog {
		@apply text-white bg-gray-700 rounded-2xl;
	}
</style>
