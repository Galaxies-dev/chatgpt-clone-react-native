import HeaderDropDown from '@/components/HeaderDropDown';
import MessageInput from '@/components/MessageInput';
import { defaultStyles } from '@/constants/Styles';
import { storage } from '@/utils/Storage';
import { Stack } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import OpenAI from 'react-native-openai';
import { FlashList } from '@shopify/flash-list';
import ChatMessage from '@/components/ChatMessage';
import { Message, Role } from '@/utils/Interfaces';
import MessageIdeas from '@/components/MessageIdeas';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Page = () => {
  const [gptVersion, setGptVersion] = useMMKVString('gptVersion', storage);
  const [height, setHeight] = useState(0);
  const { bottom } = useSafeAreaInsets();

  const openAI = useMemo(() => new OpenAI({}), []);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    openAI.chat.addListener('onChatMessageReceived', (payload) => {
      setMessages((messages) => {
        const newMessage = payload.choices[0]?.delta.content;
        if (newMessage) {
          messages[messages.length - 1].content += newMessage;
          return [...messages];
        }
        return messages;
      });
    });

    return () => {
      openAI.chat.removeListener('onChatMessageReceived');
    };
  }, [openAI]);

  const onGptVersionChange = (version: string) => {
    setGptVersion(version);
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  };

  const getCompletion = async (text: string) => {
    messages.push({ role: Role.User, content: text });
    messages.push({ role: Role.Bot, content: '' });
    openAI.chat.stream({
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
      model: gptVersion == '4' ? 'gpt-4' : 'gpt-3.5-turbo',
    });
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="ChatGPT"
              items={[
                { key: '3.5', title: 'GPT-3.5', icon: 'bolt' },
                { key: '4', title: 'GPT-4', icon: 'sparkles' },
              ]}
              onSelect={onGptVersionChange}
              selected={gptVersion}
            />
          ),
        }}
      />
      <View style={styles.page} onLayout={onLayout}>
        {messages.length == 0 && (
          <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
            <Image source={require('@/assets/images/logo-white.png')} style={styles.image} />
          </View>
        )}
        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessage content={item.content} role={item.role} />}
          estimatedItemSize={400}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 150 }}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={70}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
        }}>
        {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
        <MessageInput onShouldSend={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#000',
    borderRadius: 50,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
  page: {
    flex: 1,
  },
});
export default Page;
