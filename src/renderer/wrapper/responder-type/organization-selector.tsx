import React, {useCallback} from 'react'
import styled from 'styled-components'
import {Button} from '../../styled/button'
import {useAppDispatch} from '../../features/store'
import {setResponder} from '../../features/chat'
import {Responder} from '../../../models/responder'
import {useCurrentConversation} from '../../hooks/current-conversation'

const FormButton = styled(Button)`
  height: 1.6rem;
  font-size: smaller;
  padding: 0.2rem 0.4rem;
  margin-top: 1rem;
  background: var(--background-color-9);
`

export function OrganizationSelector() {
  const dispatch = useAppDispatch()
  const conversation = useCurrentConversation()
  const chatId = conversation?.id
  const organizations = ['Swagger GPT']
  
  const handleClick = useCallback(() => {
    dispatch(setResponder({
      responder: {type: 'organization', provider: "openai", model: "gpt-4o", orgId: "SwaggerGpt"} satisfies Responder,
      chatId,
    }))
  }, [dispatch, chatId])
  
  return <FormButton onClick={handleClick}>{organizations[0]}</FormButton>
}
