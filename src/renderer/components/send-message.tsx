import React, {useCallback, useEffect} from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {User} from '../../models/user';
import {RootState, useAppDispatch, useAppSelector} from '../features/store';
import {createContent} from '../../models/content';
import {generateResponse, respond} from '../features/chat';
import {useCurrentConversation} from '../hooks/current-conversation';
import {updateContextMenu} from '../features/context-menu';
import {listModels} from '../features/models';

const TextArea = styled.textarea`
    resize: none;
    width: 100%;
    border: 1px solid var(--background-color-0);
    margin-top: auto;
    background-color: var(--background-color-2);
    color: var(--text-color);
    position: sticky;
    bottom: 1rem;
    border-radius: var(--border-radius);
    padding: 0.3rem 0.5rem 0.3rem 0.5rem;
    font-size: larger;
    box-shadow: 0.1rem 0.1rem 0.3rem var(--background-color-0);
`;

export function SendMessage() {
  const [inputValue, setValue] = React.useState('');
  const dispatch = useAppDispatch();
  const currentConversation = useCurrentConversation();
  const contextMenuItems = useAppSelector((state) => state.contextMenu.items);
  const user = useAppSelector((state) => state.user) as User;
  const models = useAppSelector(state => state.models.models);
  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };
  useEffect(() => {
    dispatch(listModels())
  }, [dispatch]);
  
  const handleKeyPress: React.KeyboardEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue) {
      e.preventDefault();
      const prompt = createContent(inputValue, currentConversation.id, user.username);
      dispatch(respond(prompt))
      dispatch(generateResponse(prompt));
      setValue('');
    }
  }, [currentConversation, inputValue])

  const handleMouseUp: React.MouseEventHandler = useCallback((e) => {
    const isRightClick = e.button === 2;
    dispatch(updateContextMenu({
      visible: isRightClick || e.ctrlKey,
      x: e.clientX,
      y: e.clientY - 25 * models.length,
      items: models
    }))
    e.preventDefault();
  }, [dispatch, models]);
  const rows = Math.max(inputValue.split('\n').length, 1);
  return (
    <TextArea
      rows={rows}
      placeholder={`Message ${models?.[0] ?? ''}`}
      onChange={handleChange}
      onKeyPressCapture={handleKeyPress}
      value={inputValue}
      onMouseUpCapture={handleMouseUp}
    />

  );
}