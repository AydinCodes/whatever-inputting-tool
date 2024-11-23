import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ url }) => {
  const searchInput = url.searchParams.get('input') || '';
  const guests = [];
  

  try {
    const { data, error } = await supabase
      .from('guests')
      .select(`*`)
      .ilike('name', `%${searchInput}%`);

    if (error) {
      throw error;
    }


    guests.push(...data);

  } catch (error) {
    console.error('Error processing data:', error);
}

return new Response(JSON.stringify(guests), {
    headers: {
        'Content-Type': 'application/json'
    }
});
};