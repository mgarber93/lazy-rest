import React, {MouseEvent, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {ConversationComponent} from '../components/conversation';
import {getMachineName} from '../features/user';
import {RootState, useAppDispatch, useAppSelector} from '../features/store';
import {Conversation} from '../../models/conversation';
import {selectChat} from '../features/current-chat';
import ContextMenu from '../components/context-menu';
import {updateContextMenu} from '../features/context-menu';
import Aside from '../components/aside';

const Page = styled.div`
  @media (min-width: 61rem) {
    display: grid;
    grid-template-columns: calc(var(--aside-nav) * 1.1) 1fr;
    grid-template-rows: auto 1fr auto;
  }
  height: 100%;
  .main {
    grid-column: 2;
    height: 100vh;
    display: flex;
    justify-content: center;
    overflow-x: hidden;
    max-width: 100vw;
  }
`;

const MainContent = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 calc(22vw - var(--name-gutter)) 0 calc(18vw - var(--name-gutter));
  height: 100%;
  min-width: -webkit-fill-available;
`;

const NavPage = () => {
  const dispatch = useAppDispatch();
  const chats = useSelector<RootState>((state) => state.chats) as Conversation[];
  const currentChat = useAppSelector((state) => state.currentChat);
  
  useEffect(() => {
    if (chats.length > 0 && !currentChat)
      dispatch(selectChat(chats[0].id))
  }, [dispatch, currentChat]);
  useEffect(() => {
    dispatch(getMachineName());
  }, [dispatch]);
  
  const handleMouseUp = useCallback((e: MouseEvent) => {
    dispatch(updateContextMenu({visible: false, x: 0, y: 0, items: []}))
  }, [dispatch])
  
  return (
    <Page onMouseUpCapture={handleMouseUp}>
      <Aside/>
      <div className="main">
        <MainContent>
          <ConversationComponent/>
        </MainContent>
      </div>
      <ContextMenu/>
    </Page>
  );
}

export default NavPage;