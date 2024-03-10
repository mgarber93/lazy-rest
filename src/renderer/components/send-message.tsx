import React, {ChangeEvent, useCallback, useState} from 'react';
import styled from 'styled-components';
import {useAppSelector} from '../features/store';
import {useCurrentConversation} from '../hooks/current-conversation';
import {Conversation} from '../../models/conversation';
import {UserInputText} from './user-input-text';
import {MessageRoleSelector} from './send-role-selector';
import {selectModelChat} from '../features/chat';

const SendMessageContainer = styled.div`
    position: sticky;
    margin-top: auto;
    bottom: 0.5rem;
    display: flex;
    flex-direction: row;
`

function hasAnyNonSystemMessages(conversation: Conversation) {
  const messages = conversation?.content ?? [];
  return messages.some(message => message.role !== 'system');
}

function mapModelsToSelectAction(models: string[], currentId: string) {
  return models.map(model => {
    return {
      display: model,
      action: selectModelChat({model, chat: currentId}),
    };
  });
}

export function SendMessage() {
  const currentUser = useAppSelector(state => state.user.username);
  const models = useAppSelector(state => state.models.models);
  
  // Use current conversation to create actions to set each model as it's used model for responding
  const currentConversation = useCurrentConversation();
  const convo = mapModelsToSelectAction(models, currentConversation?.id);
  
  const roles = [{value: "user", display: currentUser}]
  // if we don't have any non system messages (ie we haven't started talking) add the option to set a system instruction
  const haveStartedTalking = hasAnyNonSystemMessages(currentConversation)
  if (!haveStartedTalking) {
    roles.unshift({value: "system", display: "instructions"})
  }
  
  // User Input controller
  const [role, setRole] = useState(haveStartedTalking ? "user" : "system")
  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  }, [setRole, currentUser, currentConversation]);
  
  const responderPlaceholder = currentConversation?.responder
    ? `Message ${currentConversation?.responder}` : 'Right click to set model';
  const placeholder = `Right click to set preset or type here`;
  return (
    <SendMessageContainer>
      <MessageRoleSelector roles={roles} role={role} handleChange={handleChange} currentUser={currentUser}/>
      <UserInputText placeholder={role === 'system' ? placeholder : responderPlaceholder}/>
    </SendMessageContainer>
  );
}