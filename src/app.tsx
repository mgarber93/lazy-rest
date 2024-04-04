import {createRoot} from 'react-dom/client';
import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {Provider} from 'react-redux';
import ConversationPage from './renderer/pages/page';
import {store} from './renderer/features/store'
import styled from 'styled-components';
import {Breadcrumb} from 'react-bootstrap';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const container = document.getElementById('root');
const root = createRoot(container);

const Div = styled.div`
  position: sticky;
  top: 0px;
  -webkit-app-region: drag;
  padding: 0.4rem 1rem 0rem 5rem;
  font-size: smaller;
  width: 100%;

  .breadcrumb {
    margin-bottom: 0.5rem;
  }

  min-height: 2rem;
  background-color: var(--background-color-2);
  z-index: 3;
  border-bottom: 1px solid var(--border-color);
`

export function Header() {
  return <Div>
    <Breadcrumb>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Item active>Conversations</Breadcrumb.Item>
    </Breadcrumb>
  </Div>
}


const router = createBrowserRouter([
  {
    path: "*",
    element: <ConversationPage/>,
  },
]);

const App = () => (
  <Provider store={store}>
    <Container>
      <Header/>
      <RouterProvider router={router}/>
    </Container>
  </Provider>
)


root.render(<React.StrictMode><App/></React.StrictMode>);