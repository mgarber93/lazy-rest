import React, {ReactElement} from 'react'
import {Header} from '../wrapper/header'

export function HeaderLayout({children}: { children: ReactElement }) {
  return (
    <>
      <div className={"flex flex-col h-full"}>
        <Header></Header>
        <div className={"h-full w-full flex flex-row p-4 drop-shadow-2xl bg-zinc-50 dark:bg-zinc-800"}>
          {children}
        </div>
      </div>
    </>
  )
}
