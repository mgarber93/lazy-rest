import {useAppDispatch, useAppSelector} from '../features/store';
import {useCurrentConversation} from '../hooks/current-conversation';
import {User} from '../../models/user';
import {listModels} from '../features/models';
import {createContent} from '../../models/content';
import {respond, streamResponse} from '../features/chat';
import {ContextItem, updateContextMenu} from '../features/context-menu';
import styled from 'styled-components';
import {ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useCallback, useEffect, useState} from 'react';

const TextArea = styled.textarea`
  resize: none;
  background-color: var(--background-color-2);
  color: var(--text-color);
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  font-size: larger;
  outline: none;
  height: 100%;
  border-left: none;
  border-radius: var(--border-radius);
  border: 1px solid var(--background-color-1);
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  margin-left: -1px;
`

export function UserInputText({placeholder}: { placeholder: string }) {
  const [inputValue, setValue] = useState('');
  const dispatch = useAppDispatch();
  const currentConversation = useCurrentConversation();
  const user = useAppSelector((state) => state.user) as User;
  const models = useAppSelector(state => state.models.models);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };
  useEffect(() => {
    dispatch(listModels());
  }, [dispatch]);

  const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue && currentConversation.responder) {
      e.preventDefault();
      const prompt = createContent(inputValue, currentConversation.id, user.username, 'user');
      dispatch(respond(prompt))
      const placeHolder = createContent('', currentConversation.id, currentConversation.responder.name, 'assistant')
      dispatch(respond(placeHolder));
      dispatch(streamResponse({conversationId: currentConversation.id, contentId: placeHolder.id}));
      setValue('');
    }
  }, [currentConversation, inputValue])

  // @todo refactor this magic number
  const rows = Math.max(inputValue.split('\n').length, (inputValue.length / 50) + 1);
  return <TextArea
    rows={rows}
    placeholder={placeholder}
    onChange={handleChange}
    onKeyPressCapture={handleKeyPress}
    value={inputValue}
  />
}
