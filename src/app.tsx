import {createRoot} from 'react-dom/client';
import React, {FormEvent} from 'react';

const container = document.getElementById('root');
const root = createRoot(container);

const App = () => {
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

root.render(<App/>);