import React, {ReactNode} from 'react'

export function Center({children}: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1"></div>
      <div className="col-span-2 border-2 border-zinc-300 bg-zinc-100 rounded-2xl p-4">{children}</div>
      <div className="col-span-1"></div>
    </div>
  )
}