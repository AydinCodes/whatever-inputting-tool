<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const navItems = [
		{
			name: 'Guest',
			href: '/guest'
		},
        {
            name: 'Episode',
            href: '/episode'
        },
		{
			name: 'Appearance',
			href: '/appearance'
		},
		{
			name: 'Edit Appearance',
			href: '/edit-appearance'
		}
	];

	async function closeDrawer(event: Event, href: string) {
		event.preventDefault();
		const drawerCheckbox = document.getElementById('my-drawer-3') as HTMLInputElement;
		if (drawerCheckbox) {
			drawerCheckbox.checked = false;
		}

		await goto(href);
	}
</script>

<div class="drawer z-[600]">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="navbar w-full text-white sticky-nav !bg-black">
			<div class="flex-none lg:hidden">
				<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-6 w-6 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</label>
			</div>
			<div class="w-full flex justify-end lg:justify-between">
				<div class="w-0 lg:w-[7.5rem]"></div>

				<a href="/" class="mx-2 px-2 text-2xl font-bold lg:absolute logo-text">
					<img
						class="w-[6rem] h-auto"
						src="https://whatever.creator-spring.com/_next/image?url=https%3A%2F%2Fdslv9ilpbe7p1.cloudfront.net%2FZoKinYgASc4CPkcrB9VYoQ_store_logo_image.png&w=3840&q=75"
						alt="logo"
					/></a
				>
				<div class="hidden flex-none lg:block">
					<ul class="font-bold text-xl list-none space-x-4">
						{#each navItems as item}
							<li class="inline-block main-li">
								<a href={item.href} on:click={(event) => closeDrawer(event, item.href)}
									>{item.name}</a
								>
							</li>
						{/each}
					</ul>
				</div>
				<div class="lg:w-[7.25rem] flex justify-end items-center">
					<!-- <CartButton /> -->
				</div>
			</div>
		</div>
		<slot />
	</div>
	<div class="drawer-side">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul
			class="bg-base-200 min-h-full w-80 p-4 flex flex-col justify-center items-center space-y-4 font-bold text-xl"
		>
			<!-- Sidebar content here -->

			<li><a href="/" on:click={(event) => closeDrawer(event, '/')}>Home</a></li>
			{#each navItems as item}
				<li>
					<a href={item.href} on:click={(event) => closeDrawer(event, item.href)}>{item.name}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.main-li {
		transition: all 0.25s ease-in-out;
	}

	.main-li:hover {
		opacity: 0.7;
		transform: scale(1.1);
		transition: all 0.25s ease-in-out;
	}

	.logo-text {
		transition: all 0.25s ease-in-out;
	}

	.logo-text:hover {
		opacity: 0.7;
		transform: scale(1.1);
		transition: all 0.25s ease-in-out;
	}

	.sticky-nav {
		position: sticky;
		top: 0;
		z-index: 500;
		background-color: white; /* Add a background color to ensure content doesn't show through */
	}
</style>
