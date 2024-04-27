import {ChangeEvent, ChangeEventHandler, MouseEvent, useMemo, useState} from 'react'
import {Conversation} from '../../models/conversation'
import {useAppDispatch, useAppSelector} from '../features/store'
import {selectChat} from '../features/current-chat'
import styled from 'styled-components'
import {updateTitle} from '../features/chat'

const Input = styled.input`
  width: 100%;
  border: none;
  padding: 5px;
  border-bottom: 2px solid var(--background-color-1);
  font-size: medium;
  text-align: center;
  outline: none;
  color: var(--whitish);
  height: 100%;


  &.disabled {
    cursor: default;
  }

  background-color: unset;

  &.active {
    background-color: var(--primary);
    color: var(--blackish)
    //border-bottom: 2px solid var(--accent-text);
  }

  @media (prefers-color-scheme: light) {
    color: var(--text-color);
    &.active {
      background-color: var(--sage);
      color: var(--text-color);
      border-bottom: 2px solid var(--background-color-0);
    }
  }
`

export const ChatRoutableButton = ({chat}: { chat: Conversation }) => {
  const [isDisabled, setDisabled] = useState(true)
  const dispatch = useAppDispatch()
  const currentChat = useAppSelector((state) => state.currentChat)
  const handleClip = useMemo(() =>
    (event: MouseEvent) => {
      if (event.button === 2) {
        setDisabled(!isDisabled)
      }
      if (event.button === 0) {
        dispatch(selectChat(chat.id))
        setDisabled(true)
      }
    }, [dispatch, chat, setDisabled, isDisabled],
  )
  const handleChange = useMemo(() => (event: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled)
      return
    const newTitle = event.target.value
    dispatch(updateTitle({id: chat.id, title: newTitle}))
  }, [dispatch, chat, isDisabled]) as ChangeEventHandler<HTMLInputElement>
  const classNames = ["chatsContainer"]
  if (chat.id === currentChat)
    classNames.push('active')
  if (isDisabled)
    classNames.push('disabled')
  const className = classNames.join(' ')
  return <div onMouseUpCapture={handleClip}>
    <Input
      className={className}
      value={chat.title}
      onChange={handleChange}
      readOnly={isDisabled}
    />
  </div>
}