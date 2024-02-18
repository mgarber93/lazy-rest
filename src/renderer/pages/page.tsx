import React from 'react';
import styled from 'styled-components';
import {ConversationComponent} from '../components/conversation';


const Page = styled.div`
    display: flex;
    flex-direction: row;
`;


const MainContent = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
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
