import React, {ReactElement} from 'react'
import clsx from 'clsx'
import {Header} from '../wrapper/header'
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
          lgTransparent,
          "h-full w-full flex flex-row px-2 my-1 py-1 overflow-scroll",
        )}>
          {children}
        </div>
      </div>
    </>
  )
}
