<script lang="ts">
	import { pb } from '$lib/stores';
	import { onMount } from 'svelte';
	import { faEllipsis, faTrash } from '@fortawesome/free-solid-svg-icons';
	import DropdownMenu from '$comp/controls/DropdownMenu.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import type { ComputeNode, Job } from '$types/db';

  interface JobEx extends Job{
    expand: {
      "nodes(job)": ComputeNode[]
    }
  }
	let jobs: JobEx[] = [];

	onMount(async () => {
		jobs = await pb.collection('jobs').getFullList({ expand: 'nodes(job)' });
	});

	let tableCols = ['Name', 'Files', 'Nodes', ''];
</script>

<div class="flex-col items-center p-3">
	<div class="flex-col gap-3 max-w-3xl w-full border-2 border-white px-5 py-4 rounded-lg">
		<h2 class="font-header text-3xl">Jobs</h2>
		<table>
			{#each tableCols as col}
				<col width="{100 / tableCols.length}%" />
			{/each}
			<thead>
				<tr>
					{#each tableCols as col}
						<th>{col}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each jobs as job}
					<tr>
						<td>{job.name}</td>
						<td>{job.files}</td>
						<td>
							{#if job.expand['nodes(job)']}
								{job.expand['nodes(job)'].length}
							{:else}
								0
							{/if}
						</td>
						<td>
							<DropdownMenu class="btn" title="Actions" icon={faEllipsis}>
								<button><Fa icon={faTrash} />Delete</button>
							</DropdownMenu>
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
