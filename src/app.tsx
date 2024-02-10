import {createRoot} from 'react-dom/client';
import React from 'react';

const container = document.getElementById('root');
const root = createRoot(container);

const PromptForm = () => {
  const [inputValue, setValue] = React.useState('');

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    alert(`User input: ${inputValue}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        User Prompt:
        <input type="text" value={inputValue} onChange={handleChange}/>
      </label>
      <input type="submit" value="Submit"/>
    </form>
  );
};

const App = () => (
  <div>
    <PromptForm/>
  </div>
);


root.render(<App/>);