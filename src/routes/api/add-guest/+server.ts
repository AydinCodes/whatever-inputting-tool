import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        
        const name = formData.get('name') as string;
        const sexWorker = formData.get('sexWorker') === 'true';
        const onlyFans = formData.get('onlyFans') === 'true';
        const dancer = formData.get('dancer') === 'true';
        const pornStar = formData.get('pornStar') === 'true';
        const prostitute = formData.get('prostitute') === 'true';
        const isMale = formData.get('isMale') === 'true';
        const otherOccupations = JSON.parse(formData.get('otherOccupations') as string);
        const imageFile = formData.get('image') as File | null;

        if (!name) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('guests')
            .insert({
                name,
                sexWorker,
                onlyFans,
                dancer,
                pornStar,
                prostitute,
                isMale,
                otherOccupations
            })
            .select()
            .single();

        if (error) {
            console.error('Error inserting guest:', error);
            return json({ error: 'Failed to submit request' }, { status: 500 });
        }

        const guestId = data.id;

        if (imageFile && guestId) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${guestId}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('guests')
                .upload(fileName, imageFile, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error('Error uploading file:', uploadError);
                return json({ error: 'Failed to upload file' }, { status: 500 });
            }

            const { data: { publicUrl } } = supabase.storage.from('guests').getPublicUrl(fileName);

            const { error: updateError } = await supabase
                .from('guests')
                .update({ imageUrl: publicUrl })
                .eq('id', guestId);

            if (updateError) {
                console.error('Error updating guest with image URL:', updateError);
                return json({ error: 'Failed to update guest with image URL' }, { status: 500 });
            }
        }

        return json({ success: true, data });
    } catch (err) {
        console.error('Error processing request:', err);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};