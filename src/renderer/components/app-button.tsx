import React, {ReactNode, useState} from 'react'
import clsx from 'clsx'

import {motion} from 'framer-motion'
import {Button} from '@headlessui/react'

export function AppButton({children, onClick, disabled, className}: {
  children: ReactNode,
  onClick?: (event: React.FormEvent) => void,
  disabled?: boolean,
  className?: string
}) {
  const button = "border border-black/50 dark:border-neutral-700 dark:bg-transparent bg-transparent rounded py-2 px-4 max-w-36 rounded"
  const hoverFlip = "hover:dark:bg-white/80 hover:bg-black hover:text-white hover:dark:border-black hover:dark:text-black"
  const [isMouseUp, setIsMouseUp] = useState(false)
  const handleMouseUp = () => {
    setIsMouseUp(true)
    setTimeout(() => {
      setIsMouseUp(false)
    }, 300) // resets back to 1 after 300ms
  }
  return (
    <Button
      className={clsx(
        "data-[focus]:outline-1 data-[focus]:dark:outline-white data-[selected]:text-neutral-200",
        "outline-2 outline-blue-800 data-[focus]:dark:bg-white data-[focus]:dark:text-black",
      )}
      disabled={disabled}
      onClick={onClick}
      onMouseUp={handleMouseUp}
    >
      <motion.div
        whileTap={{scale: 0.96}}
        animate={isMouseUp ? {scale: [1, 1.05, 1]} : undefined}
        transition={isMouseUp ? {duration: 0.1} : undefined} // Slower on mouse up
        className={clsx(
          button,
          hoverFlip,
          "bg-white/5 p-1 rounded h-full flex items-center justify-center",
          className,
          "data-[selected]:data-[hover]:dark:bg-black/25 outline-0",
          "z-40",
        )}
        tabIndex={-1}
      >
        {children}
      </motion.div>
    </Button>
  
  )
}
