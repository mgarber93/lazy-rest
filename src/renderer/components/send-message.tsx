import React from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {User} from '../../models/user';
import {RootState, useAppDispatch} from '../store';
import {createContent} from '../../models/content';
import {generateResponse, respond} from '../features/chat';
import {useCurrentConversation} from '../hooks/current-conversation';

const TextArea = styled.textarea`
    resize: none;
    width: 100%;
    border: 1px solid var(--background-color-0);
    margin-top: auto;
    background-color: var(--background-color-0);
    color: var(--text-color);
    position: sticky;
    bottom: 1rem;
    border-radius: 0.5rem;
    padding: 0.3rem 0.5rem 0.3rem 0.5rem;
    font-size: larger;
`

export function SendMessage() {
  const [inputValue, setValue] = React.useState('');
  const dispatch = useAppDispatch();
  const user = useSelector<RootState>((state) => state.user) as User;
  const currentConversation = useCurrentConversation();
  
  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };
  
  const handleKeyPress: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue) {
      e.preventDefault();
      const prompt = createContent(inputValue, currentConversation.id, user.username);
      dispatch(respond(prompt))
      dispatch(generateResponse(prompt));
      setValue('');
    }
  };
  const rows = Math.max(inputValue.split('\n').length, 1);
  return (
    <TextArea
      rows={rows}
      placeholder="Message agent"
      onChange={handleChange}
      onKeyPressCapture={handleKeyPress}
      value={inputValue}/>
  );
}