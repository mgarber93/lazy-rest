import styled from 'styled-components'
import {FormGroup} from '../wrapper/form-group'
import {FuturePlanComponent} from './future-plan-component'
import React from 'react'
import {Plan} from '../../models/conversation'

const Wrapper = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-direction: column;
`

export function CallingPlanApproval({planController}: { planController: Plan }) {
  return <FormGroup name={'Calling Plan'}>
    <Wrapper>
      {planController.endpointCallingPlan?.map((item: any, index: number) => <FuturePlanComponent plan={item} key={item.background}></FuturePlanComponent>)}
    </Wrapper>
  </FormGroup>
}
