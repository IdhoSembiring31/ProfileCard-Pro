import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { usePermissions } from '../hooks/usePermissions';
import { saveProfileData, loadProfileData } from '../utils/storage';

const ProfileCard = () => {
  const [fotoUri, setFotoUri] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [alamat, setAlamat] = useState('');
  const [loading, setLoading] = useState(false);
  const { ensureCameraPermission, ensureGalleryPermission, ensureLocationPermission } = usePermissions();

  // --- Muat data tersimpan saat app dibuka (Level 2: Persistensi) ---
  useEffect(() => {
    loadProfileData().then((data) => {
      if (data?.fotoUri) setFotoUri(data.fotoUri);
      if (data?.lokasi) setLokasi(data.lokasi);
      if (data?.alamat) setAlamat(data.alamat);
    });
  }, []);

  // --- Ambil Foto dari Kamera (Core) ---
  const handleTakePhoto = async () => {
    const hasPermission = await ensureCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    // ✅ Cek canceled sebelum akses assets[0].uri
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFotoUri(uri);
      await saveProfileData({ fotoUri: uri, lokasi, alamat });
    }
  };

  // --- Pilih Foto dari Galeri (Level 2: kedua opsi) ---
  const handlePickGallery = async () => {
    const hasPermission = await ensureGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFotoUri(uri);
      await saveProfileData({ fotoUri: uri, lokasi, alamat });
    }
  };

  // --- Pilih Sumber Foto (Kamera vs Galeri) via Alert (Level 2) ---
  const handleChoosePhotoSource = () => {
    Alert.alert(
      'Pilih Sumber Foto',
      'Ambil foto baru atau pilih dari galeri?',
      [
        { text: '📷 Kamera', onPress: handleTakePhoto },
        { text: '🖼️ Galeri', onPress: handlePickGallery },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  // --- Ambil Koordinat GPS (Core) ---
  const handleGetLocation = async () => {
    const hasPermission = await ensureLocationPermission();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // ✅ Ambil latitude & longitude dari location.coords
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setLokasi(coords);

      // --- Reverse Geocoding (Level 3) ---
      const reverseGeo = await Location.reverseGeocodeAsync(coords);
      if (reverseGeo.length > 0) {
        const place = reverseGeo[0];
        const alamatLengkap = [
          place.name,
          place.street,
          place.district,
          place.city,
          place.region,
          place.country,
        ].filter(Boolean).join(', ');
        setAlamat(alamatLengkap);
      }

      await saveProfileData({ fotoUri, lokasi: coords, alamat });
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil lokasi. Pastikan GPS aktif.');
    } finally {
      setLoading(false);
    }
  };

  // --- Buka Google Maps / GPS ---
  const handleOpenMaps = async () => {
    if (!lokasi) {
      Alert.alert('Info', 'Ambil lokasi terlebih dahulu.');
      return;
    }

    const latitude = lokasi.latitude;
    const longitude = lokasi.longitude;
    const label = 'Lokasi Saya';
    const query = `${latitude},${longitude}`;

    const url = Platform.select({
      ios: `maps://?q=${encodeURIComponent(label)}&ll=${query}`,
      android: `geo:${query}?q=${query}(${encodeURIComponent(label)})`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Tidak dapat membuka peta. Silakan coba lagi.');
    }
  };

  // --- Hapus Foto (Level 3) ---
  const handleResetPhoto = () => {
    Alert.alert(
      'Hapus Foto',
      'Yakin ingin menghapus foto profil?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setFotoUri(null);
            await saveProfileData({ fotoUri: null, lokasi, alamat });
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 ProfileCard Pro</Text>

      {/* Foto Profil */}
      <View style={styles.photoContainer}>
        {fotoUri ? (
          <Image source={{ uri: fotoUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholder]}>
            <Text style={styles.placeholderText}>📷</Text>
          </View>
        )}
      </View>

      {/* Tombol Aksi Foto */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleChoosePhotoSource}>
          <Text style={styles.buttonText}>📸 Ambil/Galeri</Text>
        </TouchableOpacity>
        {fotoUri && (
          <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleResetPhoto}>
            <Text style={styles.buttonText}>🗑️ Hapus</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tombol Lokasi */}
      <TouchableOpacity style={styles.button} onPress={handleGetLocation} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? '⏳ Mengambil...' : '📍 Ambil Lokasi'}</Text>
      </TouchableOpacity>

      {/* Tampilkan Hasil Koordinat */}
      {lokasi && (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>📍 Koordinat:</Text>
          <Text style={styles.infoText}>Latitude: {lokasi.latitude}</Text>
          <Text style={styles.infoText}>Longitude: {lokasi.longitude}</Text>
          {alamat !== '' && (
            <>
              <Text style={styles.infoLabel}>🏠 Alamat:</Text>
              <Text style={styles.infoText}>{alamat}</Text>
            </>
          )}
          <TouchableOpacity style={[styles.button, styles.mapsButton]} onPress={handleOpenMaps}>
            <Text style={styles.buttonText}>🗺️ Buka di Google Maps</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  photoContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  placeholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 50,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#f44336',
  },
  mapsButton: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
    color: '#555',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
});

export default ProfileCard;