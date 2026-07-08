import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@config/firebase';

export async function uploadImage(file, path = 'images') {
  if (!file) return null;
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) throw new Error('File size too large. Maximum 5MB allowed.');
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const filename = `${path}/${timestamp}-${randomStr}-${file.name}`;
  const storageRef = ref(storage, filename);
  const metadata = { contentType: file.type, customMetadata: { uploadedAt: new Date().toISOString() } };
  await uploadBytes(storageRef, file, metadata);
  const url = await getDownloadURL(storageRef);
  return { url, path: filename };
}

export async function deleteImage(path) {
  if (!path) return;
  await deleteObject(ref(storage, path));
}

export async function uploadArticleImage(file) { return uploadImage(file, 'articles'); }
export async function uploadProfileImage(file) { return uploadImage(file, 'profiles'); }
