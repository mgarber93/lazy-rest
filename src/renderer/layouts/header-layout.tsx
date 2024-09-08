import React, {ReactElement} from 'react'
import {Header} from '../wrapper/header'
import clsx from 'clsx'
import {lgTransparent} from '../utils/transparent'

export function HeaderLayout({children}: { children: ReactElement }) {
  return (
    <>
      <div className={clsx(
        lgTransparent,
        "flex flex-col h-full dark:text-zinc-400 border-0"
      )}>
        <Header></Header>
        <div className={clsx(
          "h-full w-full flex flex-row px-2 my-1 py-1 overflow-scroll",
        )}>
          {children}
        </div>
      </div>
    </>
  )
}
