import styled from 'styled-components'
import React from 'react'
import {ToolState} from '../features/tools'
import {Button} from '../styled/button'

const Wrapper = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-direction: column;
`

const ContinueButton = styled(Button)`
  /* Insert styles here */
`


export function CallingPlanApproval({tools}: { tools: ToolState }) {
  return <div>
    <ContinueButton> Approve </ContinueButton>
  </div>
}
