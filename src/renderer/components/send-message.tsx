import React, {useCallback, useEffect} from 'react';
import styled from 'styled-components';
import {User} from '../../models/user';
import {useAppDispatch, useAppSelector} from '../features/store';
import {createContent} from '../../models/content';
import {generateResponse, respond, selectModelChat} from '../features/chat';
import {useCurrentConversation} from '../hooks/current-conversation';
import {updateContextMenu} from '../features/context-menu';
import {listModels} from '../features/models';

const TextArea = styled.textarea`
    resize: none;
    margin-left: var(--name-gutter);
    border: 1px solid var(--background-color-0);
    margin-top: auto;
    background-color: var(--background-color-2);
    color: var(--text-color);
    position: sticky;
    bottom: 0.5rem;
    border-radius: var(--border-radius);
    padding: 0.3rem 0.5rem 0.3rem 0.5rem;
    font-size: larger;
    box-shadow: 0.2rem 0.15rem var(--background-color-0);
    outline: none;
`

export function SendMessage() {
  const [inputValue, setValue] = React.useState('');
  const dispatch = useAppDispatch();
  const currentConversation = useCurrentConversation();
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
    const items = models.map(model => {
      return {
        display: model,
        action: selectModelChat({model, chat: currentConversation.id}),
      };
    });
    dispatch(updateContextMenu({
      visible: isRightClick || e.ctrlKey,
      x: e.clientX,
      y: e.clientY - 25 * models.length,
      items,
    }))
    e.preventDefault();
  }, [dispatch, models, currentConversation]);
  const rows = Math.max(inputValue.split('\n').length, (inputValue.length / 50) + 1);
  return (
    <TextArea
      rows={rows}
      placeholder={!!currentConversation?.responder ? `Message ${currentConversation?.responder}` : 'Right click me'}
      onChange={handleChange}
      onKeyPressCapture={handleKeyPress}
      value={inputValue}
      onMouseUpCapture={handleMouseUp}
    />
  
  );
}