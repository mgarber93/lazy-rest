import React from 'react'
import styled from 'styled-components'
import {useAppSelector} from '../features/store'
import {useCurrentConversation} from '../hooks/current-conversation'
import {UserInputText} from './user-input-text'
import {Model, Organization, Responder} from '../../models/responder'

const SendMessageContainer = styled.div`
  flex-direction: row;
  width: 100%;
  height: fit-content;
  border-top: var(--dashed);
  display: block;
  min-height: 2rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
`

function mapResponderToPlaceholder(responder: Responder) {
  switch (responder?.type ?? '') {
    case "chat": {
      return `Message ${(responder as Model)?.model}`
    }
    case "organization": {
      return `Message ${(responder as Organization).orgId}`
    }
    default:
      return `Select a model`
  }
}

export function SendMessage() {
  const currentConversation = useCurrentConversation()

  const placeholder = mapResponderToPlaceholder(currentConversation?.responder)
  return (
    <SendMessageContainer>
      <UserInputText placeholder={placeholder}/>
    </SendMessageContainer>
  )
}
