import React from 'react';
import styled from 'styled-components';
import {ConversationComponent} from '../components/conversation';

const Page = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100vw;
`;

const MainContent = styled.div`
    display: flex;
    justify-content: center;
    width: 60vw;
    height: 100%;
`;

const NavPage = () => {
  return (
    <Page>
      <MainContent>
        <ConversationComponent/>
      </MainContent>
    </Page>
  );
}

export default NavPage;