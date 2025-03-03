<script lang="ts">
  import type { ArtistWithSongs } from '$lib/type';
  import type { SongWithArtist } from '$lib/type';
  import SongCard from '$lib/components/SongCard.svelte';
  import { page } from '$app/stores';

  let artist: ArtistWithSongs;
  let songs: SongWithArtist[] = [];

  async function loadData() {
    const artistId = $page.params.id;
    const artistRes = await fetch(`/api/artists?id=${artistId}`);
    const artistData = await artistRes.json();
    artist = artistData;

    const songsRes = await fetch(`/api/songs?artistId=${artistId}`);
    const songsData = await songsRes.json();
    songs = songsData;
  }

  loadData();
</script>

{#if artist}
<div class="p-8">
  <div class="bg-gray-800 rounded-lg p-8 mb-8">
    <div class="flex gap-8">
      <div class="w-48 h-48 flex-shrink-0">
        <img 
          src={artist.image ?? '/img/artist_default.webp'} 
          alt={artist.name}
          class="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div>
        <h1 class="text-3xl font-bold text-white mb-4">{artist.name}</h1>
        <p class="text-gray-300">{artist.profile}</p>
      </div>
    </div>
  </div>

  <h2 class="text-2xl font-bold text-white mb-6">曲一覧</h2>
  <div class="grid grid-cols-3 gap-6">
    {#each songs as song}
      <SongCard {song} />
    {/each}
  </div>
</div>
{/if}
