import styled from 'styled-components'
import {ReactNode} from 'react'

const Section = styled.section`
  .divider {
    width: 100%;
    height: 0.3rem;
    border-bottom: 0.1rem solid var(--background-color-9);
    margin-bottom: 1rem;
  }
  background-color: var(--background-color-1);
  padding: 1rem 1rem;
  border-radius: 1rem;
  border: 1px solid var(--background-color-2);
  &:hover {
    border: 1px solid var(--background-color-3);
  }
  transition: 2s ease-in border;

  background: var(--card);
  h4 {
    font-size: large;
  }
  h5 {
    font-size: medium;
  }
  h4, h5 {
    user-select: none;
  }
`

export function FormGroup(props: {name: string, tabHeaders: string[], children: ReactNode}) {
  return <Section className="provider">
    <div className="header d-flex flex-row gap-3">
      <h4>{props.name}</h4>
      <h5>Step 1</h5>
      <h5>Step 1</h5>
      <h5>Step 1</h5>
    </div>
    <div className="divider"></div>
    <div className="flex-row provider">
      {props.children}
    </div>
  </Section>
}