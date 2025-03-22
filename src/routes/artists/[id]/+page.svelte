<script lang="ts">
  import type { ArtistWithSongs } from '$lib/type';
  import type { SongWithArtist } from '$lib/type';
  import SongCard from '$lib/components/SongCard.svelte';
  import { page } from '$app/stores';  
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let artist: ArtistWithSongs;
  let songs: SongWithArtist[] = [];

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    const artistId = $page.params.id;
    const artistRes = await fetch(`/api/artists?id=${artistId}`);
    const artistData = await artistRes.json();
    artist = artistData;

    const songsRes = await fetch(`/api/songs?artistId=${artistId}`);
    const songsData = await songsRes.json();
    songs = songsData;
  } 
</script>

{#if artist}
<div class="p-8 mb-10">
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

  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-white">曲一覧</h2>
    <button 
      on:click={() => goto(`/artists/songs/new?id=${$page.params.id}`)}
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      曲を追加
    </button>
  </div>

  <div class="grid grid-cols-3 gap-6">
    {#each songs as song}
      <SongCard {song} />
    {/each}
  </div>
</div>
{/if}
