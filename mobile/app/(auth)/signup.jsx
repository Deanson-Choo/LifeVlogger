import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'


export default function SignUp () {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const { register } = useAuthStore()

  const handleSignUp = async() => {
    const result = await register(username, email, password)
    if (!result.success) {
      Alert.alert('Sign Up Failed', result.message)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/images/lifevlogger.png')} style={styles.logoImage} />
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.title}>Create Account</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.subtitle}>New to LifeVlogger? Or </Text>
              <Link href="/" style={[styles.subtitle, { color: '#2563EB' }]}>Login Here</Link>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                placeholder='Enter your username'
                placeholderTextColor='#94A3B8'
                style={styles.input}
                autoCapitalize='none'
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder='Enter your email'
                placeholderTextColor='#94A3B8'
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder='Enter your password'
                placeholderTextColor='#94A3B8'
                style={styles.input}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  logoImage: {
    width: '100%',
    height: 260,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  signupContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingTop: 28,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 18,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 24,
    fontSize: 14,
    color: '#64748B',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  signupButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
})
