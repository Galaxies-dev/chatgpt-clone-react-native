import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Link, useNavigation, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Alert,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getChats, renameChat } from '@/utils/Database';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useDrawerStatus } from '@react-navigation/drawer';
import { Chat } from '@/utils/Interfaces';
import * as ContextMenu from 'zeego/context-menu';
import { useRevenueCat } from '@/providers/RevenueCat';
import { Keyboard } from 'react-native';

export const CustomDrawerContent = (props: any) => {
  const { bottom, top } = useSafeAreaInsets();
  const db = useSQLiteContext();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [history, setHistory] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadChats();
    Keyboard.dismiss();
  }, [isDrawerOpen]);

  const loadChats = async () => {
    // Load chats from SQLite
    const result = (await getChats(db)) as Chat[];
    setHistory(result);
  };

  const onDeleteChat = (chatId: number) => {
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          // Delete the chat
          await db.runAsync('DELETE FROM chats WHERE id = ?', chatId);
          loadChats();
        },
      },
    ]);
  };

  const onRenameChat = (chatId: number) => {
    Alert.prompt('Rename Chat', 'Enter a new name for the chat', async (newName) => {
      if (newName) {
        // Rename the chat
        await renameChat(db, chatId, newName);
        loadChats();
      }
    });
  };

  return (
    <View style={{ flex: 1, marginTop: top }}>
      <View style={{ backgroundColor: '#fff', paddingBottom: 10 }}>
        <View style={styles.searchSection}>
          <Ionicons style={styles.searchIcon} name="search" size={20} color={Colors.greyLight} />
          <TextInput
            style={styles.input}
            placeholder="Search"
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: '#fff', paddingTop: 0 }}>
        <DrawerItemList {...props} />
        {history.map((chat) => (
          <ContextMenu.Root key={chat.id}>
            <ContextMenu.Trigger>
              <DrawerItem
                label={chat.title}
                onPress={() => router.push(`/(auth)/(drawer)/(chat)/${chat.id}`)}
                inactiveTintColor="#000"
              />
            </ContextMenu.Trigger>
            <ContextMenu.Content>
              <ContextMenu.Preview>
                {() => (
                  <View style={{ padding: 16, height: 200, backgroundColor: '#fff' }}>
                    <Text>{chat.title}</Text>
                  </View>
                )}
              </ContextMenu.Preview>

              <ContextMenu.Item key={'rename'} onSelect={() => onRenameChat(chat.id)}>
                <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
                <ContextMenu.ItemIcon
                  ios={{
                    name: 'pencil',
                    pointSize: 18,
                  }}
                />
              </ContextMenu.Item>
              <ContextMenu.Item key={'delete'} onSelect={() => onDeleteChat(chat.id)} destructive>
                <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
                <ContextMenu.ItemIcon
                  ios={{
                    name: 'trash',
                    pointSize: 18,
                  }}
                />
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        ))}
      </DrawerContentScrollView>

      <View
        style={{
          padding: 16,
          paddingBottom: 10 + bottom,
          backgroundColor: Colors.light,
        }}>
        <Link href="/(auth)/(modal)/settings" asChild>
          <TouchableOpacity style={styles.footer}>
            <Image
              source={{ uri: 'https://galaxies.dev/img/meerkat_2.jpg' }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Mika Meerkat</Text>
            <Ionicons name="ellipsis-horizontal" size={24} color={Colors.greyLight} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const Layout = () => {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  const { user } = useRevenueCat();
  const router = useRouter();

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
            style={{ marginLeft: 16 }}>
            <FontAwesome6 name="grip-lines" size={20} color={Colors.grey} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: Colors.light,
        },
        headerShadowVisible: false,
        drawerActiveBackgroundColor: Colors.selected,
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        overlayColor: 'rgba(0, 0, 0, 0.2)',
        drawerItemStyle: { borderRadius: 12 },
        drawerLabelStyle: { marginLeft: -20 },
        drawerStyle: { width: dimensions.width * 0.86 },
      }}>
      <Drawer.Screen
        name="(chat)/new"
        getId={() => Math.random().toString()}
        options={{
          title: 'ChatGPT',
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: '#000' }]}>
              <Image source={require('@/assets/images/logo-white.png')} style={styles.btnImage} />
            </View>
          ),
          headerRight: () => (
            <Link href={'/(auth)/(drawer)/(chat)/new'} push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="(chat)/[id]"
        options={{
          drawerItemStyle: {
            display: 'none',
          },
          headerRight: () => (
            <Link href={'/(auth)/(drawer)/(chat)/new'} push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="dalle"
        options={{
          title: 'Dall·E',
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: '#000' }]}>
              <Image source={require('@/assets/images/dalle.png')} style={styles.dallEImage} />
            </View>
          ),
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            if (!user.dalle) {
              router.navigate('/(auth)/(modal)/purchase');
            } else {
              router.navigate('/(auth)/dalle');
            }
          },
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          title: 'Explore GPTs',
          drawerIcon: () => (
            <View
              style={[
                styles.item,
                {
                  backgroundColor: '#fff',
                  width: 28,
                  height: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Ionicons name="apps-outline" size={18} color="#000" />
            </View>
          ),
        }}
      />
    </Drawer>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    marginHorizontal: 16,
    borderRadius: 10,
    height: 34,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.input,
  },
  searchIcon: {
    padding: 6,
  },
  input: {
    flex: 1,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 0,
    alignItems: 'center',
    color: '#424242',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roundImage: {
    width: 30,
    height: 30,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  item: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  btnImage: {
    margin: 6,
    width: 16,
    height: 16,
  },
  dallEImage: {
    width: 28,
    height: 28,
    resizeMode: 'cover',
  },
});

export default Layout;
