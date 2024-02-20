import React, {useEffect} from 'react';
import styled from 'styled-components';
import {ConversationComponent} from '../components/conversation';
import {useSelector} from 'react-redux';
import {getMachineName} from '../features/user';
import {RootState, useAppDispatch} from '../store';

const Page = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto 1fr auto;
    height: 100%;
    .nav {
        grid-row: 1 / -1;
        padding: 20px;
        background-color: var(--background-color-0);
    }
    .main {
        background-color: var(--background-color-2);
        grid-column: 2;
        max-height: 100vh;
        display: flex;
        justify-content: center;
    }
`;

const MainContent = styled.div`
    display: flex;
    justify-content: center;
    width: 60vw;
    height: 100%;
`;

const NavPage = () => {
  const dispatch = useAppDispatch();
  const user = useSelector<RootState>((state) => state.user?.username ?? '') as string;
  useEffect(() => {
    dispatch(getMachineName());
  }, [dispatch]);
  return (
    <Page>
      <div className="nav">
        {user ? <div className="user">{user}</div> : null}
      </div>
      <div className="main">
        <MainContent>
          <ConversationComponent/>
        </MainContent>
      </div>
    </Page>
  );
}

export default NavPage;