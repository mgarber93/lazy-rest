import {ChangeEvent, ChangeEventHandler, MouseEvent, useMemo} from 'react';
import {Conversation} from '../../models/conversation';
import {useAppDispatch, useAppSelector} from '../features/store';
import {selectChat} from '../features/current-chat';
import styled from 'styled-components';
import {updateTitle} from '../features/chat';

const Input = styled.input`
    background-color: var(--background-color-0);
    width: 100%;
    border: none;
`;

export const ChatRoutableButton = ({chat}: { chat: Conversation }) => {
  const dispatch = useAppDispatch();
  const currentChat = useAppSelector((state) => state.currentChat);
  const handleClip = useMemo(() =>
    (event: MouseEvent) => {
      
      if (event.button === 2) {
        dispatch(selectChat(chat.id))
      } else {
      }
    }, [dispatch, chat],
  );
  const handleChange = useMemo(() => (event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    dispatch(updateTitle({id: chat.id, title: newTitle}));
  }, [dispatch, chat]) as ChangeEventHandler<HTMLInputElement>;
  return <div onMouseUpCapture={handleClip}>
    <Input
      className={"chatsContainer" + (chat.id === currentChat ? " active" : '')}
      value={chat.title}
      onChange={handleChange}
    />
  </div>
  
}