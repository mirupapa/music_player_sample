import { json } from '@sveltejs/kit';
import { listArtist } from '$lib/server/listArtist';
import { addArtist } from '$lib/server/addArtist';
import type { RequestEvent } from './$types';

export async function GET({ url }) {
  const id = url.searchParams.get('id');
  const artistId = id ? parseInt(id, 10) : undefined;

  if (artistId && isNaN(artistId)) {
    return json({ error: 'Invalid artist ID' }, { status: 400 });
  }

  const artist = await listArtist(artistId);

  if (artistId && !artist) {
    return json({ error: 'Artist not found' }, { status: 404 });
  }

  return json(artist, { status: 200 });
}

export async function POST({ request }: RequestEvent) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const profile = formData.get('profile') as string;
    const image = formData.get('image') as File;

    const artist = await addArtist(name, profile, image);
    return json(artist);
  } catch (error) {
    return new Response('Failed to create artist', { status: 500 });
  }
}
