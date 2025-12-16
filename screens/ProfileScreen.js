import {
    View,
    Text,
    StyleSheet,
    Pressable,
    useWindowDimensions,
    FlatList,
    ActivityIndicator,
  } from 'react-native';
  import { useEffect, useState } from 'react';
  import { Ionicons } from '@expo/vector-icons';
  import { COLORS, SPACING, RADII, FONTS } from '../theme';
  
  const API_BASE_URL = 'http://192.168.1.16:3000';

  
  export default function ProfileScreen() {
    const [theme, setTheme] = useState('light');
    const currentTheme = COLORS[theme];
  
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 500;
  
    const [profiles, setProfiles] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 10;
  
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
  
    const toggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light');
    };
  
    const fetchProfiles = async (pageToLoad, replace = false) => {
      try {
        setError(null);
        if (replace) setLoading(true);
        else setLoadingMore(true);
  
        const res = await fetch(
          `${API_BASE_URL}/profiles?page=${pageToLoad}&limit=${limit}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
        const data = await res.json();
  
        setProfiles(prev => (replace ? data : [...prev, ...data]));
        setPage(pageToLoad);
      } catch (e) {
        setError(`Server'a bağlanamadı: ${String(e.message || e)}`);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
  
    useEffect(() => {
      fetchProfiles(1, true);
    }, []);
  
    const renderItem = ({ item }) => (
      <View
        style={[
          styles.card,
          {
            backgroundColor: currentTheme.card,
            padding: isLargeScreen ? SPACING.xl : SPACING.lg,
            width: isLargeScreen ? '60%' : '90%',
          },
        ]}
      >
        <Ionicons
          name="person-circle-outline"
          size={isLargeScreen ? 100 : 80}
          color={currentTheme.text}
        />
  
        <Text style={[styles.name, { color: currentTheme.text }]}>{item.name}</Text>
  
        <Text style={[styles.role, { color: currentTheme.text }]}>
          {item.email}
        </Text>
  
        <Pressable
          style={({ pressed }) => [
            styles.likeButton,
            { backgroundColor: pressed ? '#e63946' : '#ff6b6b' },
          ]}
          onPress={() => console.log(`Profil Beğenildi! id=${item.id}`)}
        >
          <Ionicons name="heart" size={24} color="#fff" />
          <Text style={styles.likeText}>Beğen</Text>
        </Pressable>
      </View>
    );
  
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.bg }]}>
        <Pressable onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons
            name={theme === 'light' ? 'moon' : 'sunny'}
            size={28}
            color={currentTheme.text}
          />
        </Pressable>
  
        <Text style={[styles.title, { color: currentTheme.text }]}>
          Profil Kartları (Server)
        </Text>
  
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={[styles.error, { color: currentTheme.text }]}>{error}</Text>
        ) : (
          <FlatList
            data={profiles}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            onEndReached={() => {
              if (!loadingMore) fetchProfiles(page + 1, false);
            }}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator style={{ marginTop: 12 }} /> : null
            }
          />
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1 },
    themeToggle: {
      position: 'absolute',
      top: 50,
      right: 20,
      padding: SPACING.sm,
      zIndex: 10,
    },
    title: {
      marginTop: 90,
      textAlign: 'center',
      fontFamily: FONTS.bold,
      fontSize: 18,
      marginBottom: SPACING.md,
    },
    listContent: {
      alignItems: 'center',
      paddingBottom: 40,
    },
    card: {
      borderRadius: RADII.md,
      alignItems: 'center',
      marginBottom: SPACING.lg,
  
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    name: {
      fontFamily: FONTS.bold,
      fontSize: 24,
      marginTop: SPACING.md,
    },
    role: {
      fontFamily: FONTS.regular,
      fontSize: 14,
      marginTop: SPACING.sm,
      opacity: 0.7,
    },
    likeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.lg,
      borderRadius: 50,
      marginTop: SPACING.md,
    },
    likeText: {
      color: '#fff',
      fontFamily: FONTS.bold,
      fontSize: 16,
      marginLeft: SPACING.sm,
    },
    error: {
      textAlign: 'center',
      marginTop: 20,
      paddingHorizontal: 20,
      fontFamily: FONTS.regular,
    },
  });
  