<script lang="ts">
  import { page } from '$app/stores';
</script>

<header class="bg-gray-800 p-4">
  <nav class="container mx-auto flex items-center justify-between">
    <a href="/" class="text-2xl text-white hover:text-gray-300">🚀</a>
    <div class="flex gap-4">
      <a 
        href="/"
        class="text-white hover:text-gray-300 {$page.url.pathname === '/' ? 'underline' : ''}"
      >
        ホーム
      </a>
      <a 
        href="/favorite"
        class="text-white hover:text-gray-300 {$page.url.pathname === '/favorite' ? 'underline' : ''}"
      >
        お気に入り
      </a>
    </div>
  </nav>
</header>
