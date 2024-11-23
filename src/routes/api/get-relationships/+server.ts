import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ url }) => {
  const searchInput = url.searchParams.get('input') || '';
  const relationships = [];
  

  try {
    const { data, error } = await supabase
      .from('relationshipStatus')
      .select(`*`)
      .ilike('name', `%${searchInput}%`);

    if (error) {
      throw error;
    }

    relationships.push(...data);

  } catch (error) {
    console.error('Error processing data:', error);
}

return new Response(JSON.stringify(relationships), {
    headers: {
        'Content-Type': 'application/json'
    }
});
};