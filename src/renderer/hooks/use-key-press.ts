import { useCallback, useEffect, useLayoutEffect, useRef } from "react"

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
    [predicate],
  )

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document
    // attach the event listener
    targetNode && targetNode.addEventListener("keydown", handleKeyPress)

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress, node])
}
