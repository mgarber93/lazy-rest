import styled from 'styled-components'
import {FormGroup} from '../wrapper/form-group'
import {PlannedHttpRequest} from './planned-http-request'
import React from 'react'
import {Plan} from '../../models/conversation'
import {ResultOfCall} from './call-result'

const Wrapper = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-direction: column;
`

export function CallingPlanApproval({planController}: { planController: Plan }) {
  const {endpointCallingPlan, result, step} = planController
  const tabs = endpointCallingPlan.map(plan => {
    return {
      id: plan.background,
      display: plan.background.split(' ').slice(1).join(' '),
      onClick: console.log,
    }
  })
  const stepPlan = endpointCallingPlan[step ?? 0]
  return <FormGroup name={'Calling Plan:'} tabs={tabs}>
    <Wrapper>
      <PlannedHttpRequest plan={stepPlan} key={stepPlan.background}/>
      {result ? <ResultOfCall result={result}/> : null}
    </Wrapper>
  </FormGroup>
}
