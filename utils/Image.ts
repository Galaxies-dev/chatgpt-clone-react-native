import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

// https://stackoverflow.com/questions/73706343/i-want-to-download-an-image-with-react-native-expo-from-a-url
export const downloadAndSaveImage = async (imageUrl: string) => {
  let fileUri = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;

  try {
    const res = await FileSystem.downloadAsync(imageUrl, fileUri);
    return saveFile(res.uri);
  } catch (err) {
    console.log('FS Err: ', err);
  }
};

const saveFile = async (fileUri: string) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status === 'granted') {
    try {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album == null) {
        const result = await MediaLibrary.createAlbumAsync('Download', asset, false);
        if (result) {
          Alert.alert('Image saved to Photos');
        }
      } else {
        const result = await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        if (result) {
          Alert.alert('Image saved to Photos');
        }
      }
    } catch (err) {
      console.log('Save err: ', err);
    }
  } else if (status === 'denied') {
    Alert.alert('please allow permissions to download');
  }
};

export const copyImageToClipboard = async (imageUrl: string) => {
  let fileUri = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;

  try {
    const res = await FileSystem.downloadAsync(imageUrl, fileUri);
    const base64 = await FileSystem.readAsStringAsync(res.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Clipboard.setImageAsync(base64);
  } catch (err) {
    console.log('FS Err: ', err);
  }
};

export const shareImage = async (imageUrl: string) => {
  Sharing.shareAsync(imageUrl);
};
