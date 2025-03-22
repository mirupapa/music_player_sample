import { json } from '@sveltejs/kit';
import { addArtist } from '$lib/server/addArtist';
import { updateArtist } from '$lib/server/updateArtist';
import { listArtist } from '$lib/server/listArtist';
import type { RequestEvent } from './$types';

export async function GET({ params }) {
  try {
    const artistId = parseInt(params.id);
    const artist = await listArtist(  artistId );
    return json(artist);
  } catch (error) {
    return new Response('Artist not found', { status: 404 });
  }
}

export async function PUT({ params, request }: RequestEvent) {
  try {
    const artistId = parseInt(params.id);
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const profile = formData.get('profile') as string;
    const image = formData.get('image') as File | null;

    const artist = await updateArtist(artistId, name, profile, image || undefined);
    return json(artist);
  } catch (error) {
    return new Response('Failed to update artist', { status: 500 });
  }
} 