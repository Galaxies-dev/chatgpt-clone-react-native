import { Ionicons, Octicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { downloadAndSaveImage, shareImage } from '@/utils/Image';
import DropDownMenu from '@/components/DropDownMenu';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef } from 'react';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import { RootSiblingParent } from 'react-native-root-siblings';

const Page = () => {
  const { url, prompt } = useLocalSearchParams<{ url: string; prompt?: string }>();
  const { bottom } = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const onCopyPrompt = () => {
    Clipboard.setStringAsync(prompt!);

    Toast.show('Prompt copied to clipboard', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  return (
    <RootSiblingParent>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <Stack.Screen
            options={{
              headerRight: () => (
                <DropDownMenu
                  items={[
                    { key: '1', title: 'View prompt', icon: 'info.circle' },
                    { key: '2', title: 'Learn more', icon: 'questionmark.circle' },
                  ]}
                  onSelect={handlePresentModalPress}
                />
              ),
            }}
          />
          <ImageZoom
            uri={url}
            minScale={0.5}
            maxScale={5}
            minPanPointers={1}
            doubleTapScale={2}
            isSingleTapEnabled
            isDoubleTapEnabled
            style={styles.image}
            resizeMode="contain"
          />

          <BlurView
            intensity={95}
            tint={'dark'}
            style={[styles.blurview, { paddingBottom: bottom }]}>
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

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: Colors.grey }}
          handleIndicatorStyle={{ backgroundColor: Colors.greyLight }}>
          <View style={[styles.modalContainer, { paddingBottom: bottom, flex: 1 }]}>
            <BottomSheetScrollView>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.titleText}>Prompt</Text>
                  <Pressable onPress={handleCloseModalPress} style={styles.closeBtn}>
                    <Ionicons name="close-outline" size={24} color={Colors.greyLight} />
                  </Pressable>
                </View>
                <Text style={styles.promptText}>{prompt}</Text>
              </View>
            </BottomSheetScrollView>
            <TouchableOpacity
              style={[defaultStyles.btn, { backgroundColor: '#fff', marginTop: 16 }]}
              onPress={onCopyPrompt}>
              <Text style={styles.buttonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </RootSiblingParent>
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
  modalContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  promptText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonText: {
    color: Colors.grey,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  closeBtn: {
    backgroundColor: Colors.dark,
    borderRadius: 20,
    height: 26,
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Page;
