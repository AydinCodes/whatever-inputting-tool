import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ url }) => {
  const searchInput = url.searchParams.get('input') || '';
  const occupations = [];
  

  try {
    const { data, error } = await supabase
      .from('occupations')
      .select(`*`)
      .ilike('name', `%${searchInput}%`);

    if (error) {
      throw error;
    }

    occupations.push(...data);

  } catch (error) {
    console.error('Error processing data:', error);
}

return new Response(JSON.stringify(occupations), {
    headers: {
        'Content-Type': 'application/json'
    }
});
};