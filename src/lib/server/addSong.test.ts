import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { addSong } from './addSong';
import { addArtist } from './addArtist';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

describe('addSong', () => {
  const testImageBuffer = Buffer.from('dummy image content');
  const testAudioBuffer = Buffer.from('dummy audio content');
  let testArtistId: number;

  beforeAll(async () => {
    // テスト用のディレクトリを作成
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // テスト用のアーティストを作成
    const testArtistImage = new File([testImageBuffer], 'test-artist.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });
    testArtistImage.arrayBuffer = async function() {
      return testImageBuffer.buffer;
    };

    const artist = await addArtist('Test Artist', 'Test Profile', testArtistImage);
    testArtistId = artist.id;
  });

  afterAll(async () => {
    // テストデータを削除
    await prisma.song.deleteMany({
      where: { artistId: testArtistId }
    });
    await prisma.artist.delete({
      where: { id: testArtistId }
    });

    // アップロードされたファイルを削除
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    fs.readdirSync(uploadDir).forEach(file => {
      if (file.startsWith('test')) {
        fs.unlinkSync(path.join(uploadDir, file));
      }
    });

    await prisma.$disconnect();
  });

  it('should add a new song to the database', async () => {
    const testAudioFile = new File([testAudioBuffer], 'test-audio.mp3', {
      type: 'audio/mpeg',
      lastModified: new Date().getTime(),
    });
    testAudioFile.arrayBuffer = async function() {
      return testAudioBuffer.buffer;
    };

    const testImageFile = new File([testImageBuffer], 'test-song.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });
    testImageFile.arrayBuffer = async function() {
      return testImageBuffer.buffer;
    };

    const song = await addSong('Test Song', testArtistId, testAudioFile, testImageFile);

    expect(song).toBeDefined();
    expect(song.title).toBe('Test Song');
    expect(song.artistId).toBe(testArtistId);
    expect(song.audio).toMatch(/^\/uploads\/[a-f0-9-]+\.mp3$/);
    expect(song.image).toMatch(/^\/uploads\/[a-f0-9-]+\.png$/);

    // ファイルが実際に保存されているか確認
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    const audioPath = path.join(uploadDir, song.audio.replace('/uploads/', ''));
    const imagePath = path.join(uploadDir, song.image?.replace('/uploads/', '') || '');

    expect(fs.existsSync(audioPath)).toBe(true);
    expect(fs.existsSync(imagePath)).toBe(true);
  });
}); 