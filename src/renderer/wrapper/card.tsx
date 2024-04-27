import styled from 'styled-components'
import {ReactNode} from 'react'

const Div = styled.div`
  border-radius: var(--border-radius-comfy);
  border: 1px solid var(--background-color-3);
  background: var(--card);
  padding: 1rem;
  
  &:hover {
    border: 1px solid var(--background-color-4);
  }

  h2 {
    font-size: medium;
    color: var(--dark-grey)
  }

  margin: 0;
  transition: 0.4s ease-in-out border;
  
  &.slim {
    padding: 0.3rem 1rem;
  }
`

export function Card(props: {children: ReactNode, slim?: boolean}) {
  return <Div className={props?.slim ? 'slim' : ''}>
    {props.children}
  </Div>
}