import {createRoot} from 'react-dom/client';
import React from 'react';

import {PromptForm} from './components/prompt-form';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import NavPage from './pages/page';


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


const router = createBrowserRouter([
  {
    path: "*",
    element: <NavPage/>,
  },
]);

const App = () => (
  <RouterProvider router={router}/>
);


root.render(<App/>);