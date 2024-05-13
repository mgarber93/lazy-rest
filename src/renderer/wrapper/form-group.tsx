import styled from 'styled-components'
import {ReactNode} from 'react'

const Section = styled.section`
  & > * {
    width: 100%;
    overflow: hidden;
  }
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
    min-width: fit-content;
  }
  h5 {
    font-size: medium;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: auto;
    padding: 0.1rem 0.3rem;
    border-radius: var(--border-radius-emphasis);
    &:hover {
      background-color: var(--background-color-3);
    }
  }
  h4, h5 {
    user-select: none;
  }

  .tabs {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
`

export function FormGroup({name, tabs, children}: {
  name: string,
  tabs?: { id: string, display: string, onClick: () => void }[],
  children: ReactNode
}) {
  return <Section className="provider">
    <div className="header d-flex flex-row gap-3">
      <h4>{name}</h4>
      <div className="tabs">
        {tabs?.map((tab, i) => (
          <h5 key={tab.id} onClick={tab.onClick}>{i + 1}) {tab.display}</h5>
        ))}
      </div>
    </div>
    <div className="divider"></div>
    <div className="flex-row provider">
      {children}
    </div>
  </Section>
}