import React from 'react';
import styled from 'styled-components';
import {MessageThread} from '../components/message-thread';


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
        <MessageThread/>
      </MainContent>
    </Page>
  );
}




export default NavPage;
