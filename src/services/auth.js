import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut,
  onAuthStateChanged, updateProfile, sendPasswordResetEmail, deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@config/firebase';

const googleProvider = new GoogleAuthProvider();

export async function registerWithEmail(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    uid: userCredential.user.uid, displayName, email,
    role: 'reader', bookmarks: [], createdAt: serverTimestamp(),
  });
  return userCredential.user;
}

export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function loginWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid, displayName: user.displayName || 'Anonymous',
      email: user.email, photoURL: user.photoURL,
      role: 'reader', bookmarks: [], createdAt: serverTimestamp(),
    });
  }
  return user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function getUserRole(uid) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data().role : 'reader';
}

export async function updateUserProfile(uid, data) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function deleteUserAccount() {
  const user = auth.currentUser;
  if (user) await deleteUser(user);
}
