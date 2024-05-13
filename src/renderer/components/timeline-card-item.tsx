import moment from 'moment'
import {useCallback, useState} from 'react'
import styled from 'styled-components'
import {useAppDispatch} from '../features/store'
import {selectChat} from '../features/current-chat'
import {removeChat, startNewChat} from '../features/chat'
import {Conversation, createConversation} from '../../models/conversation'
import {useCurrentConversation} from '../hooks/current-conversation'
import {Icon} from './icon'

const Button = styled.button`
  min-width: 17.6rem;
  transition: 0.2s ease-in-out background;

  &:hover {
    background: var(--grey);
  }

  z-index: auto;
  border: 1px solid var(--grey);
  color: black;
  border-radius: var(--border-radius) var(--border-radius) var(--border-radius) 0;
  margin-bottom: 1rem;
  margin-left: 0.44rem;
`

const Wrapper = styled.div`
  .close-button {
    top: 0.75rem;
    right: 0.05rem;
    position: relative;
  }

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .icon {
    max-height: 1.21875rem;
  }
`

export function TimelineItem({item}: { item: Conversation }) {
  const [isHovered, setHovered] = useState(false)
  const dispatch = useAppDispatch()
  const handleClick = useCallback(() => {
    dispatch(selectChat(item.id))
  }, [dispatch, item])
  const handleRemoveChat = useCallback(() => {
    dispatch(removeChat(item.id))
  }, [dispatch, item])
  const handleMouseOver = useCallback(() => {
    setHovered(true)
  }, [setHovered])
  const handleMouseLeave = useCallback(() => {
    setHovered(false)
  }, [setHovered])
  const currentConversation = useCurrentConversation()
  const isActive = currentConversation?.id === item.id
  const className = "TimelineItem list-style-none "
  const bodyStyles = "TimelineItem-event " + (isActive && "active")

  return <li key={item.id} className={className} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
    <svg aria-hidden="true" height="21" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true">
      <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
    </svg>
    <div className={"TimelineItem-body"} onClick={handleClick}>
      <div className={bodyStyles}>
        <Wrapper className={"time"}>
          {moment(item.created).fromNow()}
          <div className="icon">
            {isHovered && <Icon handleClick={handleRemoveChat} type={'x'} hideBackground={true}/>}
          </div>
        </Wrapper>
        <a>{item.content?.[0]?.message || item.id}</a>
      </div>
    </div>
  </li>
}

export function TimelineExtend() {
  const dispatch = useAppDispatch()
  const handleClick = useCallback(() => {
    const item = createConversation('new')
    dispatch(startNewChat())
    dispatch(selectChat(item.id))
  }, [dispatch])
  return <li className={"TimelineItem list-style-none"}>
    <div>
      <Button onClick={handleClick}>new</Button>
    </div>
  </li>
}