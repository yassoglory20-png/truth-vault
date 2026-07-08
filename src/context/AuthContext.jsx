import React, { createContext, useState, useEffect, useCallback } from 'react';
import { onAuthChange } from '@services/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@config/firebase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};
          setUser({
            uid: firebaseUser.uid, email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.displayName || 'Anonymous',
            photoURL: firebaseUser.photoURL,
            role: userData.role || 'reader',
            bookmarks: userData.bookmarks || [],
            ...userData,
          });
        } else { setUser(null); }
      } catch (err) { setError(err.message); setUser(null); }
      finally { setLoading(false); }
    });
    return () => unsubscribe();
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user?.uid) return;
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) setUser(prev => ({ ...prev, ...userSnap.data() }));
  }, [user?.uid]);

  return (
    <AuthContext.Provider value={{ user, loading, error, isAdmin: user?.role === 'admin' || user?.role === 'editor', refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
