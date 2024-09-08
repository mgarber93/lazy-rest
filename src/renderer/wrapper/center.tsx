import React, {ReactNode} from 'react'

export function Center({children}: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-5 gap-5">
      {children}
    </div>
  )
}

export function CenterWithLabel({children}: { children: ReactNode }) {
  return (
    <div
      className="grid grid-cols-5 w-full h-full bg-zinc-200 dark:bg-zinc-900 rounded-xl py-2 px-4">
      {children}
    </div>
  )
}