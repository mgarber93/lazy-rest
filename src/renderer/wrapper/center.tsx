import React, {ReactNode} from 'react'

export function Center({children}: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-5 gap-2 justify-around h-full">
      {children}
    </div>
  )
}

