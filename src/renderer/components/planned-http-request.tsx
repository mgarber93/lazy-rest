import styled from 'styled-components'
import {PlanStep} from '../../models/conversation'

const Div = styled.div`
  & * {
    display: flex;
    flex-direction: column;
  }

  &:last-child {
    border: none;
  }

  text-align: left;
  padding: 1rem 1rem;
  background-color: var(--background-color-2);
  border-radius: 1rem;

  .method {
    min-width: 2.5rem;
  }

  .path {
    min-width: 15rem;
    height: fit-content;
  }

  .background {
    min-width: 20rem;
    margin-left: auto;
  }

  .controls {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }

  .method, .path, .background {
    border-radius: var(--border-radius);
    display: block;
    text-align: center;
    padding: 0.1rem;
    background-color: var(--background-color-6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export function PlannedHttpRequest({step}: { step: PlanStep }) {
  const plan = step.action
  
  return <Div className={"d-flex flex-row gap-2" + ` ${plan.method}`}>
    <span className={"method"}>
      {plan.method}
    </span>
    <span className={"path"}>
      {plan.path}
    </span>
    <span className={"background"}>
      {step.background}
    </span>
  </Div>
}

