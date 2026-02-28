import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../../store/authStore'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

export default function Profile() {

  const { logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView contentContainerStyle={styles.profileScrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.contentWrap}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Text style={styles.pageSubtitle}>Manage your account details</Text>

          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60' }}
                style={styles.avatarImage}
              />
              <View style={styles.avatarBadge}>
                <Ionicons name="phone-portrait-outline" size={14} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.welcomeText}>Welcome <Text style={styles.username}>{user.username}</Text></Text>
            <Text style={styles.captionText}>This App Is Still A Work In Progress</Text>
          </View>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9'
  },
  username: {
    color: '#2563EB'
  },
  container: {
    flex: 1
  },
  profileScrollContent: {
    flexGrow: 1
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A'
  },
  pageSubtitle: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 14,
    color: '#64748B'
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center'
  },
  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#DBEAFE',
    marginBottom: 14
  },
  avatarImage: {
    width: '100%',
    height: '100%'
  },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  welcomeText: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center'
  },
  captionText: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19
  },
  logoutButton: {
    marginTop: 16,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16
  }
})
