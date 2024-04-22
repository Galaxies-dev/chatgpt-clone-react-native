import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'gptversion',
});

export const keyStorage = new MMKV({
  id: 'openaikey',
});

export const chatStorage = new MMKV({
  id: 'chats',
});
