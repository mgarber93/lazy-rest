import React, {useCallback, useEffect, useState} from 'react';
import {startNewChat} from '../features/chat';
import {RootState, useAppDispatch} from '../features/store';
import {useSelector} from 'react-redux';
import {Conversation} from '../../models/conversation';
import styled from 'styled-components';
import TimelineCard from './timeline-card';
import {Card} from '../wrapper/card';

const AsideContainer = styled.div`
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  font-size: small;
  display: flex;
  flex-direction: row;

  @media (min-width: 51rem) {
    border-right: 1px solid var(--background-color-1);
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
  }
`;

function Aside() {
  const chats = useSelector<RootState>((state) => state.chats) as Conversation[];

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
  
  return <AsideContainer>
    <Card>
      <div className="container-body">
        <TimelineCard items={chats}/>
      </div>
    </Card>
  </AsideContainer>
}

export default Aside;
