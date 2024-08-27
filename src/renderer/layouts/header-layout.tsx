import React, {ReactElement} from 'react'
import {Header} from '../wrapper/header'

export function HeaderLayout({children}: { children: ReactElement }) {
  return (
    <>
      <div className={"flex flex-col h-full"}>
        <Header></Header>
        <div className={"h-full w-full flex flex-row p-4 drop-shadow-2xl bg-white dark:bg-zinc-700"}>
          {children}
        </div>
      </div>
    </>
  )
}
