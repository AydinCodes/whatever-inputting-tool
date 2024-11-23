import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ url }) => {
  // Get the 'ids' query parameter (comma-separated values)
  const searchInput = url.searchParams.get('ids') || '';
  const occupations = [];
console.log(searchInput)
  // Split the input by commas, trim any spaces, and convert to numbers
  const idArray = searchInput
    .split(',')
    .map(id => id.trim())
    .filter(id => id) // Ensure non-empty values
    .map(id => parseInt(id, 10))  // Convert string to number (parseInt)
    .filter(id => !isNaN(id));  // Filter out invalid numbers

  console.log(idArray);  // Log the ids to ensure they're valid numbers

  try {
    // Query the 'occupations' table for the provided numeric ids
    const { data, error } = await supabase
      .from('occupations')
      .select('*')
      .in('id', idArray);  // Use the '.in()' method for multiple numeric ids

    if (error) {
      throw error;
    }

    // If data is found, push it to the occupations array
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
