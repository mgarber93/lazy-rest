import React, {useCallback} from 'react';
import {Button} from '../../styled/button';
import styled from 'styled-components';
import {useAppDispatch} from '../../features/store';
import {setResponder} from '../../features/chat';
import {Organization, TResponder} from '../../../models/responder';
import {useCurrentConversation} from '../../hooks/current-conversation';

const FormButton = styled(Button)`
  height: 1.6rem;
  font-size: smaller;
  padding: 0.2rem 0.4rem;
  margin-top: 1rem;
  background: var(--background-color-9);
`;

export function OrganizationSelector() {
  const dispatch = useAppDispatch();
  const conversation = useCurrentConversation();
  const chatId = conversation?.id;
  const organizations = ['Swagger GPT'];

  const handleClick = useCallback(() => {
    dispatch(setResponder({
      responder: {type: 'organization' as TResponder, orgId: "SwaggerGpt"} as Organization,
      chatId,
    }));
  }, [dispatch, chatId]);

  return <FormButton onClick={handleClick}>{organizations[0]}</FormButton>;
}