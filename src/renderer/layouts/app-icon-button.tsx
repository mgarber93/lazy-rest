import React, {useCallback, useState} from 'react'
import clsx from 'clsx'

export function AppIconButton({children}: { children: React.ReactNode }) {
  const [clicked, setClicked] = useState<boolean>(false)
  const handleMouseUp = useCallback(() => {
    setClicked(false)
  }, [setClicked])
  const handleMouseDown = useCallback(() => {
    setClicked(true)
  }, [setClicked])
  
  return <div
    className={clsx(
      "rounded-full",
      "size-7 p-1 ml-auto relative right-0 bg-gray-200 dark:bg-black/40 transition-colors",
      "px-1 hover:scale-125 transition-transform cursor-pointer",
      clicked && "hover:scale-90",
    )}
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
  >
    {children}
  </div>
}
