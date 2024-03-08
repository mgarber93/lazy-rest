import React from 'react';
import styled from 'styled-components';
import {AuthoredContent} from '../../models/content';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import {useAppSelector} from '../features/store';

const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: var(--name-gutter) 1fr;
    .author {
        color: var(--sage);
        border-radius: var(--border-radius) var(--border-radius) 0 0;

        &.user {
            color: var(--dark-grey);
        }

        &:hover {
            text-decoration: underline;
            box-shadow: 0.2rem 0.2rem 0.2rem var(--background-color-2);
        }
    }

    border-radius: var(--border-radius);
    border-image-slice: 1;
    color: var(--text-color);
    border: none;

    padding: 0.2rem;
    h6, p {
        margin: 0;
    }
    &:hover {
        background-color: var(--background-color-2);
    }
    transition: background-color 0.2s ease-in-out;
    width: 100%;
    cursor: default;
`;

export function Message({content}: { content: AuthoredContent }) {
  const userName = useAppSelector(state => state.user?.username);
  const isUser = content.author === userName;
  const author = content.author.length
  return (
    <StyledDiv>
      <p className={"author" + (isUser? ' user' : '')}>
        {content.author.substring(Math.max(author - 14, 0), Math.max(author, 14))}
      </p>
      <Markdown className="content" remarkPlugins={[remarkGfm]}>{content.message}</Markdown>
    </StyledDiv>
  );
}