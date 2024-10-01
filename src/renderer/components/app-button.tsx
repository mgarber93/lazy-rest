import React, {ReactNode} from 'react'
import clsx from 'clsx'

import {motion} from 'framer-motion'

export function AppButton({children, onClick, disabled, className}: {
  children: ReactNode,
  onClick?: (event: React.FormEvent) => void,
  disabled?: boolean,
  className?: string
}) {
  const button = "border border-black/50 dark:border-neutral-700 dark:bg-transparent bg-transparent rounded py-2 px-4 max-w-36 rounded"
  const hoverFlip = "hover:dark:bg-white/80 hover:bg-black hover:text-white hover:dark:border-black hover:dark:text-black"
  return (
    <motion.button
      whileTap={{scale: 0.95}}
      transition={{duration: 0.001}}
      className={clsx(
        button,
        hoverFlip,
        "bg-white/5 transition-all p-1 rounded h-full flex items-center justify-center",
        className,
      )}
      onClick={onClick} disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
