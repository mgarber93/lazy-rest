import React, {MouseEvent, useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {ConversationComponent} from '../components/conversation';
import {getMachineName} from '../features/user';
import {RootState, useAppDispatch, useAppSelector} from '../features/store';
import {Conversation} from '../../models/conversation';
import {selectChat} from '../features/current-chat';
import ContextMenu from '../components/context-menu';
import {updateContextMenu} from '../features/context-menu';
import Aside from '../wrapper/aside';
import {Tabs} from '../wrapper/tabs';
import {PageContainer} from '../wrapper/responder-type/page-container';

const Conversations = styled.div`
  &.aside {
    display: grid;
    grid-template-columns: calc(var(--aside-nav) * 1.1) 1fr;
  }
  height: 100%;
  .main {
    grid-column: 2;
    display: flex;
    justify-content: center;
    overflow-x: hidden;
    max-width: 100vw;
  }
`;

const MainContent = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  padding: 0rem 1rem 0 0.3rem;
  overflow-y: auto;
`;

const ConversationPage = () => {
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

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navOnTop = (windowSize.width / windowSize.height) < 1.2

  return (
    <PageContainer>
      <Conversations onMouseUpCapture={handleMouseUp} className={navOnTop ? "tabs" : "aside"}>
        {navOnTop ? <Tabs/> : <Aside/>}
        <MainContent>
          <ConversationComponent/>
        </MainContent>
        <ContextMenu/>
      </Conversations>
    </PageContainer>
  );
}

export default ConversationPage;