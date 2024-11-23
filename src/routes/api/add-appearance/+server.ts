import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		console.log(body);

		const {
			episode,
			guest,
			age,
			completedShow,
			kicked,
			kickedTime,
			rageQuit,
			rageQuitTime,
			relationship,
			rating
		} = body;

		if (!episode || !guest || !relationship ) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const { data, error } = await supabase
			.from('appearance')
			.insert({
				episodeNumber: episode,
				guestId: guest,
				age,
				rating,
				completedShow,
				kicked,
				kickedTime,
				rageQuit,
				rageQuitTime,
				relationshipStatusId: relationship,
				
			})
			.select()
			.single();

		if (error) {
			console.error('Error inserting appearence:', error);
			return json({ error: 'Failed to submit request' }, { status: 500 });
		}

		return json({ success: true, data });
	} catch (err) {
		console.error('Error processing request:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
