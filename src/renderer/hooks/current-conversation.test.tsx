import {renderHook} from '@testing-library/react'
import {Provider} from 'react-redux'
import React from 'react'
import {createStore} from '../features/store'
import {useCurrentConversation} from './current-conversation'
import {createConversation} from '../../models/conversation'

describe('useCurrentConversation', () => {
  let store: ReturnType<typeof createStore>
  beforeEach(() => {
    store = createStore()
  })
  test('does not throw error when rendered', () => {
    const {result} = renderHook(() => useCurrentConversation(), {
      wrapper: ({children}) => <Provider store={store}> {children} </Provider>,
    })
    expect(result.current.id).not.toBeUndefined()
  })
  
  // todo update now that it reads from params
  // test('returns the same chat when it exists', () => {
  //   const chat = createConversation('Test chat')
  //   store.dispatch(startNewChat(chat))
  //   store.dispatch(selectChat(chat.id))
  //   const {result} = renderHook(() => useCurrentConversation(), {
  //     wrapper: ({children}) => <Provider store={store}> {children} </Provider>,
  //   })
  //
  //   expect(result.current.id).toBe('Test chat')
  // })
  
  test('returns new chat if no chats exists', () => {
    const {result} = renderHook(() => useCurrentConversation(), {
      wrapper: ({children}) => <Provider store={store}> {children} </Provider>,
    })
    
    expect(result.current.title).toBe(createConversation().title)
  })
})
