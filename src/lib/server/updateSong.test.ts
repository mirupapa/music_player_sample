import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { updateSong } from './updateSong';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

describe('updateSong', () => {
  const testImageBuffer = Buffer.from('dummy image content');
  const testAudioBuffer = Buffer.from('dummy audio content');
  let testSongId: number;

  beforeAll(async () => {
    // テスト用のディレクトリを作成
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // テスト用のアーティストを作成
    const artist = await prisma.artist.create({
      data: {
        name: 'Test Artist',
        profile: 'Test Profile',
      }
    });

    // テスト用の曲を作成
    const song = await prisma.song.create({
      data: {
        title: 'Original Song',
        artistId: artist.id,
        audio: '/uploads/original-audio.mp3',
        image: '/uploads/original-image.png'
      }
    });
    testSongId = song.id;
  });

  afterAll(async () => {
    // テストデータを削除
    const song = await prisma.song.findUnique({
      where: { id: testSongId },
      include: { artist: true }
    });

    if (song) {
      await prisma.song.delete({
        where: { id: testSongId }
      });
      await prisma.artist.delete({
        where: { id: song.artist.id }
      });
    }

    // アップロードされたファイルを削除
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    fs.readdirSync(uploadDir).forEach(file => {
      if (file.startsWith('test')) {
        fs.unlinkSync(path.join(uploadDir, file));
      }
    });

    await prisma.$disconnect();
  });

  it('should update an existing song in the database', async () => {
    const testAudioFile = new File([testAudioBuffer], 'test-audio.mp3', {
      type: 'audio/mpeg',
      lastModified: new Date().getTime(),
    });
    testAudioFile.arrayBuffer = async function() {
      return testAudioBuffer.buffer;
    };

    const testImageFile = new File([testImageBuffer], 'test-image.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });
    testImageFile.arrayBuffer = async function() {
      return testImageBuffer.buffer;
    };

    const updatedSong = await updateSong(testSongId, 'Updated Song', testImageFile, testAudioFile);

    expect(updatedSong).toBeDefined();
    expect(updatedSong.title).toBe('Updated Song');
    expect(updatedSong.audio).toBe('/uploads/test-audio.mp3');
    expect(updatedSong.image).toBe('/uploads/test-image.png');

    // ファイルが実際に保存されているか確認
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    const audioPath = path.join(uploadDir, 'test-audio.mp3');
    const imagePath = path.join(uploadDir, 'test-image.png');

    expect(fs.existsSync(audioPath)).toBe(true);
    expect(fs.existsSync(imagePath)).toBe(true);
  });

  it('should update only title when no files are provided', async () => {
    const originalSong = await prisma.song.findUnique({
      where: { id: testSongId }
    });

    const updatedSong = await updateSong(testSongId, 'Updated Title Only');

    expect(updatedSong).toBeDefined();
    expect(updatedSong.title).toBe('Updated Title Only');
    expect(updatedSong.audio).toBe(originalSong?.audio);
    expect(updatedSong.image).toBe(originalSong?.image);
  });
}); 