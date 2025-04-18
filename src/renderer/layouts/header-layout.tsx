import React, {ReactElement} from 'react'
import clsx from 'clsx'
import {Header} from '../wrapper/header'
import {lgTransparent} from '../utils/transparent'

export function HeaderLayout({children}: { children: ReactElement }) {
  return (
    <>
      <div className={clsx(
        lgTransparent,
        "flex flex-col dark:text-neutral-50 border-0",
      )}>
        <Header>
          <div className={clsx(
            "bg-neutral-50/50 dark:bg-neutral-950/80",
            "w-full",
          )}>
            {children}
          </div>
        </Header>
      </div>
    </>
  )
}
