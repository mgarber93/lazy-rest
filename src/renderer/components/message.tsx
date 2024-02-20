import {AuthoredContent} from '../../models/content';
import React from 'react';
import styled from 'styled-components';


const StyledInput = styled.input`
    border-radius: var(--border-radius);
    border-image-slice: 1;
    background-color: unset;
    color: var(--text-color);
    border: none;
`;

export function Message({content}: { content: AuthoredContent }) {
  return (
    <StyledInput className="respond" type="text" value={content.message} disabled={true}></StyledInput>
  );
}
