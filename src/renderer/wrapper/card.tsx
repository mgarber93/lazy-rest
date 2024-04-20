import styled from 'styled-components';
import {ReactNode} from 'react';

const Div = styled.div`
  border-radius: 1rem;
  border: 1px solid var(--background-color-3);
  background-color: var(--background-color-2);
  padding: 2rem;
  max-width: 36rem;
  
  &:hover {
    border: 1px solid var(--background-color-4);
  }

  h2 {
    font-size: medium;
    color: var(--dark-grey)
  }

  margin: 0;
  transition: 0.4s ease-in border;
`;

export function Card(props: {children: ReactNode}) {
  return <Div>
    {props.children}
  </Div>
}