import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ url }) => {
  const appearanceId = url.searchParams.get('appearanceId'); // Get the 'id' parameter from the URL

  if (!appearanceId) {
    return new Response(JSON.stringify({ error: 'Guest ID is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    // Query Supabase for the guest by ID
    const { data, error } = await supabase
      .from('appearance')
      .select(`*`)
      .eq('id', appearanceId)
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching guest:', error.message);
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
