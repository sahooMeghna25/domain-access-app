import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_CLIENT_IDS, ALLOWED_DOMAIN } from '../src/config';
import { useAuth } from '../src/auth/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { user, loginOnWeb, loginWithGoogleIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_CLIENT_IDS.web,
    androidClientId: GOOGLE_CLIENT_IDS.android,
    iosClientId: GOOGLE_CLIENT_IDS.ios,
    scopes: ['openid', 'profile', 'email'],
    responseType: 'id_token',
  });

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user]);

  useEffect(() => {
    async function finishNativeLogin() {
      if (Platform.OS === 'web' || response?.type !== 'success') return;
      try {
        setLoading(true);
        const idToken =
          response.authentication?.idToken || response.params?.id_token;
        await loginWithGoogleIdToken(idToken);
        router.replace('/dashboard');
      } catch (err) {
        setError(err.message || 'Unable to sign in. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    finishNativeLogin();
  }, [response]);

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        await loginOnWeb();
        router.replace('/dashboard');
      } else {
        await promptAsync();
      }
    } catch (err) {
      setError(
        err.message?.includes('Access restricted')
          ? err.message
          : 'Login failed. Please check your Google account and try again.'
      );
      setLoading(false);
    } finally {
      if (Platform.OS === 'web') setLoading(false);
    }
  }

  return (
    <View style={styles.page}>
      <View style={styles.card}>
        <View style={styles.logo}><Text style={styles.logoText}>H+</Text></View>
        <Text style={styles.eyebrow}>SECURE WORKSPACE</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in with your official Google account to continue.
        </Text>

        <Pressable
          accessibilityRole="button"
          disabled={loading || (Platform.OS !== 'web' && !request)}
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.googleButton,
            (pressed || loading) && styles.pressed,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#172033" />
          ) : (
            <>
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.buttonText}>Continue with Google</Text>
            </>
          )}
        </Pressable>

        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <View style={styles.domainNote}>
          <Text style={styles.domainLabel}>AUTHORIZED DOMAIN</Text>
          <Text style={styles.domain}>{'@' + ALLOWED_DOMAIN}</Text>
        </View>
        <Text style={styles.footer}>Access is limited to approved organization accounts.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, minHeight: '100%', backgroundColor: '#F3F6FC', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 430, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 32, alignItems: 'center', shadowColor: '#14213D', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 4 },
  logo: { width: 54, height: 54, borderRadius: 16, backgroundColor: '#3157D5', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  logoText: { color: '#FFFFFF', fontWeight: '800', fontSize: 20 },
  eyebrow: { color: '#3157D5', fontSize: 11, fontWeight: '800', letterSpacing: 1.8 },
  title: { color: '#172033', fontSize: 30, fontWeight: '800', marginTop: 10 },
  subtitle: { color: '#697386', fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 10, marginBottom: 28 },
  googleButton: { width: '100%', minHeight: 52, borderWidth: 1, borderColor: '#DCE2EC', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#FFFFFF' },
  pressed: { opacity: 0.65 },
  googleG: { fontSize: 19, fontWeight: '800', color: '#4285F4' },
  buttonText: { color: '#172033', fontWeight: '700', fontSize: 14 },
  error: { color: '#B42318', backgroundColor: '#FEF3F2', padding: 12, borderRadius: 8, marginTop: 16, textAlign: 'center', width: '100%', fontSize: 13 },
  domainNote: { width: '100%', backgroundColor: '#F5F7FF', borderRadius: 10, padding: 14, marginTop: 24, alignItems: 'center' },
  domainLabel: { color: '#697386', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  domain: { color: '#3157D5', fontSize: 15, fontWeight: '800', marginTop: 5 },
  footer: { color: '#929BAD', fontSize: 11, textAlign: 'center', marginTop: 22 }
});
