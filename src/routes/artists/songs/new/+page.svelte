<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let title = '';
  let description = '';
  let imageFile: File | null = null;
  let songFile: File | null = null;
  let previewUrl: string | null = null;
  let isSubmitting = false;
  let error: string | null = null;

  function handleImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      imageFile = input.files[0];
      previewUrl = URL.createObjectURL(input.files[0]);
    }
  }

  function handleSongFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      songFile = input.files[0];
    }
  }

  async function handleSubmit() {
    if (!title) {
      error = '曲名を入力してください';
      return;
    }

    if (!songFile) {
      error = '曲ファイルを選択してください';
      return;
    }

    isSubmitting = true;
    error = null;

    const artistId = $page.url.searchParams.get('id') || '';
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('artistId', artistId);
    formData.append('audio', songFile);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch('/api/songs', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const data = await response.json();
      error = data.error || '曲の追加に失敗しました';
      isSubmitting = false;
      return;
    }

    const song = await response.json();
    goto(`/artists/${artistId}`);
  }
</script>

<div class="p-8 mb-20">
  <h1 class="text-2xl font-bold text-gray-800 mb-8">曲を追加</h1>

  <form on:submit|preventDefault={handleSubmit} class="max-w-2xl">
    {#if error}
      <div class="bg-red-500 text-white p-4 rounded mb-4">
        {error}
      </div>
    {/if}

    <div class="mb-6">
      <label class="block text-gray-800 mb-2" for="title">
        曲名 *
      </label>
      <input
        type="text"
        id="title"
        bind:value={title}
        class="w-full p-2 rounded bg-white text-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
      />
    </div>

    <div class="mb-6">
      <label class="block text-gray-800 mb-2" for="description">
        説明
      </label>
      <textarea
        id="description"
        bind:value={description}
        rows="4"
        class="w-full p-2 rounded bg-white text-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
      ></textarea>
    </div>

    <div class="mb-6">
      <label class="block text-gray-800 mb-2" for="songFile">
        曲ファイル *
      </label>
      <input
        type="file"
        id="songFile"
        accept="audio/*"
        on:change={handleSongFileChange}
        class="text-gray-800"
        required
      />
    </div>

    <div class="mb-6">
      <label class="block text-gray-800 mb-2" for="image">
        曲のカバー画像
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        on:change={handleImageChange}
        class="text-gray-800"
      />
      {#if previewUrl}
        <div class="mt-4">
          <img src={previewUrl} alt="プレビュー" class="w-48 h-48 object-cover rounded" />
        </div>
      {/if}
    </div>

    <div class="flex gap-4">
      <button
        type="submit"
        disabled={isSubmitting}
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '送信中...' : '追加する'}
      </button>
      <a
        href="/artists/{$page.params.id}"
        class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        キャンセル
      </a>
    </div>
  </form>
</div>
