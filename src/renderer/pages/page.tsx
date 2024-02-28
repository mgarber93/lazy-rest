import React, {useEffect} from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {ConversationComponent} from '../components/conversation';
import {getMachineName} from '../features/user';
import {RootState, useAppDispatch, useAppSelector} from '../store';
import {Conversation} from '../../models/conversation';
import {selectChat} from '../features/current-chat';
import {startNewChat} from '../features/chat';
import {chat} from '../../main/apis/openai';

const Page = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto 1fr auto;
    height: 100%;

    .nav {
        grid-row: 1 / -1;
        background-color: var(--background-color-0);
        display: flex;
        flex-direction: column;

        .userContainer {
            padding: 20px;
            min-height: 5vh;
            border-bottom: 2px solid var(--background-color-1);
            font-size: larger;
        }

        .chatsContainer {
            padding: 20px;
            overflow-y: scroll;
            border-bottom: 2px solid var(--background-color-1);
            font-size: medium;
        }

        .active {
            color: var(--sage)
        }

        .footer {
            margin-top: auto;

            button {
                width: 100%;
                height: 66px;
                background-color: var(--background-color-0);
                border: none;
                border-top: 2px solid var(--background-color-1);
                text-align: start;
                padding: 20px;
                font-size: medium;

                &:hover {
                    background-color: var(--sage-bg);
                }
            }
        }
    }

    .main {
        background-color: var(--background-color-2);
        grid-column: 2;
        height: 100vh;
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
  const chats = useSelector<RootState>((state) => state.chats) as Conversation[];
  const currentChat = useAppSelector((state) => state.currentChat);
  
  useEffect(() => {
    if (chats.length > 0 && !currentChat)
      dispatch(selectChat(chats[0].id))
    dispatch(getMachineName());
  }, [dispatch, currentChat]);
  
  function handleNewChatClick() {
    dispatch(startNewChat())
  }
  
  function handleClip(id: string) {
    dispatch(selectChat(id))
  }
  
  return (
    <Page>
      <div className="nav">
        <div className="userContainer">
          {user ? <div className="user">{user}</div> : null}
        </div>
        <div>
          {chats.map(chat => <div key={chat.id}
                                  className={"chatsContainer" + (chat.id === currentChat ? " active" : '')}
                                  onClick={handleClip.bind(null, chat.id)}>{chat.title}</div>)}
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
    </Page>
  );
}

export default NavPage;