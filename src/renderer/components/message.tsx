import React from 'react'
import styled from 'styled-components'
import {AuthoredContent} from '../../models/content'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {useAppSelector} from '../features/store'
import {Card} from '../wrapper/card'

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr var(--name-gutter);

  .author {
    color: var(--accent-text);
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    text-align: center;

    &.user {
      color: var(--dark-grey);
    }
  }

  .content {
    h1, h2 {
      font-size: large;
    }

    h3, h4, h5 {
      font-size: medium;
    }
  }

  border-radius: var(--border-radius);
  border-image-slice: 1;
  color: var(--text-color);
  border: none;
  font-size: var(--bs-body-font-size);

  p {
    margin: 0;
  }

  transition: background-color 0.2s ease-in-out;
  width: 100%;
  cursor: default;
`

export function Message({content}: { content: AuthoredContent }) {
  const userName = useAppSelector(state => state.user?.username)
  const isUser = content.author === userName
  const author = content.author?.length

  if (content.role === 'system') {
    return (
      <StyledDiv>
        <div>{content.author}</div>
        <p className={"author"}>
          {content.role}
        </p>
      </StyledDiv>
    )
  }
  const node = <StyledDiv>
    <Markdown className="content" remarkPlugins={[remarkGfm]}>{content.message.replace(/(\n)+/g, '  \n')}</Markdown>
    <p className={"author" + (isUser ? ' user' : '')}>
      {content.author?.substring(Math.max(author - 14, 0), Math.max(author, 14))}
    </p>
  </StyledDiv>

  return <Card slim={isUser}>{node}</Card>
}