import styled from 'styled-components'
import {EndpointCallPlan} from '../../models/endpoint'
import {Icon} from './icon'
import {FormGroup} from '../wrapper/form-group'
import {PlanController} from '../../models/conversation'

const Wrapper = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-direction: column;
`

const Div = styled.div`
  & * {
    display: flex;
    flex-direction: column;
  }
  text-align: left;
  padding: 1rem 1rem;
  margin: 0 1rem;
  border-bottom: 1px solid var(--background-color-9);
  &:last-child {
    border:none;
  }

  &.GET {
  }

  &.PUT {
  }

  &.POST {
  }

  &.DELETE {
  }
  .method {
    min-width: 4rem;
  }

  .path {
    min-width: 11rem;
  }
  .background {
    min-width: 20rem;
  }
  .controls {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    & svg {
      background-color: var(--background-color-6);
    }
  }
`

export function Plan({plan}: { plan: EndpointCallPlan }) {
  return <Div className={"d-flex flex-row gap-2" + ` ${plan.method}`}>
    <span className={"method" }>
      {plan.method}
    </span>
    <span className={"path"}>
    {plan.path}
    </span>
    <span className={"background"}>
    {plan.background}
    </span>
    <span className={"controls"}>
      <Icon type={"checkbox"}/>
      <Icon type={"edit"}/>
    </span>
  </Div>

}

export function CallingPlanApproval({planController}: {planController: PlanController}) {
  return <FormGroup name={'Calling Plan'}>
    <Wrapper>
      {planController.endpointCallingPlan.map((item: any, index: number) => <Plan plan={item} key={item.background}></Plan>)}
    </Wrapper>
  </FormGroup>
}
