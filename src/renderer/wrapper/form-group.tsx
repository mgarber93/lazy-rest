import styled from 'styled-components';
import {ReactNode} from 'react';

const Section = styled.section`
  //padding: 0rem 1rem 1rem 1rem;
  //border-radius: 1rem;
  .divider {
    width: 100%;
    height: 1rem;
    border-bottom: 0.1rem solid var(--background-color-9);
    margin-bottom: 1rem;
  }
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