import {useCallback} from 'react'
import styled from 'styled-components'

import {HttpRequestPlan} from '../../models/http-request-plan'
import {useCurrentConversation} from '../hooks/current-conversation'
import {useAppDispatch} from '../features/store'
import {detailCallInPlan, executeCall} from '../features/chat'
import {Icon} from './icon'

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

    & svg {
      background-color: var(--background-color-6);
    }
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

export function PlannedHttpRequest({plan}: { plan: HttpRequestPlan }) {
  const convo = useCurrentConversation()
  const dispatch = useAppDispatch()
  const fillInDetails = useCallback(() => {
    dispatch(detailCallInPlan({chatId: convo.id, plan}))
  }, [convo, dispatch])
  const attemptCall = useCallback(() => {
    dispatch(executeCall({call: plan, chatId: convo.id}))
  }, [plan, convo.id])
  const hasResults = convo?.planController?.results?.length > 0 ?? false
  return <Div className={"d-flex flex-row gap-2" + ` ${plan.method}`}>
    <span className={"method"}>
      {plan.method}
    </span>
    <span className={"path"}>
      {plan.path}
    </span>
    <span className={"background"}>
      {plan.background}
    </span>
    <span className={"controls"}>
      {!hasResults ? <Icon type={"checkbox"} handleClick={attemptCall}></Icon> : null}
      <Icon type={"refresh"} handleClick={fillInDetails}></Icon>
    </span>
  </Div>
}

