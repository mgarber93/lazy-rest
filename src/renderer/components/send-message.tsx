import React, {useState} from 'react';
import styled from 'styled-components';
import {useAppSelector} from '../features/store';
import {useCurrentConversation} from '../hooks/current-conversation';
import {UserInputText} from './user-input-text';
import {Model, Responder} from '../../models/responder';

const SendMessageContainer = styled.div`
  position: sticky;
  margin-top: auto;
  bottom: 2.5rem;
  flex-direction: row;
  background-color: var(--background-color-1);
  width: 871px;
  height: fit-content;
  display: flex;
`;

function mapResponderToPlaceholder(responder: Responder) {
  switch (responder?.type ?? '') {
    case "chat": {
      return `Message ${(responder as Model)?.model}`
    }
    default:
      return `Select a model`;
  }
}

export function SendMessage() {
  const currentUser = useAppSelector(state => state.user.username);
  const models = useAppSelector(state => state.models.models);

  // Use current conversation to create actions to set each model as it's used model for responding
  const currentConversation = useCurrentConversation();
  const [roles, setRoles] = useState([{value: "user", display: currentUser}])
  // if we don't have any non system messages (ie we haven't started talking) add the option to set a system instruction
  const [role, setRole] = useState("user")

  const placeholder = mapResponderToPlaceholder(currentConversation?.responder);
  return (
    <SendMessageContainer>
      <UserInputText placeholder={placeholder}/>
    </SendMessageContainer>
  );
}