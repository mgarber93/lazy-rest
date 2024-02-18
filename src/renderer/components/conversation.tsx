import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {RootState} from '../store';
import {Message, EditableMessage, NewMessage} from './message';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
`



export const ConversationComponent = () => {
  const messages = useSelector((state: RootState) => state.chats.content);
  return (
    <StyledDiv>
      {
        messages.map(message => <Message key={message.id} content={message}/>)
      }
      <NewMessage/>
    </StyledDiv>
  
  );
};