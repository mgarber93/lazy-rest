import styled from 'styled-components'

export const Button = styled.button`
  background: var(--call-to-action);
  border: 1px solid var(--primary-0);
  height: 2.5rem;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;

  &:hover {
    box-shadow: 0.4rem 0px 0.4rem var(--background-color-9);
  }

  &:disabled {
    background: var(--background-color-2);
  }
  transition: 0.4s ease-in-out;
`
