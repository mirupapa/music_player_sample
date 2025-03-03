<script lang="ts">
import type { SongWithArtist } from '$lib/type';
import SongCard from '$lib/components/SongCard.svelte';
import { onMount } from 'svelte';
import { favoriteIds } from '$lib/module/favorite';
import { get } from 'svelte/store';

let songs: SongWithArtist[] = [];

async function loadFavorites() {
  const ids = get(favoriteIds);
  if (ids.length > 0) {
    const response = await fetch(`/api/songs?ids=${ids.join(',')}`);
    if (response.ok) {
      songs = await response.json();
    }
  } else {
    songs = [];
  }
}

onMount(() => {
  loadFavorites();
  favoriteIds.subscribe(() => {
    loadFavorites();
  });
});
</script>

<div class="p-8">
  <h1 class="text-2xl font-bold text-white mb-8">お気に入り</h1>

  {#if songs.length === 0}
    <p class="text-white text-center">お気に入りに追加されている曲はありません</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {#each songs as song}
        <SongCard {song} />
      {/each}
    </div>
  {/if}
</div>
