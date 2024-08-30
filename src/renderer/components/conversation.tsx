import React from 'react'
import {Message} from './message'
import {SendMessage} from './send-message'
import {useCurrentConversation} from '../hooks/current-conversation'


export const ConversationComponent = () => {
  const activeChat = useCurrentConversation()

  return (
    <div>
      <div>
        {
          activeChat?.content.map(content => <Message key={content.id} content={content}/>)
        }
      </div>
      <SendMessage/>
    </div>
  )
}
