<script lang="ts">
  import type { ArtistWithSongs } from "$lib/type";

  export let artist: ArtistWithSongs;
</script>

<a href={`/artists/${artist.id}`} class="block">
  <div class="flex flex-col items-center w-48 bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
    <div class="w-48 h-48">
      <img 
        src={artist.image ?? "/img/artist_default.webp"} 
        alt={artist.name}
        class="w-full h-full object-cover"
      />
    </div>
    <div class="p-4 w-full">
      <h3 class="text-white text-lg font-bold text-center truncate">
        {artist.name}
      </h3>
    </div>
  </div>
</a>
