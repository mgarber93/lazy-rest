import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import {useAppSelector} from '../features/store';
import {useCurrentConversation} from '../hooks/current-conversation';
import {Conversation} from '../../models/conversation';
import {UserInputText} from './user-input-text';
import {MessageRoleSelector} from './send-role-selector';
import {respond, selectModelChat} from '../features/chat';
import {createContent} from '../../models/content';
import {apiPlanner} from '../../prompts/api-planner';

const SendMessageContainer = styled.div`
    position: sticky;
    margin-top: auto;
    bottom: 0.5rem;
    display: flex;
    flex-direction: row;
`

function shouldAllowSystem(conversation: Conversation) {

  const messages = conversation?.content ?? [];
  return messages.length === 0;
}

function mapModelsToSelectAction(models: string[], currentId: string) {
  return models.map(model => {
    return {
      display: model,
      action: selectModelChat({model, chat: currentId}),
    };
  });
}

/**
 * Sends a message based on the selected role.
 *
 * @function SendMessage
 *
 * @returns {JSX.Element} - The rendered message input component.
 */
export function SendMessage(): JSX.Element {
  const currentUser = useAppSelector(state => state.user.username);
  const models = useAppSelector(state => state.models.models);
  
  // Use current conversation to create actions to set each model as it's used model for responding
  const currentConversation = useCurrentConversation();
  const [roles, setRoles] = useState([{value: "user", display: currentUser}])
  
  // if we don't have any non system messages (ie we haven't started talking) add the option to set a system instruction
  
  const [role, setRole] = useState("user")
  useEffect(() => {
    const haveStartedTalking = !shouldAllowSystem(currentConversation);
    if (haveStartedTalking) {
      if (role === 'system') {
        setRole('user')
      }
    } else {
      setRoles([
        {value: "system", display: "instructions"},
        {value: "user", display: currentUser},
      ]);
    }
  }, [role, currentConversation]);
  
  useEffect(() => {
    const haveStartedTalking = shouldAllowSystem(currentConversation)
    
  }, [currentConversation]);

  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  }, [setRole, currentUser, currentConversation]);
  const items2 = useMemo(() => {
    switch (role) {
      case "system": {
        return [{
          display: 'spotify planner',
          action: respond(createContent(apiPlanner("spotify"), currentConversation?.id, 'api planner for spotify', 'system')),
        }]
      }
      case "user": {
        return mapModelsToSelectAction(models, currentConversation?.id);
      }
      default:
        return [];
    }
  }, [role, respond, createContent, apiPlanner, currentConversation, models])
  
  const responderPlaceholder = currentConversation?.responder
    ? `Message ${currentConversation?.responder}` : 'Right click to set model';
  const placeholder = `Right click to set preset or type here`;
  return (
    <SendMessageContainer>
      <MessageRoleSelector roles={roles} role={role} handleChange={handleChange} currentUser={currentUser}/>
      <UserInputText placeholder={role === 'system' ? placeholder : responderPlaceholder} items={items2}/>
    </SendMessageContainer>
  );
}