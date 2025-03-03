import { json } from '@sveltejs/kit';
import { incrementPlayCount } from '$lib/server/incrementPlayCount';

export async function PUT({ params }) {
  try {
    const songId = parseInt(params.id);
    const updatedSong = await incrementPlayCount(songId);
    return json(updatedSong);
  } catch (error) {
    return new Response('Failed to increment play count', { status: 500 });
  }
} 