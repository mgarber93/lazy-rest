import React from 'react'
import {useCurrentConversation} from '../hooks/current-conversation'
import {Responder} from '../../models/responder'


function mapResponderToPlaceholder(responder?: Responder) {
  switch (responder?.type ?? '') {
    case "chat": {
      return `Message ${responder?.model}`
    }
    case "organization": {
      return `Message ${responder?.orgId}`
    }
    default:
      return `Select a model from the bottom left?? idk maybe this is a button right here`
  }
}

export function SendMessage() {
  const currentConversation = useCurrentConversation()
  
  const placeholder = mapResponderToPlaceholder(currentConversation?.responder)
  return (
    <div>
      todo user input to send message
    </div>
  )
}
