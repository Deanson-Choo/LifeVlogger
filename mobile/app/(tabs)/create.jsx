import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Linking, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { API_URL } from '../../constants/api'
import { useAuthStore } from '../../store/authStore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function Create() {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)

  const [submitting, setSubmitting] = useState(false)

  const { token } = useAuthStore()

  const toDataUri = (base64, mimeType = 'image/jpeg') => `data:${mimeType};base64,${base64}`

  // Handles permission flow:
  // - Re-ask if the OS still allows prompting
  // - Redirect to Settings if user permanently denied access
  const ensureMediaPermission = async () => {
    const current = await ImagePicker.getMediaLibraryPermissionsAsync()

    if (current.granted) {
      return true
    }

    if (current.canAskAgain) {
      const asked = await ImagePicker.requestMediaLibraryPermissionsAsync()
      return asked.granted
    }

    Alert.alert(
      'Permission Needed',
      'Photo access is disabled. Please enable it in Settings to select an image.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    )

    return false
  }

  const getBase64WithFallback = async (asset) => {
    if (!asset?.uri) {
      throw new Error('No image asset URI')
    }

    if (asset.base64) {
      return asset.base64.startsWith('data:')
        ? asset.base64
        : toDataUri(asset.base64, asset.mimeType || 'image/jpeg')
    }

    const fileBase64 = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: 'base64',
    })

    if (!fileBase64) {
      throw new Error('Failed to generate base64 fallback')
    }

    return toDataUri(fileBase64, asset.mimeType || 'image/jpeg')
  }

  const handleSubmit = async() => {
    setSubmitting(true)
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, content, image: imageBase64 })
    })
    if (response.ok) {
      alert("Post created successfully")
      setTitle('')
      setContent('')
      setImage(null)
      setImageBase64(null)
      setSubmitting(false)
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Failed to create post");
      setSubmitting(false)
    }
  }

  const pickImage = async () => {
    Keyboard.dismiss() 
    try {
      // 1) Permission gate: re-ask if possible, otherwise route user to Settings
      const hasPermission = await ensureMediaPermission()

      if (!hasPermission) {
        return
      }

      // 2. Launch Picker with optimized settings
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3, 
        base64: true,  
      });

      if (result.canceled || !result.assets?.length) return;

      // 3. Extract asset data
      const asset = result.assets[0];
      
      // Set local URI for the <Image /> preview
      setImage(asset.uri);

      // 4. Handle Base64 formatting with fallback
      const base64String = await getBase64WithFallback(asset)

      setImageBase64(base64String);

    } catch (error) {
      console.error("ImagePicker Error:", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrap}>
            <Text style={styles.pageTitle}>Create Post</Text>
            <Text style={styles.pageSubtitle}>Document Your Travel Moments</Text>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput placeholder="A catchy title for your moment" placeholderTextColor="#94A3B8" style={styles.input} value={title} onChangeText={setTitle} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Content</Text>
                <TextInput placeholder="What did you do?" placeholderTextColor="#94A3B8" style={[styles.input, styles.contentInput]} multiline textAlignVertical="top" value={content} onChangeText={setContent} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Image</Text>
                <View style={styles.imagePickerBox}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                  ) : (
                    <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                      <Ionicons name="image-outline" size={28} color="#64748B" />
                      <Text style={styles.imagePickerText}>Select an image</Text>
                    </TouchableOpacity>
                  )}
                </View>
            </View>

              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={submitting}><Text style={styles.submitText}>Submit</Text></TouchableOpacity>
            </View>
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
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24
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
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  inputGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8
  },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC'
  },
  contentInput: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12
  },
  imagePickerBox: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    height: 180,
    backgroundColor: '#E2E8F0'
  },
  imagePickerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  imagePickerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569'
  },
  previewImage: {
    width: '100%',
    height: '100%'
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  imageOverlayText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },
  submitButton: {
    marginTop: 4,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16
  }
})
