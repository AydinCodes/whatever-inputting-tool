<script lang="ts">
	let number: number;
	let url: string;

	let submitting = false;
	let submitError = null;
	let submitSuccess = false;

	async function handleSubmit() {
		submitting = true;
		submitError = null;
		submitSuccess = false;
		if (number > 0 && url.length > 0) {
			try {
				const response = await fetch('/api/add-episode', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						id: number,
						url: url
					})
				});

				if (!response.ok) {
					throw new Error('Failed to submit request');
				}

				submitSuccess = true;
				number = 0;
				url = '';
			} catch (err) {
				console.error('Error submitting request:', err);
				submitError = 'Failed to submit request. Please try again later.';
			} finally {
				submitting = false;
			}
		}
	}
</script>

<div class="flex justify-center min-h-[90vh] items-center">
	<form on:submit={handleSubmit} class="flex flex-col items-end justify-center w-[50%] space-y-4">
		<div class="w-full space-y-4">
			<input
				type="number"
				name="number"
				id="number"
				placeholder="Number"
				class="input input-bordered w-full"
				autocomplete="off"
				bind:value={number}
			/>
			<input
				type="text"
				name="url"
				id="url"
				placeholder="URL"
				class="input input-bordered w-full"
				autocomplete="off"
				bind:value={url}
			/>
		</div>
		<button type="submit" class="btn">Add</button>
	</form>
</div>
