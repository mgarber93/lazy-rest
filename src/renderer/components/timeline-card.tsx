import styled from 'styled-components';

const Timeline = styled.ul`
  .TimelineItem::before {
    width: 1px
  }

  .TimelineItem::before {
    background-color: var(--background-color-2);
    bottom: 0;
    content: "";
    display: block;
    left: 0;
    position: absolute;
    top: 0;
  }

  .TimelineItem {
    display: flex;
    position: relative;
  }

  .TimelineItem-body {
    flex: auto;
    max-width: 100%;
    min-width: 0;
  }
`


export function TimelineCard() {
  return <Timeline>
    <li className={"TimelineItem list-style-none"}>
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"
           className="octicon octicon-dot-fill mb-2">
        <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
      </svg>
      <div className={"TimelineItem-body"}>
        gpt-3.5-turbo
      </div>
    </li>
    <li className={"TimelineItem list-style-none"}>
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"
           className="octicon octicon-dot-fill mb-2">
        <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
      </svg>
      <div className={"TimelineItem-body"}>
        gpt-4-turbo-preview
      </div>
    </li>
  
  </Timeline>
}

export default TimelineCard;