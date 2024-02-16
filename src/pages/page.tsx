import React from 'react';
import styled from 'styled-components';
import {PromptForm} from '../components/prompt-form';


const Page = styled.div`
    display: grid;
`;

const NavContainer = styled.nav`
    width: 20%;
    min-width: 200px;
    left: 0px;
`;

const MainContent = styled.div`
    width: 80%;
`;

function Nav() {
  return <nav>
  
  </nav>
}

const NavPage = () => {
  return (
    <Page>
      <NavContainer>
        <Nav/>
      </NavContainer>
      <MainContent>
        <PromptForm/>
      </MainContent>
    </Page>
  );
}




export default NavPage;
