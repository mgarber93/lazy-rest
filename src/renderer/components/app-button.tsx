import {Button} from '@headlessui/react'
import React, {ReactNode} from 'react'
import clsx from 'clsx'

export function AppButton({children, onClick, disabled}: {
  children: ReactNode,
  onClick?: (event: React.FormEvent) => void,
  disabled?: boolean
}) {
  const button = "border border-black/50 dark:border-white/50 bg-transparent hover:bg-black/15 hover:dark:bg-white/5 rounded py-2 px-4 w-fit max-w-36"
  return (
    <Button className={clsx(
      "bg-white/5 hover:bg-white/20 p-1 rounded w-full h-full flex items-center justify-center",
      button,
    )} onClick={onClick} disabled={disabled}>
      {children}
    </Button>)
}
