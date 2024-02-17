import React from 'react';
import styled from 'styled-components';

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


export const PromptForm = () => {
  const [inputValue, setValue] = React.useState('');
  const [response, setResponseValue] = React.useState('');
  
  
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };
  
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const response = await window.openai.chat(inputValue)
    setValue('')
    setResponseValue(response)
  };
  
  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <StyledInput className="respond" type="text" value={inputValue} onChange={handleChange}></StyledInput>
        <StyledInput type="submit" value="Respond"/>
      </StyledForm>
    </>
  );
};