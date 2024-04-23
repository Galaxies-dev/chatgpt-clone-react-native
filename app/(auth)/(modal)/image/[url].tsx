import { Ionicons, Octicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { downloadAndSaveImage, shareImage } from '@/utils/Image';
import DropDownMenu from '@/components/DropDownMenu';

const Page = () => {
  const { url } = useLocalSearchParams<{ url: string }>();
  const { bottom } = useSafeAreaInsets();

  const onShowPrompt = () => {};

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <DropDownMenu
              items={[
                { key: '1', title: 'View prompt', icon: 'info.circle' },
                { key: '2', title: 'Learn more', icon: 'questionmark.circle' },
              ]}
              onSelect={onShowPrompt}
            />
          ),
        }}
      />
      <ImageZoom
        uri={'https://galaxies.dev/img/meerkat_2.jpg'}
        minScale={0.5}
        maxScale={5}
        minPanPointers={1}
        doubleTapScale={2}
        isSingleTapEnabled
        isDoubleTapEnabled
        style={styles.image}
        resizeMode="contain"
      />

      <BlurView intensity={95} tint={'dark'} style={[styles.blurview, { paddingBottom: bottom }]}>
        <View style={styles.row}>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Ionicons name="brush-outline" size={24} color="white" />
            <Text style={styles.btnText}>Select</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => downloadAndSaveImage(url)}>
            <Octicons name="download" size={24} color="white" />
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => shareImage(url)}>
            <Octicons name="share" size={24} color="white" />
            <Text style={styles.btnText}>Share</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  blurview: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
    paddingTop: 6,
  },
});
export default Page;
