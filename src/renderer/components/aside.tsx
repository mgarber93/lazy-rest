import React, {useCallback, useEffect, useState} from 'react';
import {startNewChat} from '../features/chat';
import {RootState, useAppDispatch} from '../features/store';
import {useSelector} from 'react-redux';
import {Conversation} from '../../models/conversation';
import styled from 'styled-components';
import TimelineCard from './timeline-card';

const AsideContainer = styled.div`
  padding: 2rem 1rem;
  font-size: small;
  display: flex;
  flex-direction: row;

  .container {
    border: 1px solid var(--background-color-2);

    h2 {
      font-size: medium;
    }

    border-radius: var(--border-radius) calc(var(--border-radius-emphasis) - 1rem) calc(var(--border-radius-emphasis) - 1rem) var(--border-radius);
    padding: 0;
    margin: 0;
  }

  .container-header {
    background-color: var(--background-color-1);
    display: flex;
    flex-direction: row;
    width: 100%;
    border-top-left-radius: calc(var(--border-radius-emphasis) - 1rem);
    border-top-right-radius: calc(var(--border-radius-emphasis) - 1rem);
    border-bottom-right-radius: 0;
  }

  @media (min-width: 51rem) {
    border-radius: 2rem;
    border-right: 1px solid var(--background-color-1);
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
  }

  .user {
    user-select: none;
  }

  .userContainer {
    padding: 0.6rem 1.2rem;
    min-height: 5vh;
    font-size: larger;
  }

  button {
    transition: background-color 200ms ease-in-out;

    &:hover {
      background-color: var(--primary);
    }

    border: unset;
    border-radius: var(--border-radius);
    width: 1.5rem;
    height: 1.5rem;
  }

  .bottom {
    margin-top: auto;
    bottom: 0;
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
    </div>
    <div className="footer">
      <button onClick={handleNewChatClick}>+</button>
    </div>
  </div>
  
  return <AsideContainer>
    <div className="container">
      <div className="container-header">
        <button onClick={handleNewChatClick}>+</button>
      </div>
      <div className="container-body">
        <TimelineCard items={chats.map(chat => ({id: chat.id, display: chat.content[0]?.message ?? '', date: chat.created}))}/>
      </div>
    </div>
  </AsideContainer>
}

export default Aside;
