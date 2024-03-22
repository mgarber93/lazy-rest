import React, {MouseEvent, useCallback, useEffect, useMemo, useState} from 'react';
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
import {ChatRoutableButton} from '../components/chat-routable-button';

const Page = styled.div`
    @media (min-width: 960px) {
      display: grid;
      grid-template-columns: calc(var(--name-gutter) * 1.1) 1fr;
      grid-template-rows: auto 1fr auto;
    }
    height: 100%;

    .user {
        user-select: none;
    }
    .nav {
        background-color: var(--background-color-0);
        display: flex;
        flex-direction: column;
        .userContainer {
            padding: 0.6rem 1.2rem;
            min-height: 5vh;
            border-bottom: 2px solid var(--background-color-1);
            font-size: larger;
        }
        .footer {
            button {
                background-color: unset;
                width: 100%;
                border: none;
                text-align: center;
                padding: 0.6rem 1.2rem;
                font-size: smaller;

                &:hover {
                    background-color: var(--sage-bg);
                }
            }
        }
        .bottom {
            margin-top: auto;
            bottom: 0;
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
    min-width: -webkit-fill-available;
`;

const NavPage = () => {
  const [shown, setShown] = useState(false);
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

  let nav;
  if (shown) {
    nav = <div className="nav">
      <div className="userContainer">
        {user ? <div className="user">{user}</div> : null}
      </div>
      <div>
        {chats.map(chat => <ChatRoutableButton key={chat.id} chat={chat}/>)}
      </div>
      <div className="footer">
        <button onClick={handleNewChatClick}>+</button>
      </div>
      <div className="bottom">
      </div>
    </div>
  } else {
    nav = <div className="nav">
      <div className="userContainer">
        {user ? <div className="user">{user}</div> : null}
      </div>
    </div>
  }

  return (
    <Page onMouseUpCapture={handleMouseUp}>
      {nav}
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