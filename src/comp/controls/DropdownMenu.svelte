<script lang="ts">
	import { faBars, faMultiply } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';

	export let openIcon = faMultiply;
	export let icon = faBars;
	export let title = 'Menu';
	let clazz = '';
	export { clazz as class };

	let isDropdownOpen = false;

	const handleDropdownClick = () => {
		isDropdownOpen = !isDropdownOpen;
	};

	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }: any) => {
		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return;
		isDropdownOpen = false;
	};
</script>

<div class="flex justify-between items-center z-10">
	<div class="flex-col items-end" on:focusout={handleDropdownFocusLoss}>
		<button class={clazz} on:click={handleDropdownClick}>
			<Fa {icon} />
		</button>
		<div
			class="dropdown shadow-lg shadow-black"
			style:visibility={isDropdownOpen ? 'visible' : 'hidden'}>
			<div class="text-center text-neutral-500 border-b border-neutral-300">{title}</div>
			<div class="dropdown-items-list">
				<slot />
			</div>
		</div>
	</div>
</div>

<style>
	.dropdown {
		@apply fixed bg-white rounded text-black p-1 pt-2;
	}
	.dropdown-items-list {
		@apply flex flex-col gap-1 pt-1;
	}
	.dropdown-items-list > :global(*) {
		@apply px-4 py-1 bg-white rounded flex flex-row items-center gap-1;
	}
	.dropdown-items-list > :global(*):hover {
		@apply brightness-90;
	}
</style>
