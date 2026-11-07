import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';
import { isAllowedEmail } from './domain';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && isAllowedEmail(firebaseUser.email)) {
        setUser(firebaseUser);
      } else {
        setUser(null);
        if (firebaseUser) await signOut(auth);
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  async function loginWithGoogleIdToken(idToken) {
    if (!idToken) throw new Error('Google did not return an ID token.');
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);

    if (!result.user.emailVerified || !isAllowedEmail(result.user.email)) {
      await signOut(auth);
      throw new Error(
        'Access restricted. Please login using your official domain email.'
      );
    }
    return result.user;
  }

  async function loginOnWeb() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);

    if (!result.user.emailVerified || !isAllowedEmail(result.user.email)) {
      await signOut(auth);
      throw new Error(
        'Access restricted. Please login using your official domain email.'
      );
    }
    return result.user;
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, initializing, loginWithGoogleIdToken, loginOnWeb, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
