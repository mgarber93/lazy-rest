import styled from 'styled-components'
import {ReactNode} from 'react'

const Div = styled.div`
  border-radius: var(--border-radius-comfy);
  border: 1px solid transparent;
  background: var(--card);
  padding: 0rem;
  
  &:hover {
    border: 1px solid var(--background-color-4);
  }

  h2 {
    font-size: medium;
    color: var(--dark-grey)
  }

  margin: 0;
  transition: 0.4s ease-in-out border;

`

export function Card(props: {children: ReactNode, slim?: boolean}) {
  return <Div className={props?.slim ? 'slim' : ''}>
    {props.children}
  </Div>
}
