import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name } = await request.json();

		if (!name) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const { data, error } = await supabase
			.from('occupations')
			.insert({
				name
			})
			.select();

		console.log(data);

		if (error) {
			console.error('Error inserting meeting request:', error);
			return json({ error: 'Failed to submit request' }, { status: 500 });
		}

		return new Response(JSON.stringify({ data }), {
            headers: { 'Content-Type': 'application/json' }
        });
	} catch (err) {
		console.error('Error processing request:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
