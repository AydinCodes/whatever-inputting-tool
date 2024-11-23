import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ url }) => {
  const searchInput = url.searchParams.get('input') || '';
  const episodes = [];
  

  try {
    const { data, error } = await supabase
      .from('episodes')
      .select(`*`)
      .ilike('id', `%${searchInput}%`);

    if (error) {
      throw error;
    }


    episodes.push(...data);

  } catch (error) {
    console.error('Error processing data:', error);
}

return new Response(JSON.stringify(episodes), {
    headers: {
        'Content-Type': 'application/json'
    }
});
};