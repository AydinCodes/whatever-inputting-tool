<script lang="ts">
	let isSexWorker = false;
	let isOnlyFans = false;
	let isDancer = false;
	let isPornStar = false;
	let isProstitute = false;
	let isMale = false;
	let name = '';

	let submitting = false;
	let submitError = null;
	let submitSuccess = false;

	let occupation = '';
	let occupations: any[] = [];
	let occupationsCall: any = [];
	let showDropdown = false;

	let imageInput: HTMLInputElement | undefined = undefined;

	async function addNewOccupation() {
		submitting = true;
		submitError = null;
		submitSuccess = false;

		try {
			const response = await fetch('/api/add-occupation', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: occupation
				})
			});

			if (!response.ok) {
				throw new Error('Failed to submit request');
			}

			const newOccupation = await response.json();

			occupations = [...occupations, newOccupation.data[0]];

			submitSuccess = true;
			occupation = '';
		} catch (err) {
			console.error('Error submitting request:', err);
			submitError = 'Failed to submit request. Please try again later.';
		} finally {
			submitting = false;
		}
	}

	async function searchOccupation() {
		const url = `/api/get-occupations?input=${encodeURIComponent(occupation)}`;
		if (occupation.length > 0) {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				occupationsCall = [...data];
			} catch (error) {
				console.error('Error:', error);
				occupationsCall = [];
			}
			showDropdown = occupationsCall.length > 0;
		} else {
			showDropdown = false;
			occupationsCall = [];
		}
	}

	function addOccupation(occupationData: any) {
		occupations = [...occupations, occupationData];
		occupation = '';
		showDropdown = false;
	}

	function handleBlur(event: FocusEvent) {
		setTimeout(() => {
			const relatedTarget = event.relatedTarget as HTMLElement;
			if (!relatedTarget || !relatedTarget.closest('.dropdown-item')) {
				showDropdown = false;
			}
		}, 100);
	}

	async function addGuest() {
		submitting = true;
		submitError = null;
		submitSuccess = false;

		try {
			const formData = new FormData();
			formData.append('name', name);
			formData.append('sexWorker', isSexWorker.toString());
			formData.append('onlyFans', isOnlyFans.toString());
			formData.append('dancer', isDancer.toString());
			formData.append('pornStar', isPornStar.toString());
			formData.append('prostitute', isProstitute.toString());
			formData.append('isMale', isMale.toString());
			formData.append(
				'otherOccupations',
				JSON.stringify(occupations.map((occupation: any) => occupation.id))
			);

			if (imageInput && imageInput.files && imageInput.files[0]) {
				formData.append('image', imageInput.files[0]);
			}

			const response = await fetch('/api/add-guest', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to submit request');
			}

			submitSuccess = true;
			name = '';
			isSexWorker = false;
			occupations = [];
			isMale = false;
			imageInput = undefined;
		} catch (err) {
			console.error('Error submitting request:', err);
			submitError = 'Failed to submit request. Please try again later.';
		} finally {
			submitting = false;
		}
	}

	$: {
		if (!isSexWorker) {
			isDancer = false;
			isPornStar = false;
			isProstitute = false;
			isOnlyFans = false;
		}
	}

	$: {
	}
</script>

<div class="flex justify-center min-h-[90vh] items-center">
	<form
		on:submit|preventDefault={addGuest}
		class="flex flex-col items-end justify-center w-[50%] space-y-4"
	>
		<div class="w-full space-y-4">
			<input
				type="text"
				name="name"
				id="name"
				placeholder="Name"
				class="input input-bordered w-full"
				autocomplete="off"
				bind:value={name}
			/>
			<div class="flex justify-evenly">
				<div class="flex flex-col items-center space-y-2">
					<p>Sex Worker</p>
					<input
						type="checkbox"
						class="toggle"
						placeholder="Sex Worker"
						name="sexWorker"
						id="sexWorker"
						autocomplete="off"
						bind:checked={isSexWorker}
					/>
				</div>
				{#if isSexWorker}
					<div class="flex flex-col items-center space-y-2">
						<p>Only Fans</p>
						<input
							type="checkbox"
							class="toggle"
							placeholder="Only Fans"
							name="onlyFans"
							id="onlyFans"
							autocomplete="off"
							bind:checked={isOnlyFans}
						/>
					</div>
					<div class="flex flex-col items-center space-y-2">
						<p>Dancer</p>
						<input
							type="checkbox"
							class="toggle"
							placeholder="Dancer"
							name="dancer"
							id="dancer"
							autocomplete="off"
							bind:checked={isDancer}
						/>
					</div>
					<div class="flex flex-col items-center space-y-2">
						<p>Porn Star</p>
						<input
							type="checkbox"
							class="toggle"
							placeholder="Porn Star"
							name="pornStar"
							id="pornStar"
							autocomplete="off"
							bind:checked={isPornStar}
						/>
					</div>
					<div class="flex flex-col items-center space-y-2">
						<p>Prostitute</p>
						<input
							type="checkbox"
							class="toggle"
							placeholder="Prostitute"
							name="prostitute"
							id="prostitute"
							autocomplete="off"
							bind:checked={isProstitute}
						/>
					</div>
				{/if}
				<div class="flex flex-col items-center space-y-2">
					<p>Male</p>
					<input
						type="checkbox"
						class="toggle"
						placeholder="Male"
						name="male"
						id="male"
						autocomplete="off"
						bind:checked={isMale}
					/>
				</div>
			</div>
			<div class="relative">
				<input
					bind:value={occupation}
					on:input={searchOccupation}
					type="text"
					name="otherOccupations"
					id="otherOccupations"
					placeholder="Other Occupations"
					class="input input-bordered w-full"
					autocomplete="off"
					on:focus={() => (showDropdown = occupation.length > 0)}
					on:blur={handleBlur}
				/>
				{#if showDropdown && occupationsCall.length > 0}
					<div
						class="absolute left-0 right-0 mt-1 bg-slate-800 border border-gray-300 rounded-md shadow-lg z-10"
					>
						{#each occupationsCall as occupation}
							<div
								role="button"
								tabindex="0"
								class="p-2 hover:bg-slate-700 cursor-pointer dropdown-item"
								on:mousedown={() => addOccupation(occupation)}
								on:keydown={(e) => e.key === 'Enter' && addOccupation(occupation)}
							>
								{occupation.name}
							</div>
						{/each}
					</div>
				{/if}
				{#if occupation.length > 0}
					<button
						on:click={addNewOccupation}
						type="button"
						class="absolute right-4 top-[50%] translate-y-[-50%] btn-square icon">+</button
					>
				{/if}
			</div>
		</div>
		{#each occupations as occ}
			<div>{occ.name}</div>
		{/each}

		<input
			bind:this={imageInput}
			id="image"
			type="file"
			class="file-input file-input-bordered w-full max-w-xs"
			accept="image/*"
		/>

		<button type="submit" class="btn">Add</button>
	</form>
</div>
