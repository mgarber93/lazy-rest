import {useAppDispatch, useAppSelector} from '../features/store';
import {useCurrentConversation} from '../hooks/current-conversation';
import {User} from '../../models/user';
import {listModels} from '../features/models';
import {createContent} from '../../models/content';
import {generateResponse, respond} from '../features/chat';
import {ContextItem, updateContextMenu} from '../features/context-menu';
import styled from 'styled-components';
import {ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useCallback, useEffect, useState} from 'react';

const TextArea = styled.textarea`
    resize: none;
    width: calc(100% - var(--name-gutter));
    background-color: var(--background-color-2);
    color: var(--text-color);
    padding: 0.3rem 0.5rem 0.3rem 0.5rem;
    font-size: larger;
    outline: none;
    height: 100%;
    border: 1px solid var(--box-shadow-background);
    border-left: none;
    border-radius: var(--border-radius);
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    margin-left: -1px;
`

export function UserInputText({placeholder, items}: { placeholder: string, items: ContextItem[] }) {
  const [inputValue, setValue] = useState('');
  const dispatch = useAppDispatch();
  const currentConversation = useCurrentConversation();
  const user = useAppSelector((state) => state.user) as User;
  const models = useAppSelector(state => state.models.models);
  
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };
  useEffect(() => {
    dispatch(listModels())
  }, [dispatch]);
  
  const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue) {
      e.preventDefault();
      const prompt = createContent(inputValue, currentConversation.id, user.username, 'user');
      dispatch(respond(prompt))
      if (!currentConversation.autoPrompter) {
        dispatch(generateResponse(currentConversation.id));
      }
      setValue('');
    }
  }, [currentConversation, inputValue])
  
  const handleMouseUp: MouseEventHandler = useCallback((e) => {
    const isRightClick = e.button === 2;

    dispatch(updateContextMenu({
      visible: isRightClick || e.ctrlKey,
      x: e.clientX,
      y: e.clientY - 25 * models.length,
      items,
    }))
    e.preventDefault();
  }, [dispatch, models, currentConversation, items]);
  const rows = Math.max(inputValue.split('\n').length, (inputValue.length / 50) + 1);
  return <TextArea
    rows={rows}
    placeholder={placeholder}
    onChange={handleChange}
    onKeyPressCapture={handleKeyPress}
    value={inputValue}
    onMouseUpCapture={handleMouseUp}
  />
}
