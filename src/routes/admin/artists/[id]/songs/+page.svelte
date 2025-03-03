<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { page } from '$app/stores';
    import type { SongWithArtist } from '$lib/type';

    let showModal = writable(false);
    let showEditModal = writable(false);
    let newSongTitle = '';
    let newSongAudio: File | null = null;
    let newSongImage: File | null = null;
    let songs = writable<SongWithArtist[]>([]);
    let editingSong: SongWithArtist | null = null;
    let editSongTitle = '';

    const fetchSongs = async () => {
        const response = await fetch(`/api/songs?artistId=${$page.params.id}`);
        const data = await response.json();
        songs.set(data);
    };

    const addSong = async () => {
        const formData = new FormData();
        formData.append('title', newSongTitle);
        formData.append('artistId', $page.params.id);
        if (newSongAudio) {
            formData.append('audio', newSongAudio);
        }
        if (newSongImage) {
            formData.append('image', newSongImage);
        }

        const response = await fetch('/admin/api/songs', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showModal.set(false);
            newSongTitle = '';
            newSongAudio = null;
            newSongImage = null;
            fetchSongs();
        }
    };

    const editSong = async () => {
        if (!editingSong) return;

        const formData = new FormData();
        formData.append('id', editingSong.id.toString());
        formData.append('title', editSongTitle);
        if (newSongAudio) {
            formData.append('audio', newSongAudio);
        }
        if (newSongImage) {
            formData.append('image', newSongImage);
        }

        const response = await fetch('/admin/api/songs', {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            showEditModal.set(false);
            editingSong = null;
            editSongTitle = '';
            newSongAudio = null;
            newSongImage = null;
            fetchSongs();
        }
    };

    const openEditModal = (song: SongWithArtist) => {
        editingSong = song;
        editSongTitle = song.title;
        showEditModal.set(true);
    };

    onMount(fetchSongs);
</script>

<div class="p-4">
    <button 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
        on:click={() => showModal.set(true)}
    >
        新規曲追加
    </button>
</div>

{#if $songs.length === 0}
    <p class="text-center text-gray-500">曲が登録されていません</p>
{:else}
    <table class="min-w-full bg-gray-800 text-white">
        <thead>
            <tr>
                <th class="py-2 px-4 border-b border-gray-700">曲名</th>
                <th class="py-2 px-4 border-b border-gray-700">アートワーク</th>
                <th class="py-2 px-4 border-b border-gray-700">プレビュー</th>
                <th class="py-2 px-4 border-b border-gray-700">操作</th>
            </tr>
        </thead>
        <tbody>
            {#each $songs as song}
                <tr>
                    <td class="py-2 px-4 border-b border-gray-700">{song.title}</td>
                    <td class="py-2 px-4 border-b border-gray-700">
                        <img 
                            src={song.image || '/img/song_default.webp'} 
                            alt={song.title} 
                            class="h-16 w-16 object-cover rounded"
                        />
                    </td>
                    <td class="py-2 px-4 border-b border-gray-700">
                        <audio controls src={song.audio} class="w-full">
                            <track kind="captions" />
                        </audio>
                    </td>
                    <td class="py-2 px-4 border-b border-gray-700">
                        <button
                            class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            on:click={() => openEditModal(song)}
                        >
                            編集
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}

{#if $showModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
            <h2 class="text-xl font-bold mb-4 text-white">新規曲追加</h2>
            <form on:submit|preventDefault={addSong} class="space-y-4">
                <div>
                    <label for="title" class="block text-white mb-2">曲名</label>
                    <input
                        type="text"
                        id="title"
                        bind:value={newSongTitle}
                        class="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>
                <div>
                    <label for="audio" class="block text-white mb-2">音声ファイル</label>
                    <input
                        type="file"
                        id="audio"
                        accept="audio/*"
                        on:change={(e) => newSongAudio = e.target.files?.[0] || null}
                        class="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>
                <div>
                    <label for="image" class="block text-white mb-2">曲画像</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        on:change={(e) => newSongImage = e.target.files?.[0] || null}
                        class="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div class="flex justify-end space-x-2">
                    <button
                        type="button"
                        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        on:click={() => showModal.set(false)}
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        追加
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

{#if $showEditModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
            <h2 class="text-xl font-bold mb-4 text-white">曲を編集</h2>
            <form on:submit|preventDefault={editSong} class="space-y-4">
                <div>
                    <label for="editTitle" class="block text-white mb-2">曲名</label>
                    <input
                        type="text"
                        id="editTitle"
                        bind:value={editSongTitle}
                        class="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>
                <div>
                    <label for="editAudio" class="block text-white mb-2">音声ファイル (変更する場合のみ)</label>
                    <input
                        type="file"
                        id="editAudio"
                        accept="audio/*"
                        on:change={(e) => newSongAudio = e.target.files?.[0] || null}
                        class="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <label for="editImage" class="block text-white mb-2">曲画像 (変更する場合のみ)</label>
                    <input
                        type="file"
                        id="editImage"
                        accept="image/*"
                        on:change={(e) => newSongImage = e.target.files?.[0] || null}
                        class="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div class="flex justify-end space-x-2">
                    <button
                        type="button"
                        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        on:click={() => showEditModal.set(false)}
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        更新
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
