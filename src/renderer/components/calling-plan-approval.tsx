import styled from 'styled-components'
import {EndpointCallPlan} from '../../models/endpoint'
import {Icon} from './icon'
import {FormGroup} from '../wrapper/form-group'
import {PlanController} from '../../models/conversation'
import {useCallback} from 'react'
import {detailCallInPlan, executeCall} from '../features/chat'
import {useCurrentConversation} from '../hooks/current-conversation'
import {useAppDispatch} from '../features/store'

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
  &:last-child {
    border:none;
  }
  background-color: var(--background-color-2);
  &:hover {
    background-color: var(--background-color-3);
  }
  border-radius: 1rem;

  &.GET {
  }

  &.PUT {
  }

  &.POST {
  }

  &.DELETE {
  }
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
    & svg {
      background-color: var(--background-color-6);
    }
  }
  .method, .path, .background {
    border-radius: var(--border-radius);
  }
  .path {
    background-color: var(--background-color-6);
    padding: 0.12rem 0.5rem;
  }
`

export function Plan({plan}: { plan: EndpointCallPlan }) {
  const convo = useCurrentConversation()
  const dispatch = useAppDispatch()
  const fillInDetails = useCallback(() => {
    // dispatch(detailCallInPlan({chatId: convo.id, plan}))
  }, [convo, dispatch])
  const attemptCall = useCallback(() => {
    dispatch(executeCall({call: plan}))
  }, [plan])
  return <Div className={"d-flex flex-row gap-2" + ` ${plan.method}`} onClick={attemptCall}>
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
      <Icon type={"refresh"} handleClick={fillInDetails}></Icon>
    </span>
  </Div>
}

export function CallingPlanApproval({planController}: {planController: PlanController}) {
  return <FormGroup name={'Calling Plan'}>
    <Wrapper>
      {planController.endpointCallingPlan?.map((item: any, index: number) => <Plan plan={item} key={item.background}></Plan>)}
    </Wrapper>
  </FormGroup>
}
