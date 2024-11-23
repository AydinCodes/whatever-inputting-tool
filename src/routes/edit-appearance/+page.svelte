<script lang="ts">
	import { goto } from '$app/navigation';

	let url: string;

	let episodesCall: any = [];
	let episodeInput: string = '';
	let episode: string = '';

	let showEpisodeDropdown = false;

	let guestInput: string = '';
	let guestsCall: any = [];
	let guest: any = {};

	let showGuestDropdown = false;

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

	function handleBlur(event: FocusEvent) {
		setTimeout(() => {
			const relatedTarget = event.relatedTarget as HTMLElement;
			if (!relatedTarget || !relatedTarget.closest('.dropdown-item')) {
				showEpisodeDropdown = false;
			}
		}, 100);
	}

	function selectEpisode(episodeData: any) {
		episode = episodeData.id;
		episodeInput = '';
		showEpisodeDropdown = false;
		console.log(guest.id);
		goto(`/edit-appearance/episode/${episode}`);
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

	function selectGuest(guestData: any) {
		guest = guestData;
		guestInput = '';
		showGuestDropdown = false;
		goto(`/edit-appearance/guest/${guest.id}`);
	}
</script>

<div class="flex justify-center min-h-[90vh] items-center">
	<div class="flex flex-col items-end justify-center w-[50%] space-y-4">
		<div class="w-full space-y-4">
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
		</div>
	</div>
</div>
