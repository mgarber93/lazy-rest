import styled from 'styled-components';
import {ReactNode} from 'react';

const Div = styled.div`
  border-radius: 0.2rem;
  border: 1px solid var(--background-color-5);
  background-color: var(--background-color-3);
  padding: 0.2rem;

  h2 {
    font-size: medium;
    color: var(--dark-grey)
  }

  margin: 0;
`;

export function Card(props: {children: ReactNode}) {
  return <Div>
    {props.children}
  </Div>
}