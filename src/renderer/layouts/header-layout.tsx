import React, {ReactElement} from 'react'
import {Header} from '../wrapper/header'
import clsx from 'clsx'
import {lgTransparent} from '../utils/transparent'

export function HeaderLayout({children}: { children: ReactElement }) {
  return (
    <>
      <div className={
        "flex flex-col h-full dark:text-zinc-400"
      }>
        <Header></Header>
        <div className={clsx(
          lgTransparent,
          "h-full w-full flex flex-row p-2 dark:dark:bg-zinc-950 overflow-scroll drop-shadow",
        )}>
          {children}
        </div>
      </div>
    </>
  )
}
