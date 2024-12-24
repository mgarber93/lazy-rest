import React, {ReactNode} from 'react'
import clsx from 'clsx'
import {Button} from '@headlessui/react'

export function AppButton({children, onClick, disabled, className}: {
  children: ReactNode,
  onClick?: (event: React.FormEvent) => void,
  disabled?: boolean,
  className?: string
}) {
  const button = "border border-black/50 dark:border-neutral-700 dark:bg-transparent bg-transparent rounded py-2 px-4 max-w-36 rounded"
  const hoverFlip = "hover:dark:bg-white/80 hover:bg-black hover:text-white hover:dark:border-black hover:dark:text-black"

  return (
    <Button
      className={clsx(
        "data-[focus]:outline-1 data-[focus]:dark:outline-white data-[selected]:text-neutral-200",
        "outline-2 outline-blue-800 data-[focus]:dark:bg-white data-[focus]:dark:text-black",
        button,
        !disabled && hoverFlip,
        "bg-white/5 p-1 rounded h-full flex items-center justify-center",
        className,
        !disabled && "data-[selected]:data-[hover]:dark:bg-black/25 outline-0",
        "z-40",
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
