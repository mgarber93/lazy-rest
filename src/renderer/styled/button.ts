import styled from 'styled-components';

export const Button = styled.button`
  background: var(--call-to-action);
  border: 1px solid var(--primary-0);
  height: 2.5rem;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;

  &:hover {
    box-shadow: 4px 0px 2rem var(--primary-2);
  }

  &:disabled {
    background: var(--background-color-2);
  }
`
