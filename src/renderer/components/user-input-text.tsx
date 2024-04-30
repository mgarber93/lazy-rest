import {useAppDispatch, useAppSelector} from '../features/store'
import {useCurrentConversation} from '../hooks/current-conversation'
import {User} from '../../models/user'
import {listModels} from '../features/models'
import {createContent} from '../../models/content'
import {respond, streamResponse} from '../features/chat'
import styled from 'styled-components'
import {ChangeEventHandler, KeyboardEventHandler, useCallback, useEffect, useState} from 'react'
import {getRespondingModel} from '../../models/responder'

const TextArea = styled.textarea`
  border: none;
  width: 100%;
  resize: none;
  background: none;
  color: var(--text-color);
  font-size: larger;
  outline: none;
  height: fit-content;
  margin: 0;
`

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
  return <TextArea
    rows={rows}
    placeholder={placeholder}
    onChange={handleChange}
    onKeyPressCapture={handleKeyPress}
    value={inputValue}
  />
}
