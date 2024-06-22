import styled from 'styled-components'

export const Button = styled.button`
  min-width: 5rem;
  min-height: 2rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--background-color-9);
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.05), -2px 2px 6px rgba(0, 0, 0, 0.05);
  font-size: smaller;

  &:hover {
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.03), -2px 2px 6px rgba(0, 0, 0, 0.03);
  }

  transition: box-shadow 0.2s;
`
