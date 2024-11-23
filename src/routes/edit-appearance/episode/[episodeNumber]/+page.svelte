<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let submitting = false;

	let appearances: any = [];

	$: episodeNumber = $page.params.episodeNumber;

	async function getAppearances() {
		submitting = true;
		try {
			const response = await fetch(
				`/api/get-appearances?episode=${encodeURIComponent(episodeNumber)}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			if (!response.ok) {
				throw new Error('Failed to submit request');
			}

			const data = await response.json();

			appearances = data;
		} catch (err) {
			console.error('Error submitting request:', err);
		} finally {
			submitting = false;
		}
	}

	onMount(() => {
		getAppearances();
	});
</script>

<div class="flex justify-center min-h-[90vh] items-center flex-col space-y-7">
	<p class="text-5xl font-bold">#{episodeNumber}</p>
	<div class="grid grid-cols-3 gap-4 w-[50%]">
		{#each appearances as appearance}
			<a href="/edit-appearance/{appearance.id}">
				<img
					class="btn btn-square btn-lg w-full h-full"
					src="https://onsvcuimfzdthqbxlqyq.supabase.co/storage/v1/object/public/guests/{appearance.guestId}.jpg"
					alt="guest"
				/>
			</a>
		{/each}
	</div>
</div>
