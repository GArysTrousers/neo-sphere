<script lang="ts">
	import { pb } from '$lib/stores';
	import type { ComputeNode } from '$types/db';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
	import { fly } from 'svelte/transition';

	let nodes: ComputeNode[] = [];
	let nodeStatus = new Map<string, string>();
	let socket: WebSocket;

	onMount(async () => {
		nodes = await pb.collection('nodes').getFullList();
		nodeStatus = new Map<string, string>(nodes.map((v) => [v.serial, 'Connecting...']));
		await delay(2000);
		socket = new WebSocket('ws://localhost:8088');
		socket.onmessage = onSocketMessage;
		socket.onopen = onMasterConnect;
	});

	function onMasterConnect() {
		socket.send(
			JSON.stringify({
				type: 'master-connect'
			})
		);
	}

	async function onSocketMessage(message: MessageEvent<any>) {
		let data = JSON.parse(await message.data.text());
		console.log(data);
		if (data.type == 'worker-update') {
			nodeStatus.set(data.from, data.status);
			nodeStatus = nodeStatus;
		} else if (data.type == 'workers-status') {
			nodeStatus = new Map<string, string>(data.workers);
		}
	}

	const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
</script>

<div class="flex-col items-center p-3">
	<div class="flex-col gap-3 max-w-2xl w-full border-2 border-white px-5 py-4 rounded-lg">
		<h2 class="font-header text-3xl">Nodes</h2>
		<table>
			<col width="20%" />
			<col width="20%" />
			<col width="20%" />
			<col width="20%" />
			<col width="20%" />
			<thead>
				<tr>
					<th>Serial</th>
					<th>Brand</th>
					<th>Model</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each nodes as node}
					<tr>
						<td>{node.serial}</td>
						<td>{node.manufacturer}</td>
						<td>{node.model}</td>
						<td>
							{#key nodeStatus.get(node.serial)}
								<span class="inline-block" in:fly={{ y: -15 }}>
									{nodeStatus.get(node.serial) || 'Disconnected'}
								</span>
							{/key}
						</td>
						<td>
							<button class="btn">
								<Fa icon={faEllipsis} />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	td,
	th {
		@apply px-2 py-1;
	}
	th {
		@apply border-b border-neutral-400;
	}
</style>
