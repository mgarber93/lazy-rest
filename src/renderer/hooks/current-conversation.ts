import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {Conversation} from '../../models/conversation';

export const useCurrentConversation = () => {
  const currentChat = useSelector<RootState>((state) => state.currentChat) as string;
  const chats = useSelector<RootState>(state => state.chats) as Conversation[];
  return chats.find(chat => chat.id === currentChat);
};