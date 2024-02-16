import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;

    &:hover {
        background-color: #45a049;
    }
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
      <div>
        {response}
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          <StyledInput type="text" value={inputValue} onChange={handleChange}/>
        </label>
        <StyledInput type="submit" value="Submit"/>
      </form>
    </>
  );
};