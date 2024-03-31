import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import {useAppSelector} from '../features/store';
import {useCurrentConversation} from '../hooks/current-conversation';
import {Conversation} from '../../models/conversation';
import {UserInputText} from './user-input-text';
import {MessageRoleSelector} from './send-role-selector';
import {removeAutoPrompter, respond, selectAutoPrompter, selectModelChat} from '../features/chat';
import {createContent} from '../../models/content';
import {apiPlanner} from '../../prompts/api-planner';
import {markdownInstructions} from '../../prompts/enhanced-md';
import {Card} from '../wrapper/card';

const SendMessageContainer = styled.div`
  position: sticky;
  margin-top: auto;
  bottom: 0.5rem;
  flex-direction: row;
  display: grid;
  grid-template-columns: var(--name-gutter) 1fr;
  background-color: var(--background-color-1);
  border: 1px solid var(--background-color-2);
`;

function shouldAllowSystem(conversation: Conversation) {
  const messages = conversation?.content ?? [];
  return messages.length === 0;
}


export function SendMessage() {
  const currentUser = useAppSelector(state => state.user.username);
  const models = useAppSelector(state => state.models.models);

  // Use current conversation to create actions to set each model as it's used model for responding
  const currentConversation = useCurrentConversation();
  const [roles, setRoles] = useState([{value: "user", display: currentUser}])
  // if we don't have any non system messages (ie we haven't started talking) add the option to set a system instruction
  const [role, setRole] = useState("user")

  const responderPlaceholder = currentConversation?.responder
    ? `Message ${currentConversation?.responder}` : 'Right click to set model';
  const placeholder = `Right click to set preset or type here`;
  return (
    <SendMessageContainer>
      <p className={"author user"}>
        {currentUser}
      </p>
      <UserInputText placeholder={role === 'system' ? placeholder : responderPlaceholder}/>
    </SendMessageContainer>
  );
}