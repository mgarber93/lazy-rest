import React, {MouseEvent, useCallback, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {ConversationComponent} from '../components/conversation';
import {getMachineName} from '../features/user';
import {RootState, useAppDispatch, useAppSelector} from '../features/store';
import {Conversation} from '../../models/conversation';
import {selectChat} from '../features/current-chat';
import {startNewChat} from '../features/chat';
import ContextMenu from '../components/context-menu';
import {updateContextMenu} from '../features/context-menu';
import {ChatRoutableButton} from '../components/ChatRoutableButton';

const Page = styled.div`
    display: grid;
    grid-template-columns: calc(var(--name-gutter) * 1.1) 1fr;
    grid-template-rows: auto 1fr auto;
    height: 100%;

    .nav {
        grid-row: 1 / -1;
        background-color: var(--background-color-0);
        display: flex;
        flex-direction: column;

        .userContainer {
            padding: 0.6rem 1.2rem;
            min-height: 5vh;
            border-bottom: 2px solid var(--background-color-1);
            font-size: larger;
        }

        .chatsContainer {
            padding: 5px;
            border-bottom: 2px solid var(--background-color-1);
            font-size: medium;
            text-align: center;
        }

        .active {
            color: var(--sage)
        }

        .footer {
            margin-top: auto;

            button {
                width: 100%;
                background-color: var(--background-color-0);
                border: none;
                border-top: 2px solid var(--background-color-1);
                text-align: start;
                padding: 0.6rem 1.2rem;
                font-size: medium;

                &:hover {
                    background-color: var(--sage-bg);
                }
            }
        }
    }

    .main {
        border-left: 1px solid var(--background-color-2);
        grid-column: 2;
        height: 100vh;
        display: flex;
        justify-content: center;
    }
`;

const MainContent = styled.div`
    display: flex;
    justify-content: center;
    padding: 0 calc(22vw - var(--name-gutter)) 0 calc(18vw - var(--name-gutter));
    height: 100%;
    background: var(--background-color-1);
    min-width: -webkit-fill-available;
`;


const NavPage = () => {
  const dispatch = useAppDispatch();
  const user = useSelector<RootState>((state) => state.user?.username ?? '') as string;
  const chats = useSelector<RootState>((state) => state.chats) as Conversation[];
  const currentChat = useAppSelector((state) => state.currentChat);
  
  useEffect(() => {
    if (chats.length > 0 && !currentChat)
      dispatch(selectChat(chats[0].id))
  }, [dispatch, currentChat]);
  useEffect(() => {
    dispatch(getMachineName());
  }, [dispatch]);
  
  const handleNewChatClick = useMemo(() => () => {
    dispatch(startNewChat());
  }, [dispatch]);
  const handleMouseUp = useCallback((e: MouseEvent) => {
    dispatch(updateContextMenu({visible: false, x: 0, y: 0, items: []}))
  }, [dispatch])
  
  return (
    <Page onMouseUpCapture={handleMouseUp}>
      <div className="nav">
        <div className="userContainer">
          {user ? <div className="user">{user}</div> : null}
        </div>
        <div>
          {chats.map(chat => <ChatRoutableButton key={chat.id} chat={chat}/>)}
        </div>
        <div className="footer">
          <button onClick={handleNewChatClick}> Start New Chat</button>
        </div>
      </div>
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