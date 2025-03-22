<script lang="ts">
  import { goto } from '$app/navigation';

  let name = '';
  let profile = '';
  let imageFile: File | null = null;
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

  async function handleSubmit() {
    if (!name) {
      error = 'アーティスト名を入力してください';
      return;
    }

    isSubmitting = true;
    error = null;

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('profile', profile);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch('/api/artists', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        error = data.error || 'アーティストの追加に失敗しました';
        return;
      }

      const artist = await response.json();
      goto(`/artists/${artist.id}`);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="p-8  mb-20">
  <h1 class="text-2xl font-bold text-gray-800 mb-8">アーティストを追加</h1>

  <form on:submit|preventDefault={handleSubmit} class="max-w-2xl">
    {#if error}
      <div class="bg-red-500 text-white p-4 rounded mb-4">
        {error}
      </div>
    {/if}

    <div class="mb-6">
      <label class="block text-gray-800 mb-2" for="name">
        アーティスト名 *
      </label>
      <input
        type="text"
        id="name"
        bind:value={name}
        class="w-full p-2 rounded bg-white text-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
      />
    </div>

    <div class="mb-6">
      <label class="block text-gray-800 mb-2" for="profile">
        プロフィール
      </label>
      <textarea
        id="profile"
        bind:value={profile}
        rows="4"
        class="w-full p-2 rounded bg-white text-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
      ></textarea>
    </div>

    <div class="mb-6">
      <label class="block text-gray-800 mb-2" for="image">
        アーティスト画像
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
        href="/"
        class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        キャンセル
      </a>
    </div>
  </form>
</div>
