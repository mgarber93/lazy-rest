import React from 'react';
import styled from 'styled-components';
import {AuthoredContent} from '../../models/content';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import {useSelector} from 'react-redux';
import {useAppSelector} from '../store';

const StyledDiv = styled.div`
    .author {
        color: var(--sage);
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        flex: 0 0 2rem;
        flex-shrink: 10;
        &.user {
            color: var(--dark-grey);
        }
        &.right-aligned {
            text-align: right;
            flex: 0 0 8rem;
        }
        &:hover {
            text-decoration: underline;
            cursor: pointer;
            box-shadow: 0.2rem 0.2rem 0.2rem var(--background-color-2);
        }
    }
    .author.user {
    }
    .content {
        padding-left: 0.5rem;
        flex-grow: 1;
    }

    border-radius: var(--border-radius);
    border-image-slice: 1;

    color: var(--text-color);
    border: none;
    display: flex;
    padding: 0.2rem;
    h6, p {
        margin: 0;
    }
    &:hover {
        background-color: var(--background-color-2);
    }
    transition: background-color 0.2s ease-in-out;
    width: 100%;
`;

export function Message({content}: { content: AuthoredContent }) {
  const userName = useAppSelector(state => state.user.username);
  const isRightAligned = content.author === userName;
  return (
    <StyledDiv>
      <p className={"author" + (isRightAligned? ' user' : '')}>
        {isRightAligned ? content.author : ''}
      </p>
      <Markdown className="content" remarkPlugins={[remarkGfm]}>{content.message}</Markdown>
      <p className={"author right-aligned" + (isRightAligned ? ' user' : '')}>
        {isRightAligned ? '' : content.author}
      </p>
    </StyledDiv>
  );
}