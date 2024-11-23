import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ url }) => {
    const episode = url.searchParams.get('episode');
    const guest = url.searchParams.get('guestId');

    try {
        let query = supabase.from('appearance').select(`*`);

        if (episode) {
            query = query.eq('episodeNumber', episode);
        } else if (guest) {
            query = query.eq('guestId', guest);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        console.log(data);

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error processing data:', error.message);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            console.error('Unknown error:', error);
            return new Response(JSON.stringify({ error: 'An unknown error occurred.' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
};
