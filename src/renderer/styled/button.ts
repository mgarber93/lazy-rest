import styled from 'styled-components'

export const Button = styled.button`
  background: var(--call-to-action);
  border: 1px solid var(--primary-0);
  height: 2.5rem;

  &:hover {
    background: buttonface;
    color: var(--background-color-0)
  }

  &:disabled {
    background: var(--background-color-2);
  }
  transition: 0.4s ease-in-out;
`
