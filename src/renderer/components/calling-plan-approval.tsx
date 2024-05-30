import styled from 'styled-components'
import React from 'react'
import {FormGroup} from '../wrapper/form-group'
import {PlannedHttpRequest} from './planned-http-request'
import {Plan} from '../../models/conversation'
import {ResultOfCall} from './call-result'

const Wrapper = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-direction: column;
`

export function CallingPlanApproval({planController}: { planController: Plan }) {
  const {step, steps} = planController
  return <div>todo calling plan</div>
}
