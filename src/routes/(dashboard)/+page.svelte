<script lang="ts">
	import { pb } from '$lib/stores';
	import type { ComputeNode, Job } from '$types/db';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import {
		faClipboardCheck,
		faEllipsis,
		faSquare,
		faSquareCheck,
		faTrash
	} from '@fortawesome/free-solid-svg-icons';
	import { fly } from 'svelte/transition';
	import DropdownMenu from '$comp/controls/DropdownMenu.svelte';
	import Dialog from '$comp/Dialog.svelte';
	import Loading from '$comp/general/Loading.svelte';
	import { toasts } from 'svelte-toasts';

	interface ComputeNodeEx extends ComputeNode {
		expand: {
			job: Job;
		};
	}
	let nodes: ComputeNodeEx[] = [];
	let nodeStatus = new Map<string, string>();
	let selectedNodes: string[] = [];
	let socket: WebSocket;
	let jobDialog: HTMLDialogElement;
	let jobDialogNodes: string[];
	let jobs: Job[];

	onMount(async () => {
		nodes = await pb.collection('nodes').getFullList({ expand: 'job' });
		nodeStatus = new Map<string, string>(nodes.map((v) => [v.serial, 'Connecting...']));
		await delay(1000);
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

	function toggleSelect(serial: string) {
		if (selectedNodes.includes(serial)) {
			selectedNodes = selectedNodes.filter((v) => v != serial);
		} else {
			selectedNodes = [...selectedNodes, serial];
		}
	}

	function toggleSelectAll() {
		if (selectedNodes.length == nodes.length) {
			selectedNodes = [];
		} else {
			selectedNodes = nodes.map((v) => v.id);
		}
	}

	async function openAssignJob(ids: string[]) {
		jobDialogNodes = ids;
		jobDialog.showModal();
		jobs = await pb.collection('jobs').getFullList();
	}

	async function assignJob(nodeIds: string[], jobId: string) {
		for (let v of nodeIds) {
			await pb.collection('nodes').update(v, { job: jobId });
		}
		nodes = await pb.collection('nodes').getFullList({ expand: 'job' });
		toasts.success('Job Set');
		jobDialog.close();
	}

	async function deleteNodes(ids: string[]) {
		try {
			await Promise.all(ids.map((id) =>pb.collection('nodes').delete(id))) 
      nodes = await pb.collection('nodes').getFullList({ expand: 'job' });
			toasts.success('Deleted Node');
		} catch {
			toasts.success('Error Deleting Node');
		}
	}

	let tableCols = ['Serial', 'Brand', 'Model', 'Status', 'Job'];
</script>

<div class="flex-col items-center p-3">
	<div class="flex-col gap-3 max-w-3xl w-full border-2 border-white px-5 py-4 rounded-lg">
		<h2 class="font-header text-3xl">Nodes</h2>
		<table>
			<thead>
				<tr>
					<th>
						<button on:click={toggleSelectAll}>
							<Fa
								class="text-lg"
								icon={selectedNodes.length == nodes.length ? faSquareCheck : faSquare} />
						</button>
					</th>
					{#each tableCols as col}
						<th>{col}</th>
					{/each}
					<th class="font-normal">
						<DropdownMenu class="btn" title="All Selected" icon={faEllipsis}>
							<button on:click={() => openAssignJob(selectedNodes)}>
								<Fa icon={faClipboardCheck} />Assign Job
							</button>
							<button on:click={() => deleteNodes(selectedNodes)}>
                <Fa icon={faTrash} />Delete
              </button>
						</DropdownMenu>
					</th>
				</tr>
			</thead>
			<tbody>
				{#each nodes as node}
					<tr>
						<td>
							<button on:click={() => toggleSelect(node.id)}>
								<Fa
									class="text-lg"
									icon={selectedNodes.includes(node.id) ? faSquareCheck : faSquare} />
							</button>
						</td>
						<td>{node.serial}</td>
						<td>{node.manufacturer}</td>
						<td>{node.model}</td>
						<td>
							{#if node.job}
								{node.expand.job.name}
							{:else}
								None
							{/if}
						</td>
						<td class="w-32">
							{#key nodeStatus.get(node.serial)}
								<span class="inline-block text-sm" in:fly={{ y: -15 }}>
									{nodeStatus.get(node.serial) || 'Disconnected'}
								</span>
							{/key}
						</td>
						<td>
							<DropdownMenu class="btn" title="Actions" icon={faEllipsis}>
								<button on:click={() => openAssignJob([node.id])}>
									<Fa icon={faClipboardCheck} />Assign Job
								</button>
								<button on:click={() => deleteNodes([node.id])}>
									<Fa icon={faTrash} />Delete
								</button>
							</DropdownMenu>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Dialog title="Assign Job..." bind:dialog={jobDialog}>
	{#if jobs}
		<div class="flex-col gap-1">
			{#each jobs as job}
				<button class="btn" on:click={() => assignJob(jobDialogNodes, job.id)}>{job.name}</button>
			{/each}
		</div>
	{:else}
		<Loading />
	{/if}
</Dialog>

<style>
	td,
	th {
		@apply px-2 py-1;
	}
	th {
		@apply border-b border-neutral-400;
	}
</style>
