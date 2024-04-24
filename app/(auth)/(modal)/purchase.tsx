import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useRevenueCat } from '@/providers/RevenueCat';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Page = () => {
  const { packages, purchasePackage } = useRevenueCat();
  const { bottom } = useSafeAreaInsets();
  const pack = packages.find((p) => p.identifier === 'dalle');
  const router = useRouter();

  const purchaseDalle = async () => {
    try {
      await purchasePackage(pack!);
      router.dismiss();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[defaultStyles.pageContainer, { paddingBottom: bottom, paddingHorizontal: 16 }]}>
      <Text style={styles.header}>Unlock more power</Text>
      <Image
        source={{
          uri: 'https://www.revenuecat.com/static/0680d9461284d03e2c92c50b5d27b4f4/f6f12/backend.webp',
        }}
        style={styles.image}
      />

      <Text style={styles.description}>
        Get access to more features by unlocking DallE for just {pack?.product.priceString}!
      </Text>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
        onPress={purchaseDalle}>
        <Text style={styles.btnText}>Buy now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    marginVertical: 20,
    resizeMode: 'contain',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
  },
});
export default Page;
