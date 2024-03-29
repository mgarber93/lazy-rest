import styled from 'styled-components';
import moment from 'moment';
import {useCallback, useState} from 'react';
import {CloseButton} from 'react-bootstrap';

import {useAppDispatch} from '../features/store';
import {selectChat} from '../features/current-chat';
import {createConversation} from '../../models/conversation';
import {removeChat, startNewChat} from '../features/chat';

const Timeline = styled.ul`
  line-height: 1.5;
  padding-left: 0;
  margin: 4px 4px 1rem 4px;
  list-style: none;

  .timeline-dot {
    fill: var(--background-color-2);
    font-size: large;
    display: inline-block;
  }

  .TimelineItem::before {
    width: 1px
  }

  .TimelineItem::before {
    background-color: var(--grey);
    bottom: -9px;
    content: "";
    display: block;
    left: 7px;
    position: absolute;
    top: 9px;
  }

  .TimelineItem {
    display: flex;
    position: relative;
    cursor: pointer;
  }

  .TimelineItem-body {
    padding: 0 0.2rem;
    flex: auto;
    max-width: 100%;
    min-width: 0;
    text-overflow: ellipsis;
    min-height: 3rem;

    &.extend {
      padding: 0.2rem;
      z-index: 1;
      min-height: 1.5rem;
      background-color: var(--background-color-2);
      max-width: fit-content;
      border-radius: var(--border-radius);
      border: 1px solid var(--grey);
      margin-bottom: 0.5rem;
    }

    &:hover {
      background-color: var(--background-color-2);
    }
  }

  .time {
    display: flex;
  }

  .right-align-button {
    margin-left: auto;
    height: 10px;
    width: 10px;
  }

  path {
    fill: var(--grey)
  }

  small {
    padding-top: unset;
  }

  a:hover {
    text-decoration: underline !important;
  }

  a {
    display: inline-block;
    max-width: 15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .time {
    color: var(--grey);
  }
`;

export interface Item {
  display: string;
  date: string;
  id: string;
}

function sortDate(a: string, b: string) {
  const aDate = new Date(a);
  const bDate = new Date(b);
  return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
}

function TimelineItem({item}: {item: Item}) {
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    dispatch(selectChat(item.id))
  }, [dispatch, item])
  const handleRemoveChat = useCallback(() => {
    dispatch(removeChat(item.id))
  }, [dispatch, item])
  return <li key={item.id} className={"TimelineItem list-style-none"}>
    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true">
      <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
    </svg>
    <div className={"TimelineItem-body"}>
      <div className={"time"}>
        {moment(item.date).fromNow()}
        <CloseButton className={"right-align-button"} onClick={handleRemoveChat}/>
      </div>
      <a onClick={handleClick}>{item.display || 'new chat'}</a>
    </div>
  </li>
}

function TimelineExtend() {
  const [item] = useState(createConversation('new'));
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    dispatch(startNewChat(item));
    dispatch(selectChat(item.id))
  }, [dispatch, item])
  return <li key={item.id} className={"TimelineItem list-style-none"}>
    <div className={"TimelineItem-body extend time"}>
      <a onClick={handleClick}>{item.content[0]?.message || item.title}</a>
    </div>
  </li>
}

export function TimelineCard({items}: { items: Item[] }) {
  const sorted = items
    .sort((a, b) => sortDate(a.date, b.date));
  return <Timeline>
    <TimelineExtend/>
    {sorted.map(item => <TimelineItem item={item} key={item.id} />)}
  </Timeline>
}

export default TimelineCard;