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
        flex: 0 0 8rem;
    }
    .author.user {
        color: var(--dark-grey);
    }
    .content {
        padding-left: 0.5rem;
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
        background-color: var(--background-color-0);
    }
    transition: background-color 0.2s ease-in-out;
`;

export function Message({content}: { content: AuthoredContent }) {
  const userName = useAppSelector(state => state.user.username);
  return (
    <StyledDiv>
      <h6 className={"author" + (content.author === userName ? ' user' : '')}>
        {content.author}
      </h6>
      <Markdown className="content" remarkPlugins={[remarkGfm]}>{content.message}</Markdown>
    </StyledDiv>
  );
}