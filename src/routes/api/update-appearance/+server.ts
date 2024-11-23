import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { appearanceId, rating } = body;

    if (!appearanceId || rating === undefined) {
      return new Response(JSON.stringify({ error: 'Appearance ID and rating are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const { error } = await supabase
      .from('appearance')
      .update({ rating })
      .eq('id', appearanceId);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating appearance:', error.message);
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
