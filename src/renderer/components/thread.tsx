import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {RootState} from '../store';
import {Message, EditableMessage} from './message';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
`

export const Thread = () => {
  const messages = useSelector((state: RootState) => state.chats.messages);
  return (
    <StyledDiv>
      {
        messages.map(message => message.editable ? <EditableMessage key={message.id} content={message}/> :
          <Message key={message.id} content={message}/>)
      }
    </StyledDiv>
  );
};