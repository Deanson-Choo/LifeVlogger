import { API_URL } from '../../constants/api'
import { View, Text, StyleSheet, Image, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

export default function Home () {
  const [posts, setPosts] = useState([])
  const { token } = useAuthStore()

  const [refreshing, setRefreshing] = useState(false)

  const fetchPosts = async () => {
    setRefreshing(true)
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (!token) return

    fetchPosts()
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.contentWrap}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Feed</Text>
            <Text style={styles.headerSubtitle}>See the awesome things you have done</Text>
          </View>

          <KeyboardAwareScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />}
          >
            {posts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No posts yet</Text>
                <Text style={styles.emptyText}>You have not shared any moments yet. Start creating posts to see them here.</Text>
              </View>
            ) : (
              posts.map((item) => (
              <View key={item._id?.toString() || item.title} style={styles.postCard}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postContent}>{item.content}</Text>
                <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
                <View style={styles.postMetaRow}>
                  <Text style={styles.postMetaLabel}>By</Text>
                  <Text style={styles.postMetaUser}>{item.user.username}</Text>
                </View>
              </View>
              ))
            )}
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9'
  },
  container: {
    flex: 1
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10
  },
  header: {
    marginBottom: 14
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A'
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B'
  },
  listContent: {
    paddingBottom: 18,
    gap: 12
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  postTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A'
  },
  postContent: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#334155'
  },
  postImage: {
    width: '100%',
    height: 220,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#E2E8F0'
  },
  postMetaRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  postMetaLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.7
  },
  postMetaUser: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600'
  },
  emptyState: {
    marginTop: 40,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF'
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A'
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B'
  }
})
