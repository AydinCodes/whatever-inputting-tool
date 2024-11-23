<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	let submitting = false;

	let appearances: any = [];

	$: guestId = $page.params.guestId;

	async function getAppearances() {
		submitting = true;
		try {
			const response = await fetch(`/api/get-appearances?guestId=${encodeURIComponent(guestId)}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

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

<div class="flex justify-center min-h-[90vh] items-center flex-col space-y-8">
	<img
		class="max-w-[30%] rounded-md"
		src="https://onsvcuimfzdthqbxlqyq.supabase.co/storage/v1/object/public/guests/{guestId}.jpg"
		alt="guest"
	/>
	<div class="grid grid-cols-3 gap-4 w-[50%]">
		{#each appearances as appearance}
			<a href="/edit-appearance/{appearance.id}">
				<button class="btn btn-square w-full">{appearance.episodeNumber}</button>
			</a>
		{/each}
	</div>
</div>
