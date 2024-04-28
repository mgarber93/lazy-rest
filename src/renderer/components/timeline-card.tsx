import styled from 'styled-components'
import {TimelineExtend, TimelineItem} from './timeline-card-item'
import {Conversation} from '../../models/conversation'
import {newestToOldest} from '../utils/sort-date'

const Timeline = styled.ul`
  line-height: 1.5;
  margin: 4px 4px 1rem 4px;
  list-style: none;
  border-radius: var(--border-radius);
  padding: 0rem;

  .timeline-dot {
    fill: var(--timeline);
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
    width: 100%;
    padding: 0 0.2rem 0.2rem 0.2rem;
    flex: auto;
    max-width: 100%;
    min-width: 0;
    text-overflow: ellipsis;
    min-height: 3rem;
    border-radius: var(--border-radius);
    .TimelineItem-event {
      padding: 0rem 0.3rem 0rem 0.3rem;
      border: 1px solid var(--background-color-3);
      border-radius: var(--border-radius);
      &:hover {
        border: 1px solid var(--background-color-2);
        background-color: var(--background-color-0);
        &.active {
          background-color: var(--background-color-0);
        }
      }
      transition: 0.2s ease-in border, 0.2s ease-in-out background-color, 0.7s ease-in-out margin-right;
      &.active {
        background-color: var(--background-color-2);
        margin-right: 0.75rem;
        overflow: hidden;
      }
      a:hover {
        text-decoration: none !important;
      }
    }

    &.extend {
      margin-left: 0.3rem;
      padding: 0.2rem;
      z-index: 1;
      min-height: 1.5rem;
      background-color: var(--background-color-2);
      max-width: fit-content;
      border-radius: var(--border-radius);
      border: 1px solid var(--timeline);
      margin-bottom: 0.5rem;
      min-width: -webkit-fill-available;
    }
  }

  .time {
    display: flex;
  }

  .right-align-button {
    margin-left: auto;
    height: 10px;
    width: 10px;
    opacity: 0;
  }
  .hovered {
    opacity: 1;
  }
  transition: 1s ease-in opacity;

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
  .active {
    background-color: var(--primary-5);
  }
`


export function TimelineCard({items}: { items: Conversation[] }) {
  const sorted = [...items].sort((a, b) => newestToOldest(a.created, b.created))
  return <Timeline>
      <TimelineExtend/>
      {sorted.map(item => <TimelineItem item={item} key={item.id} />)}
    </Timeline>

}

export default TimelineCard