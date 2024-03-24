import styled from 'styled-components';
import moment from 'moment';
import {useCallback} from 'react';
import {useAppDispatch} from '../features/store';
import {selectChat} from '../features/current-chat';

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
    //background-color: var(--background-color-2);
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
  }

  .TimelineItem-body {
    flex: auto;
    max-width: 100%;
    min-width: 0;
    text-overflow: ellipsis;
    min-height: 3rem;
  }

  path {
    //fill: var(--background-color-2);
    fill: var(--grey)
  }

  small {
    padding-top: unset;
  }
  
  a:hover {
    text-decoration: underline !important;
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
  return <li key={item.id} className={"TimelineItem list-style-none"}>
    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"
         className="octicon octicon-dot-fill">
      <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
    </svg>
    <div className={"TimelineItem-body"}>
      <div>{moment(item.date).fromNow()}</div>
      <a onClick={handleClick}>{item.display || 'new chat'}</a>
    </div>
  </li>
}

export function TimelineCard({items}: { items: Item[] }) {
  const sorted = items
    .sort((a, b) => sortDate(a.date, b.date));
  return <Timeline>
    {sorted.map(item => <TimelineItem item={item} key={item.id} />)}
  </Timeline>
}

export default TimelineCard;