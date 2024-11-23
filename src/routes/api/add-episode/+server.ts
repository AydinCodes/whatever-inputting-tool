import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';



export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		const { id, url } = body;

		if (!(id > 0) || !url ) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const { data, error } = await supabase
			.from('episodes')
			.insert({
				id: id.toString(),
				url
			})
			.select()
			.single();


		if (error) {
			console.error('Error inserting meeting request:', error);
			return json({ error: 'Failed to submit request' }, { status: 500 });
		}



		return json({ success: true, data });
	} catch (err) {
		console.error('Error processing request:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
