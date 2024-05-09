import styled from 'styled-components'
import {FormGroup} from '../wrapper/form-group'
import {PlannedHttpRequest, ResultOfCall} from './planned-http-request'
import React from 'react'
import {Plan} from '../../models/conversation'

const Wrapper = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-direction: column;
`

export function CallingPlanApproval({planController}: { planController: Plan }) {
  const {endpointCallingPlan, results} = planController
  return <FormGroup name={'Calling Plan'}>
    <Wrapper>
      {endpointCallingPlan?.map((item: any) => <PlannedHttpRequest plan={item}
                                                                   key={item.background}></PlannedHttpRequest>)}
      {results?.map((item) => <ResultOfCall result={item}/>)}
    </Wrapper>
  </FormGroup>
}
