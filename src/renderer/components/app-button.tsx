import {Button} from '@headlessui/react'
import React, {ReactNode} from 'react'
import clsx from 'clsx'

export function AppButton({children, onClick, disabled, className}: {
  children: ReactNode,
  onClick?: (event: React.FormEvent) => void,
  disabled?: boolean,
  className?: string
}) {
  const button = "border border-black/50 dark:border-zinc-700 dark:bg-zinc-950 bg-transparent rounded py-2 px-4 w-fit max-w-36 rounded-lg"
  const hoverFlip = "hover:dark:bg-white hover:bg-black hover:text-white hover:dark:border-black hover:dark:text-black"
  return (
    <Button className={clsx(
      "bg-white/5 transition-all p-1 rounded w-full h-full flex items-center justify-center",
      button,
      hoverFlip,
      className,
    )} onClick={onClick} disabled={disabled}>
      {children}
    </Button>)
}
