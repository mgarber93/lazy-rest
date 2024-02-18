import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {generateResponse} from '../state/chat';
import {RootState} from '../store';
import {createMessage, Message} from '../models/message'
import {EditableMessage} from './editable-message';

const StyledInput = styled.input`
    border: var(--border-0);
    border-radius: var(--border-radius);
    width: 100%;
`;

const StyledForm = styled.form`
    width: 30rem;
    display: flex;
    flex-direction: row;

    input[type="submit"] {
        width: 20%;
    }

    height: 2rem;
    gap: 0.2rem;
`;





function Message(props: { message: Message }) {
  return (
    <StyledForm>
      <StyledInput className="respond" type="text" value={props.message.message} disabled={true}></StyledInput>
    </StyledForm>
  );
}

export const MessageThread = () => {
  const messages = useSelector((state: RootState) => state.chats.messages);
  return (
    <>
      {
        messages.map(message => message.editable ? <EditableMessage key={message.message} message={message} /> : <Message key={message.message} message={message}/>)
      }
    </>
  );
};