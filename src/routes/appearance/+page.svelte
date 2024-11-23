<script lang="ts">
	import { onMount } from 'svelte';

	let completedShow = true;
	let kicked = false;
	let rageQuit = false;

	let showNameDropdown = false;
	let showEpisodeDropdown = false;
	let showGuestDropdown = false;
	let showRelationshipDropdown = false;

	let episodesCall: any = [];
	let episodeInput: string = '';
	let episode: string = '';

	let guestsCall: any = [];
	let guestInput: string = '';
	let guest: any = {};

	let relationshipInput: string = '';
	let relationship: any = {};
	let relationshipCall: any = [];

	let submitting = false;

	let age: number | undefined = undefined;
	let rating: number | undefined = undefined;
	let kickedTime: number | undefined = undefined;
	let rageQuitTime: number | undefined = undefined;

	let occupation = '';
	let occupations: any[] = [];
	let occupationsCall: any = [];
	let showOccupationDropdown = false;
	let submitError = null;
	let submitSuccess = false;

	$: {
		if (completedShow) {
			kicked = false;
			rageQuit = false;
		}
	}

	function handleBlur(event: FocusEvent) {
		setTimeout(() => {
			const relatedTarget = event.relatedTarget as HTMLElement;
			if (!relatedTarget || !relatedTarget.closest('.dropdown-item')) {
				showNameDropdown = false;
				
			}
		}, 100);
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.guest-dropdown')) {
			showNameDropdown = false;
		}
	}

	async function searchEpisodes() {
		const url = `/api/get-episodes?input=${encodeURIComponent(episodeInput)}`;
		if (episodeInput.length > 0) {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				episodesCall = data;
			} catch (error) {
				console.error('Error:', error);
				episode = '';
			}
			showEpisodeDropdown = episodeInput.length > 0;
		} else {
			showEpisodeDropdown = false;
			episodeInput = '';
		}
	}

	function selectEpisode(episodeData: any) {
		episode = episodeData.id;
		episodeInput = '';
		showEpisodeDropdown = false;
	}

	async function searchGuests() {
		const url = `/api/get-guests?input=${encodeURIComponent(guestInput)}`;
		if (guestInput.length > 0) {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				guestsCall = data;
			} catch (error) {
				console.error('Error:', error);
				guest = {};
			}
			showGuestDropdown = guestInput.length > 0;
		} else {
			showGuestDropdown = false;
			guestInput = '';
		}
	}

	async function getOccupations(occs: number[]) {
		const url = `/api/get-occupations-id?ids=${encodeURIComponent(occs.join(','))}`;

		if (occs.length > 0) {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				occupations = data;
			} catch (error) {
				console.error('Error:', error);
				occupations = [];
			}
		}
	}

	function selectGuest(guestData: any) {
		guest = guestData;
		guestInput = '';
		showGuestDropdown = false;
		getOccupations(guest.otherOccupations);
	}

	async function getRelationships() {
		const url = `/api/get-relationships?input=${encodeURIComponent(relationshipInput)}`;
		if (relationshipInput.length > 0) {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				relationshipCall = [...data];
			} catch (error) {
				console.error('Error:', error);
				relationshipCall = [];
			}
			showRelationshipDropdown = relationshipCall.length > 0;
		} else {
			showRelationshipDropdown = false;
			relationshipCall = [];
		}
	}

	function selectRelationship(relationshipData: any) {
		relationship = relationshipData;
		relationshipInput = '';
		showRelationshipDropdown = false;
	}

	async function addNewRelationship() {
		try {
			submitting = true;
			const response = await fetch('/api/add-relationship', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: relationshipInput
				})
			});

			if (!response.ok) {
				throw new Error('Failed to submit request');
			}

			const newrelationship = await response.json();

			relationship = newrelationship.data[0];

			relationshipInput = '';
		} catch (err) {
			console.error('Error submitting request:', err);
		} finally {
			submitting = false;
		}
	}

	async function addAppearance() {
		submitting = true;

		try {
			const response = await fetch('/api/add-appearance', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					episode: episode,
					guest: guest.id,
					age: age,
					completedShow: completedShow,
					kicked: kicked,
					kickedTime: kickedTime,
					rageQuit: rageQuit,
					rageQuitTime: rageQuitTime,
					relationship: relationship.id,
					rating: rating
				})
			});

			if (!response.ok) {
				throw new Error('Failed to submit request');
			}

			episode = '';
			guest = {};
			age = undefined;
			completedShow = true;
			kicked = false;
			kickedTime = undefined;
			rageQuit = false;
			rageQuitTime = undefined;
		} catch (err) {
			console.error('Error submitting request:', err);
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
			showOccupationDropdown = occupationsCall.length > 0;
		} else {
			showOccupationDropdown = false;
			occupationsCall = [];
		}
	}

	function addOccupation(occupationData: any) {
		// here
		const newOccupationId = occupationData.id;
		addOccupationToGuest(newOccupationId);
		occupations = [...occupations, occupationData];
		occupation = '';
		showOccupationDropdown = false;
	}

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
			// here
			const newOccupationId = newOccupation.data[0].id;

			addOccupationToGuest(newOccupationId);

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

	async function addOccupationToGuest(occupationId: number) {
		submitting = true;
		submitError = null;
		submitSuccess = false;

		try {
			// Get the guest ID (assuming it's already available)
			const guestId = guest.id;

			// Make the request to the update-guest-occupations API
			const response = await fetch('/api/update-guest-occupations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // The API expects form data
				},
				body: new URLSearchParams({
					id: guestId.toString(),
					newOccupation: occupationId.toString()
				})
			});

			if (!response.ok) {
				throw new Error('Failed to update guest occupations');
			}

			const result = await response.json();

			if (result.error) {
				throw new Error(result.error);
			}

			// On success, update the UI or state accordingly
			submitSuccess = true;
			occupation = ''; // Clear occupation field after submission
			showOccupationDropdown = false; // Close dropdown if it's open

			// Optionally update the guest's occupations locally, depending on your app's requirements
			// Example: Add the new occupation ID to a list of occupations for the guest in the UI
			guest.otherOccupations = result.data.otherOccupations;
		} catch (err) {
			console.error('Error adding occupation to guest:', err);
			submitError = 'Failed to add occupation to guest. Please try again later.';
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex justify-center min-h-[90vh] items-center">
	<form on:submit={addAppearance} class="flex flex-col items-end justify-center w-[50%] space-y-4">
		{#if guest.imageUrl}
			<div class="w-full flex justify-center">
				<img class="max-w-[20%]" src={guest.imageUrl} alt="guest" />
			</div>
		{/if}
		<div class="w-full space-y-4">
			{#if episode}
				<div class="flex justify-between items-center">
					<p>Episode: {episode}</p>
					<button on:click={() => (episode = '')} class="btn btn-error text-white">X</button>
				</div>
			{:else}
				<div class="relative">
					<input
						bind:value={episodeInput}
						on:input={searchEpisodes}
						type="text"
						name="episode"
						id="episode"
						placeholder="Episode"
						class="input input-bordered w-full"
						autocomplete="off"
						on:focus={() => (showEpisodeDropdown = episodeInput.length > 0)}
						on:blur={handleBlur}
					/>
					{#if showEpisodeDropdown && episodesCall.length > 0}
						<div
							class="absolute left-0 right-0 mt-1 bg-slate-800 border border-gray-300 rounded-md shadow-lg z-10"
						>
							{#each episodesCall as ep}
								<div
									role="button"
									tabindex="0"
									class="p-2 hover:bg-slate-700 cursor-pointer dropdown-item"
									on:mousedown={() => selectEpisode(ep)}
									on:keydown={(e) => e.key === 'Enter' && selectEpisode(ep)}
								>
									{ep.id}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
			{#if guest.id}
				<div class="flex flex-col justify-between items-center">
					<p>Guest: {guest.name}</p>
					<p>ID: {guest.id}</p>
					<div>
						<p>Occupations:</p>
						{#each occupations as occupation}
							<p>{occupation.name}</p>
						{/each}
					</div>
					<button on:click={() => (guest = {})} class="btn btn-error text-white">X</button>
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
							on:focus={() => (showOccupationDropdown = occupation.length > 0)}
							on:blur={handleBlur}
						/>
						{#if showOccupationDropdown && occupationsCall.length > 0}
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
			{:else}
				<div class="relative">
					<input
						bind:value={guestInput}
						on:input={searchGuests}
						type="text"
						name="guest"
						id="guest"
						placeholder="Guest"
						class="input input-bordered w-full"
						autocomplete="off"
						on:focus={() => (showGuestDropdown = guestInput.length > 0)}
						on:blur={handleBlur}
					/>
					{#if showGuestDropdown && guestsCall.length > 0}
						<div
							class="absolute left-0 right-0 mt-1 bg-slate-800 border border-gray-300 rounded-md shadow-lg z-10"
						>
							{#each guestsCall as gues}
								<div
									role="button"
									tabindex="0"
									class="p-2 hover:bg-slate-700 cursor-pointer dropdown-item"
									on:mousedown={() => selectGuest(gues)}
									on:keydown={(e) => e.key === 'Enter' && selectGuest(gues)}
								>
									{gues.name}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
			<input
				type="number"
				name="age"
				id="age"
				placeholder="Age"
				class="input input-bordered w-full"
				autocomplete="off"
				bind:value={age}
			/>
			<div class="flex justify-evenly">
				<div class="flex flex-col items-center space-y-2">
					<p>Completed Show</p>
					<input
						type="checkbox"
						class="toggle"
						placeholder="Completed Show"
						name="completedShow"
						id="completedShow"
						autocomplete="off"
						bind:checked={completedShow}
					/>
				</div>
				{#if !completedShow}
					{#if !rageQuit}
						<div class="flex flex-col items-center space-y-2">
							<p>Kicked</p>
							<input
								type="checkbox"
								class="toggle"
								placeholder="Kicked"
								name="kicked"
								id="kicked"
								autocomplete="off"
								bind:checked={kicked}
							/>
						</div>
					{/if}
					{#if !kicked}
						<div class="flex flex-col items-center space-y-2">
							<p>Rage Quit</p>
							<input
								type="checkbox"
								class="toggle"
								placeholder="Rage Quit"
								name="rageQuit"
								id="rageQuit"
								autocomplete="off"
								bind:checked={rageQuit}
							/>
						</div>
					{/if}
					{#if kicked}
						<div class="flex items-center space-y-2">
							<input
								type="number"
								class="input input-bordered"
								placeholder="time"
								name="kickedTime"
								id="kickedTime"
								autocomplete="off"
								bind:value={kickedTime}
							/>
						</div>
					{/if}
					{#if rageQuit}
						<div class="flex items-center space-y-2">
							<input
								type="number"
								class="input input-bordered"
								placeholder="time"
								name="rageQuitTime"
								id="rageQuitTime"
								autocomplete="off"
								bind:value={rageQuitTime}
							/>
						</div>
					{/if}
				{/if}
			</div>

			{#if relationship.id}
				<div class="flex justify-between items-center">
					<p>Relationship Status: {relationship.name}</p>
					<button on:click={() => (relationship = {})} class="btn btn-error text-white">X</button>
				</div>
			{:else}
				<div class="relative">
					<input
						bind:value={relationshipInput}
						on:input={getRelationships}
						type="text"
						name="relationship"
						id="relationship"
						placeholder="Relationship"
						class="input input-bordered w-full"
						autocomplete="off"
						on:focus={() => (showRelationshipDropdown = relationship.length > 0)}
						on:blur={handleBlur}
					/>
					{#if showRelationshipDropdown && relationshipCall.length > 0}
						<div
							class="absolute left-0 right-0 mt-1 bg-slate-800 border border-gray-300 rounded-md shadow-lg z-10"
						>
							{#each relationshipCall as relationsh}
								<div
									role="button"
									tabindex="0"
									class="p-2 hover:bg-slate-700 cursor-pointer dropdown-item"
									on:mousedown={() => selectRelationship(relationsh)}
									on:keydown={(e) => e.key === 'Enter' && selectRelationship(relationsh)}
								>
									{relationsh.name}
								</div>
							{/each}
						</div>
					{/if}
					{#if relationshipInput.length > 0}
						<button
							on:click={addNewRelationship}
							type="button"
							class="absolute right-4 top-[50%] translate-y-[-50%] btn-square icon">+</button
						>
					{/if}
				</div>
			{/if}
			<input
				type="number"
				name="rating"
				id="rating"
				placeholder="Rating (1-10)"
				class="input input-bordered w-full"
				autocomplete="off"
				bind:value={rating}
			/>
		</div>
		<button type="submit" class="btn">Add</button>
	</form>
</div>
