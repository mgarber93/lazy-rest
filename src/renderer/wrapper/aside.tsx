import React from 'react'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import {Conversation} from '../../models/conversation'
import {RootState} from '../features/store'
import TimelineCard from '../components/timeline-card'
import {ResponderType} from './responder-type'

const AsideContainer = styled.div`
  padding: 1rem 0.5rem 0rem 0rem;
  font-size: small;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 1rem;
  .footer {
    width: 100%;
    margin-top: auto;
    padding-bottom: 2rem;
    & > * {
      position: absolute;
      bottom: 0;
    }
  }
`

function Aside() {
  const chats = useSelector<RootState>((state) => state.chats) as Conversation[]
  return <AsideContainer>
    <TimelineCard items={chats}/>
    <div className="footer">
      <ResponderType/>
    </div>
  </AsideContainer>
}

export default Aside
