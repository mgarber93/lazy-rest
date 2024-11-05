import React, { ReactNode } from "react"
import clsx from "clsx"

export function Center({
                         children,
                         className
                       }: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        "grid grid-cols-6 gap-2 justify-around h-full",
        className
      )}
    >
      {children}
    </div>
  )
}
