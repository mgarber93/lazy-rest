import {createRoot} from 'react-dom/client';
import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import NavPage from './pages/page';


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