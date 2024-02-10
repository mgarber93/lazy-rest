import {createRoot} from 'react-dom/client';
import React from 'react';

export interface OpenAi {
  chat: (...args: string[]) => Promise<string>,
}

declare global {
  interface Window {
    openai: OpenAi
  }
}

const container = document.getElementById('root');
const root = createRoot(container);

const PromptForm = () => {
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
          User Prompt:
          <input type="text" value={inputValue} onChange={handleChange}/>
        </label>
        <input type="submit" value="Submit"/>
      </form>
    </>
  );
};

const App = () => (
  <div>
    <PromptForm/>
  </div>
);


root.render(<App/>);