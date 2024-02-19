import {createRoot} from 'react-dom/client';
import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {Provider} from 'react-redux';
import NavPage from './renderer/pages/page';
import {store} from './renderer/store'

const container = document.getElementById('root');
const root = createRoot(container);


const router = createBrowserRouter([
  {
    path: "*",
    element: <NavPage/>,
  },
]);

const App = () => (
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
);


root.render(<React.StrictMode><App/></React.StrictMode>);