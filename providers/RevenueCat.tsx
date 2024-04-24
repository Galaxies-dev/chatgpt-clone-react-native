import { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';
import { CustomerInfo } from 'react-native-purchases';

// Use your RevenueCat API keys
const APIKeys = {
  apple: process.env.EXPO_PUBLIC_RC_APPLE_KEY as string,
  google: process.env.EXPO_PUBLIC_RC_GOOGLE_KEY as string,
};

interface RevenueCatProps {
  purchasePackage: (pack: PurchasesPackage) => Promise<void>;
  restorePermissions: () => Promise<CustomerInfo>;
  user: UserState;
  packages: PurchasesPackage[];
}

export interface UserState {
  dalle: boolean;
}

const RevenueCatContext = createContext<Partial<RevenueCatProps>>({});

// Export context for easy usage
export const useRevenueCat = () => {
  return useContext(RevenueCatContext) as RevenueCatProps;
};

// Provide RevenueCat functions to our app
export const RevenueCatProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserState>({ dalle: false });
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        await Purchases.configure({ apiKey: APIKeys.google });
      } else {
        await Purchases.configure({ apiKey: APIKeys.apple });
      }
      setIsReady(true);

      // Use more logging during debug if want!
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      // Listen for customer updates
      Purchases.addCustomerInfoUpdateListener(async (info) => {
        updateCustomerInformation(info);
      });

      // Load all offerings and the user object with entitlements
      await loadOfferings();
    };
    init();
  }, []);

  // Load all offerings a user can (currently) purchase
  const loadOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    if (offerings.current) {
      setPackages(offerings.current.availablePackages);
    }
  };

  // Update user state based on previous purchases
  const updateCustomerInformation = async (customerInfo: CustomerInfo) => {
    const newUser: UserState = { dalle: user.dalle };

    if (customerInfo?.entitlements.active['DallE'] !== undefined) {
      newUser.dalle = true;
    }

    setUser(newUser);
  };

  // Purchase a package
  const purchasePackage = async (pack: PurchasesPackage) => {
    try {
      await Purchases.purchasePackage(pack);

      if (pack.identifier === 'dalle') {
        setUser({ dalle: true });
        Alert.alert('Success', 'You have unlocked DallE!');
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        alert(e);
      }
    }
  };

  // // Restore previous purchases
  const restorePermissions = async () => {
    const customer = await Purchases.restorePurchases();
    return customer;
  };

  const value = {
    restorePermissions,
    user,
    packages,
    purchasePackage,
  };

  // Return empty fragment if provider is not ready (Purchase not yet initialised)
  if (!isReady) return <></>;

  return <RevenueCatContext.Provider value={value}>{children}</RevenueCatContext.Provider>;
};
