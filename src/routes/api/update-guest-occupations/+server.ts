import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Extract the form data from the request
        const formData = await request.formData();
        
        const id = formData.get('id') as string;  // Guest ID
        const newOccupation = formData.get('newOccupation') as string;  // New occupation number as a string

        // Validate the required fields
        if (!id || !newOccupation) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Convert the 'newOccupation' to a number
        const occupationNumber = parseInt(newOccupation, 10);
        if (isNaN(occupationNumber)) {
            return json({ error: 'Invalid occupation number' }, { status: 400 });
        }

        // Retrieve the guest from the database using the guest id
        const { data: guest, error: guestError } = await supabase
            .from('guests')
            .select('id, otherOccupations')
            .eq('id', id)
            .single();

        // Handle error if the guest is not found
        if (guestError || !guest) {
            return json({ error: 'Guest not found' }, { status: 404 });
        }

        // Get the current list of other occupations (if it exists)
        const existingOccupations = guest.otherOccupations || [];

        // Add the new occupation to the existing list, avoiding duplicates
        const updatedOccupations = [...new Set([...existingOccupations, occupationNumber])];

        // Update the guest's 'otherOccupations' column
        const { error: updateError } = await supabase
            .from('guests')
            .update({ otherOccupations: updatedOccupations })
            .eq('id', id);

        if (updateError) {
            console.error('Error updating guest:', updateError);
            return json({ error: 'Failed to update guest' }, { status: 500 });
        }

        return json({ success: true, data: { id, otherOccupations: updatedOccupations } });
    } catch (err) {
        console.error('Error processing request:', err);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
