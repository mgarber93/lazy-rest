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
  const {endpointCallingPlan, results} = planController
  return <FormGroup name={'Calling Plan'}>
    <Wrapper>
      {endpointCallingPlan?.map((item: any, index: number) =>
        <PlannedHttpRequest plan={item} key={item.background}/>)}
      {results?.map((item) => <ResultOfCall result={item}/>)}
    </Wrapper>
  </FormGroup>
}
