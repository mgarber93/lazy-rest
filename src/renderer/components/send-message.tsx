import React, {ChangeEvent, ChangeEventHandler, useCallback, useEffect, useState} from 'react';
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
    box-shadow: 0.2rem 0.15rem var(--box-shadow-background);
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
    border: none;
    margin-left: 1px;
    margin-right: auto;
    transition: 200ms box-shadow ease-in-out;
    font-size: var(--bs-body-font-size);
    margin-top: auto;
    background-color: var(--background-color-1);
    padding: 0.3rem 0.5rem 0.3rem 0.5rem;
    outline: none;
    border-right: 1px solid var(--background-color-1);

    &:hover {
        box-shadow: 0.25rem 0.15rem var(--box-shadow-background);
        margin-left: 0;
        margin-right: 1px;
        border: 1px solid var(--box-shadow-background);
        border-right: 1px solid var(--background-color-1);
    }
`

export function MessageRoleSelector(props: { handleChange: ChangeEventHandler, role: string, currentUser: string }) {
  const {role, handleChange, currentUser} = props;
  return (
    <Selecter value={role} onChange={handleChange}>
      <option value="system">system</option>
      <option value="user">{currentUser}</option>
      <option value="agent" disabled={true}>agent</option>
    </Selecter>
  );
}

export function UserInputText() {
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
  return <TextArea
    rows={rows}
    placeholder={currentConversation?.responder ? `Message ${currentConversation?.responder}` : 'Right click me'}
    onChange={handleChange}
    onKeyPressCapture={handleKeyPress}
    value={inputValue}
    onMouseUpCapture={handleMouseUp}
  />
}

export function SendMessage() {
  const currentUser = useAppSelector(state => state.user.username)
  const [role, setRole] = useState(currentUser)
  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  }, [setRole, currentUser]);
  
  return (
    <SendMessageContainer>
      <MessageRoleSelector role={role} handleChange={handleChange} currentUser={currentUser}/>
      <UserInputText/>
    </SendMessageContainer>
  );
}