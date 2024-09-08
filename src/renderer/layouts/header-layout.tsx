import React, {ReactElement} from 'react'
import {Header} from '../wrapper/header'

export function HeaderLayout({children}: { children: ReactElement }) {
  return (
    <>
      <div className={"flex flex-col h-full dark:text-zinc-400"}>
        <Header></Header>
        <div className={"h-full w-full flex flex-row p-4 bg-zinc-50 dark:dark:bg-zinc-950 overflow-scroll"}>
          {children}
        </div>
      </div>
    </>
  )
}
