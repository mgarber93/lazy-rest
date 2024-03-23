import React, {useCallback, useEffect, useState} from 'react';
import {ChatRoutableButton} from './chat-routable-button';
import {startNewChat} from '../features/chat';
import {RootState, useAppDispatch} from '../features/store';
import {useSelector} from 'react-redux';
import {Conversation} from '../../models/conversation';
import styled from 'styled-components';

const AsideContainer = styled.div`
  @media (min-width: 61rem) {
    .nav {
      border-right: 1px solid var(--background-color-0);
      flex-direction: column;
      justify-content: flex-start;
      align-content: flex-start;
    }
  }

  .user {
    user-select: none;
  }

  .nav {
    display: flex;
    flex-direction: row;

    .userContainer {
      padding: 0.6rem 1.2rem;
      min-height: 5vh;
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

`;

function Aside() {
  const dispatch = useAppDispatch();
  const user = useSelector<RootState>((state) => state.user?.username ?? '') as string;
  
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const chats = useSelector<RootState>((state) => state.chats) as Conversation[];
  
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
  
  const handleNewChatClick = useCallback(() => {
    dispatch(startNewChat());
  }, [dispatch]);
  
  const nav = <div className="nav">
    <div className="userContainer">
      {user ? <div className="user">{user}</div> : null}
    </div>
    {chats.map(chat => <ChatRoutableButton key={chat.id} chat={chat}/>)}
    
    <div className="footer">
      <button onClick={handleNewChatClick}>+</button>
    </div>
  </div>
  
  
  return <AsideContainer>
    {nav}
  </AsideContainer>
}

export default Aside;
