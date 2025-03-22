<script lang="ts">
  import "../app.css";
  import Header from '$lib/components/Header.svelte';
  import Player from '$lib/components/Player.svelte';
</script>

<div class="min-h-screen pb-[50px]">
  <Header />
  <slot />
</div>

<Player />