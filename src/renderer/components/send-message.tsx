import React, {useState} from 'react'
import styled from 'styled-components'
import {useAppSelector} from '../features/store'
import {useCurrentConversation} from '../hooks/current-conversation'
import {UserInputText} from './user-input-text'
import {Model, Organization, Responder} from '../../models/responder'

const SendMessageContainer = styled.div`
  position: sticky;
  margin-top: auto;
  bottom: 2.5rem;
  flex-direction: row;
  width: 100%;
  height: fit-content;
  display: flex;
  border-top: var(--dashed);
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
  const currentUser = useAppSelector(state => state.user.username)
  const models = useAppSelector(state => state.models.models)

  const currentConversation = useCurrentConversation()

  const placeholder = mapResponderToPlaceholder(currentConversation?.responder)
  return (
    <SendMessageContainer>
      <UserInputText placeholder={placeholder}/>
    </SendMessageContainer>
  )
}