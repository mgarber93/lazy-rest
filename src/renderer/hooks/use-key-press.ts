import {useCallback, useEffect, useLayoutEffect, useRef} from 'react'

export const useKeyPress = (
  predicate: (event: KeyboardEvent) => boolean,
  callback: (event: KeyboardEvent) => void,
  node: HTMLElement | Document | null = null,
) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback)
  useLayoutEffect(() => {
    callbackRef.current = callback
  })
  
  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // check if one of the key is part of the ones we want
      if (predicate(event)) {
        callbackRef.current(event)
      }
    },
    [predicate, callback],
  )
  
  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document
    // attach the event listener
    targetNode &&
    targetNode.addEventListener("keydown", handleKeyPress)
    
    // remove the event listener
    return () =>
      targetNode &&
      targetNode.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress, node])
}

type KeyboardShortcut = {
  predicate: (event: KeyboardEvent) => boolean;
  handler: (event: KeyboardEvent) => void;
}

type UseKeyboardShortcutsProps = {
  chats: any[];
  chat: any;
  navigate: (path: string) => void;
  handleStartNewChat: () => string;
  handleRemoveChat: (id: string) => void;
}

export function useKeyboardShortcuts({
  chats,
  chat,
  navigate,
  handleStartNewChat,
  handleRemoveChat,
}: UseKeyboardShortcutsProps) {
  const SHORTCUTS = {
    NEXT_CHAT: 'ArrowRight',
    PREV_CHAT: 'ArrowLeft',
    NEW_CHAT: 't',
    CLOSE_CHAT: 'w',
    OPEN_CONFIG: '.',
  } as const
  
  const createShortcutPredicate = useCallback((key: string, requireMeta = true, requireAlt = false) =>
    (event: KeyboardEvent) =>
      event.metaKey === requireMeta &&
        event.altKey === requireAlt &&
        event.key === key,
  [],
  )
  
  const navigateToChat = useCallback((chatId: string) => {
    navigate(`/chats/${chatId}`)
  }, [navigate])
  
  const navigateToConfig = useCallback(() => {
    navigate('/config')
  }, [navigate])
  
  const shortcuts: KeyboardShortcut[] = [
    {
      predicate: createShortcutPredicate(SHORTCUTS.NEXT_CHAT, true, true),
      handler: useCallback(() => {
        const currentIndex = chats.findIndex(c => c.id === chat?.id) ?? -1
        if (currentIndex === -1 || currentIndex === chats.length - 1) {
          navigateToConfig()
        } else {
          const nextChat = chats[(currentIndex + 1) % chats.length]
          nextChat && navigateToChat(nextChat.id)
        }
      }, [chats, chat, navigateToConfig, navigateToChat]),
    },
    {
      predicate: createShortcutPredicate(SHORTCUTS.PREV_CHAT, true, true),
      handler: useCallback(() => {
        const currentIndex = chats.findIndex(c => c.id === chat?.id) ?? -1
        if (currentIndex <= 0) {
          navigateToConfig()
        } else {
          const nextChat = chats[(currentIndex - 1) % chats.length]
          nextChat && navigateToChat(nextChat.id)
        }
      }, [chats, chat, navigateToConfig, navigateToChat]),
    },
    {
      predicate: createShortcutPredicate(SHORTCUTS.NEW_CHAT),
      handler: useCallback(() => {
        const nextChat = handleStartNewChat()
        nextChat && navigateToChat(nextChat)
      }, [handleStartNewChat, navigateToChat]),
    },
    {
      predicate: createShortcutPredicate(SHORTCUTS.CLOSE_CHAT),
      handler: useCallback((event: KeyboardEvent) => {
        event.preventDefault()
        handleRemoveChat(chat.id)
      }, [chat, handleRemoveChat]),
    },
    {
      predicate: createShortcutPredicate(SHORTCUTS.OPEN_CONFIG),
      handler: navigateToConfig,
    },
  ]
  
  shortcuts.forEach(({predicate, handler}) => {
    useKeyPress(predicate, handler)
  })
}
