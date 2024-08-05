import React, {ReactElement} from 'react'
import {Sidebar} from './sidebar-main-layout'

export function ThreeColumnLayout({main, aside}: { main: ReactElement, aside: ReactElement }) {
  return (
    <>
      <div className={"flex flex-col h-full"}>
        <header className="w-full h-10 bg-zinc-200 dark:bg-black opacity-dynamic drag top-0 z-60">
        </header>
        
        <div className={"h-full flex flex-row "}>
          <Sidebar/>
          
          <main className={"h-full w-full flex flex-row drop-shadow-2xl max-w-64"}>
            {React.cloneElement(main)}
          </main>
          
          <aside
            className="h-full w-full flex flex-row drop-shadow-2xl grow">
            {React.cloneElement(aside)}
          </aside>
        </div>
      </div>
    </>
  )
}
