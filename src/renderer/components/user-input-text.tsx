import {ChangeEventHandler, KeyboardEventHandler, useCallback, useEffect, useState} from 'react'

import {useAppDispatch, useAppSelector} from '../features/store'
import {useCurrentConversation} from '../hooks/current-conversation'
import {User} from '../../models/user'
import {listModels} from '../features/models'
import {createContent} from '../../models/content'
import {respond, streamResponse} from '../features/chat'


export function UserInputText({placeholder}: { placeholder: string }) {
  const [inputValue, setValue] = useState('')
  const dispatch = useAppDispatch()
  const currentConversation = useCurrentConversation()
  const user = useAppSelector((state) => state.user) as User
  
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value)
  }
  useEffect(() => {
    dispatch(listModels())
  }, [dispatch])
  
  const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue && currentConversation.responder) {
      e.preventDefault()
      const prompt = createContent(inputValue, currentConversation.id, user.username, 'user')
      dispatch(respond(prompt))
      
      dispatch(streamResponse({conversationId: currentConversation.id}))
      setValue('')
    }
  }, [currentConversation, inputValue])
  
  // @todo refactor this magic number
  const rows = Math.max(inputValue.split('\n').length, (inputValue.length / 50) + 1)
  
  
  return <div className="flex min-w-0 flex-1 flex-col">
    <textarea
      className={"m-0 resize-none border-0 bg-transparent px-0 text-token-text-primary focus:ring-0 focus-visible:ring-0 max-h-52"}
      rows={rows}
      placeholder={placeholder}
      onChange={handleChange}
      onKeyPressCapture={handleKeyPress}
      value={inputValue}
    />
  </div>
}
