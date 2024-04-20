import styled from 'styled-components';
import {ReactNode} from 'react';

const Section = styled.section`
  .divider {
    width: 100%;
    height: 1rem;
    border-bottom: 0.1rem solid var(--background-color-9);
    margin-bottom: 1rem;
  }
  background-color: #0001;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--background-color-2);
  &:hover {
    border: 1px solid var(--background-color-3);
  }
  transition: 2s ease-in border;
`;

export function FormGroup(props: {name: string, children: ReactNode}) {
  return <Section className="provider">
    <h4>{props.name}</h4>
    <div className="divider"></div>
    <div className="flex-row provider">
      {props.children}
    </div>
  </Section>
}