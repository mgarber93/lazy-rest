import {AuthoredContent, createContent} from '../../models/content';
import {generateResponse, respond} from '../features/chat';
import React from 'react';
import styled from 'styled-components';
import {useAppDispatch} from '../store';
import {useSelector} from 'react-redux';


const StyledInput = styled.input`
    border: var(--border-0);
    border-radius: var(--border-radius);
    height: 2.5rem;
`;


const StyledForm = styled.form`
    width: 30rem;
    display: flex;
    flex-direction: column;

    input[type="submit"] {
        width: 20%;
    }

    height: 2rem;
    gap: 0.2rem;
`;

export function Message(props: { content: AuthoredContent }) {
  return (
    <StyledInput className="respond" type="text" value={props.content.message} disabled={true}></StyledInput>
  );
}

export function EditableMessage(props: { content: AuthoredContent }) {
  const [inputValue, setValue] = React.useState(props.content.message);
  const dispatch = useAppDispatch();
  
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };
  
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const prompt = createContent(inputValue, 'this', false, props.content.id);
    dispatch(respond(prompt))
    dispatch(generateResponse(prompt));
  };
  
  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledInput className="respond" type="text" value={inputValue} onChange={handleChange}></StyledInput>
      <StyledInput type="submit" value="Respond"/>
    </StyledForm>
  )
}