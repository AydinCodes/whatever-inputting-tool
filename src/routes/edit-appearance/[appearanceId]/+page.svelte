<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	let appearanceId = $page.params.appearanceId;

	let appearance: any = {};

	let guest: any = {};
	let submitting = false;

	let rating: number | undefined = undefined;

	async function getGuestDetails(guestId: string) {
		submitting = true;
		try {
			const response = await fetch(`/api/get-guest?guestId=${encodeURIComponent(guestId)}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Failed to fetch guest details');
			}

			const data = await response.json();

			guest = data;
		} catch (err) {
			console.error('Error fetching guest details:', err);
		} finally {
			submitting = false;
		}
	}

	async function getAppearanceDetails() {
		submitting = true;
		try {
			const response = await fetch(
				`/api/get-appearance?appearanceId=${encodeURIComponent(appearanceId)}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			if (!response.ok) {
				throw new Error('Failed to fetch appearance details');
			}

			const data = await response.json();

			appearance = data;
			rating = appearance.rating;

			await getGuestDetails(appearance.guestId);
		} catch (err) {
			console.error('Error fetching appearance details:', err);
		} finally {
			submitting = false;
		}
	}

	async function updateData() {
		submitting = true;
		try {
			const response = await fetch('/api/update-appearance', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					appearanceId,
					rating
				})
			});

			if (!response.ok) {
				throw new Error('Failed to update appearance');
			}

			alert('Appearance updated successfully!');
		} catch (err) {
			console.error('Error updating appearance:', err);
		} finally {
			submitting = false;
		}
	}

	onMount(async () => {
		await getAppearanceDetails();
	});
</script>

<div class="flex justify-center min-h-[90vh] items-center flex-col space-y-8">
	<h1 class="text-4xl font-bold">Edit Appearance</h1>

	<img
		class="w-[30%] rounded-md"
		src={`https://onsvcuimfzdthqbxlqyq.supabase.co/storage/v1/object/public/guests/${appearance.guestId}.jpg`}
		alt="guest"
	/>
	<p class="text-2xl font-bold">{guest.name}</p>
    <p>Age: {appearance.age}</p>
	<input
		type="number"
		name="rating"
		id="rating"
		placeholder="Rating (1-10)"
		class="input input-bordered"
		autocomplete="off"
		bind:value={rating}
	/>

	<button class="btn" on:click={updateData} disabled={submitting}>
		{submitting ? 'Updating...' : 'Update'}
	</button>
</div>
