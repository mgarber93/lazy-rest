import React from 'react';
import styled from 'styled-components';
import {AuthoredContent} from '../../models/content';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

const StyledDiv = styled.div`
    .author {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--background-color-1);
        color: var(--sage);
        border-radius: var(--border-radius) var(--border-radius) 0 0;
    }
    .author.user {
        color: var(--dark-grey);
    }
    border-radius: var(--border-radius);
    border-image-slice: 1;

    color: var(--text-color);
    border: none;
    background-color: var(--background-color-0);
`;

export function Message({content}: { content: AuthoredContent }) {
  return (
    <StyledDiv>
      <h6 className={"author" + (content.author === 'matt' ? ' user' : '')}>
        {content.author}
      </h6>
      <Markdown className="content" remarkPlugins={[remarkGfm]}>{content.message}</Markdown>
    </StyledDiv>
  );
}