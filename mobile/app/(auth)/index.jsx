import { View, Text, KeyboardAvoidingView, Platform, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { useAuthStore } from '../../store/authStore'

import { useState } from 'react'


export default function Login () {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login, isLoading } = useAuthStore()

  const handleSubmit = async() => {
    const result = await login(email, password)
    if (!result.success) {
      Alert.alert("Login failed", result.message || "Please try again")
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/lifevlogger.png')} style={styles.logoImage} />
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.subtitle}>Login to continue to LifeVlogger or </Text>
            <Link href="/signup" style={[styles.subtitle, {color: '#2563EB'}]}>Sign Up</Link>
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

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  loginContainer: {
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
  loginButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
})
