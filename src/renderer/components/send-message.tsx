import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
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
    border: 1px solid var(--background-color-0);
    border-left: none;
    width: calc(100% - var(--name-gutter));
    background-color: var(--background-color-2);
    color: var(--text-color);
    border-radius: var(--border-radius);
    padding: 0.3rem 0.5rem 0.3rem 0.5rem;
    font-size: larger;
    outline: none;
    height: 100%;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    box-shadow: 0.2rem 0.15rem var(--background-color-0);
`

const SendMessageContainer = styled.div`
    position: sticky;
    margin-top: auto;
    bottom: 0.5rem;
    display: flex;
    flex-direction: row;
`
const Selecter = styled.select`
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    width: var(--name-gutter);
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    color: var(--dark-grey);
    height: 100%;
    resize: none;
    border: none;
    margin-left: 1px;
    transition: 200ms box-shadow ease-in-out;
    font-size: var(--bs-body-font-size);
    margin-top: auto;
    background-color: var(--background-color-1);
    padding: 0.3rem 0.5rem 0.3rem 0.5rem;
    outline: none;

    &:hover {
        box-shadow: 0.2rem 0.15rem var(--background-color-0);
        margin-left: 0;
        margin-right: 1px;
        border: 1px solid var(--background-color-0);
        border-right: none;
    }
`

export function MessageRoleSelector() {
  const currentUser = useAppSelector(state => state.user.username)
  const [role, setRole] = useState(currentUser)
  const currentConversation = useCurrentConversation();
  const dispatch = useAppDispatch();
  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  }, [setRole, currentUser]);
  return (
    <Selecter defaultValue="user" onChange={handleChange}>
      <option value="system">system</option>
      <option value="user">{currentUser}</option>
      <option value="agent" disabled={true}>agent</option>
    </Selecter>
  );
}

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
      const prompt = createContent(inputValue, currentConversation.id, user.username, 'user');
      dispatch(respond(prompt))
      
      dispatch(generateResponse(currentConversation.id));
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
    <SendMessageContainer>
      <MessageRoleSelector/>
      <TextArea
        rows={rows}
        placeholder={!!currentConversation?.responder ? `Message ${currentConversation?.responder}` : 'Right click me'}
        onChange={handleChange}
        onKeyPressCapture={handleKeyPress}
        value={inputValue}
        onMouseUpCapture={handleMouseUp}
      />
    </SendMessageContainer>
  );
}