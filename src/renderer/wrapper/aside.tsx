import React from 'react';
import {RootState} from '../features/store';
import {useSelector} from 'react-redux';
import {Conversation} from '../../models/conversation';
import styled from 'styled-components';
import TimelineCard from '../components/timeline-card';
import {Card} from './card';
import {ResponderType} from './responder-type';

const AsideContainer = styled.div`
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  font-size: small;
  display: flex;
  border-right: 1px solid var(--background-color-1);
  flex-direction: column;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 1rem;
`;

function Aside() {
  const chats = useSelector<RootState>((state) => state.chats) as Conversation[];
  return <AsideContainer>
    <Card>
      <div className="container-body">
        <TimelineCard items={chats}/>
      </div>
    </Card>
    <ResponderType/>
  </AsideContainer>
}

export default Aside;
