import React from 'react';
import styled from 'styled-components';
import {AuthoredContent} from '../../models/content';


const StyledDiv = styled.div`
    border-radius: var(--border-radius);
    border-image-slice: 1;
    background-color: unset;
    color: var(--text-color);
    border: none;
`;

export function Message({content}: { content: AuthoredContent }) {
  return (
    <StyledDiv>
      <h3 className="author">
        {content.author}
      </h3>
      <span className="content">
        {content.message}
      </span>
    </StyledDiv>
  );
}
