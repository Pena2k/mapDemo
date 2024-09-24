import { StyleSheet, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'

export default function Map() {
  const [location, setLocation] = useState({
    latitude: 61.0800,
    longitude: 25.4800,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markers, setMarkers] = useState([]);
  const [address, setAddress] = useState(null);

  const getUserPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const coords = position.coords;

    setLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    if (reverseGeocode.length > 0) {
      const firstResult = reverseGeocode[0];
      setAddress(`${firstResult.street}, ${firstResult.city}`);
    }
  };

  useEffect(() => {
    getUserPosition();
  }, []);

  const handleLongPress = async (event) => {
    const { coordinate } = event.nativeEvent;

    setMarkers((prevMarkers) => [...prevMarkers, coordinate]);

    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });

    if (reverseGeocode.length > 0) {
      const firstResult = reverseGeocode[0];
      console.log(
        `Marker added at: ${firstResult.street}, ${firstResult.city}`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        region={location}
        mapType="standard"
        provider={MapView.PROVIDER_GOOGLE}
        onLongPress={handleLongPress}
      >
        <Marker
          coordinate={location}
        />

        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: '100%',
    width: '100%',
  },
});
