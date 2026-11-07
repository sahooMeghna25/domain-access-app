import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/auth/AuthContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, initializing, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace('/');
  }

  if (initializing || !user) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#3157D5" /></View>;
  }

  return (
    <View style={styles.page}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>H+ Workspace</Text>
        <Pressable onPress={handleLogout} style={styles.logout}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>YOUR WORKSPACE</Text>
        <Text style={styles.heading}>Welcome, {user.displayName?.split(' ')[0] || 'User'}!</Text>
        <Text style={styles.description}>You have successfully signed in with an authorized organization account.</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.displayName || 'Organization User'}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.status}>●  Authenticated</Text>
          </View>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Access granted</Text>
          <Text style={styles.infoText}>Your account passed Google authentication and the organization email-domain check.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, minHeight: '100%', backgroundColor: '#F3F6FC' },
  topBar: { height: 72, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E8ECF3', paddingHorizontal: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: '#172033', fontSize: 17, fontWeight: '800' },
  logout: { borderWidth: 1, borderColor: '#DCE2EC', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 9 },
  logoutText: { color: '#344054', fontSize: 13, fontWeight: '700' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 28, paddingTop: 56 },
  eyebrow: { color: '#3157D5', fontWeight: '800', fontSize: 11, letterSpacing: 1.5 },
  heading: { color: '#172033', fontWeight: '800', fontSize: 32, marginTop: 10 },
  description: { color: '#697386', fontSize: 15, lineHeight: 23, marginTop: 8, marginBottom: 28 },
  profileCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 22, flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 1, borderColor: '#E8ECF3' },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#E8EDFF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#3157D5', fontSize: 20, fontWeight: '800' },
  name: { color: '#172033', fontSize: 16, fontWeight: '800' },
  email: { color: '#697386', fontSize: 13, marginTop: 4 },
  status: { color: '#16804A', fontSize: 12, fontWeight: '700', marginTop: 7 },
  infoCard: { backgroundColor: '#EEF3FF', borderRadius: 12, padding: 20, marginTop: 18 },
  infoTitle: { color: '#2445B2', fontSize: 15, fontWeight: '800' },
  infoText: { color: '#52627E', fontSize: 13, lineHeight: 21, marginTop: 6 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
