import {useAppDispatch} from '../store';
import {createContent} from '../../models/content';
import {generateResponse, respond} from '../features/chat';
import React from 'react';
import {Container} from 'react-bootstrap';
import styled from 'styled-components';

const TextArea = styled.textarea`
    resize: none;
    width: 100%;
`

function FileUpload() {
  return <div>
    <input type="file" id="file-upload"/>
    <label htmlFor="file-upload">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" className="attachFile"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
      </svg>
    </label>
  </div>;
}

export function SendMessage() {
  const [inputValue, setValue] = React.useState('');
  const dispatch = useAppDispatch();
  
  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };
  
  const handleKeyPress: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue) {
      const prompt = createContent(inputValue, 'this', false);
      dispatch(respond(prompt))
      dispatch(generateResponse(prompt));
      setValue('');
    }
  };
  
  return (
    <TextArea
      rows={1}
      placeholder="Message agent"
      className="autoExpand"
      onChange={handleChange}
      onKeyPressCapture={handleKeyPress}
      value={inputValue}/>
  );
}