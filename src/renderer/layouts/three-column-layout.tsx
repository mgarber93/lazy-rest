import React, {ReactElement} from 'react'
import {Cog6ToothIcon} from '@heroicons/react/24/outline'

export function Header() {
  return <header className="w-full h-10 bg-zinc-200 dark:bg-black opacity-dynamic drag top-0 z-60 flex flex-row">
    <ul className="h-full ml-[6rem] flex items-center">
      <li className="pt-2 pb-2 pr-4 w-5 h-5 flex items-center justify-center">
        <a
          href="#"
          className="group flex rounded-md text-sm font-semibold leading-6 text-zinc-600"
        >
          <Cog6ToothIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem]"/>
        </a>
      </li>
      <li className="h-full w-0 flex items-center">
        <div className="h-full border-l border-gray-400 dark:border-gray-600"></div>
      </li>
    </ul>
  </header>
}

export function ThreeColumnLayout({main, aside}: { main: ReactElement, aside: ReactElement }) {
  return (
    <>
      <div className={"flex flex-col h-full"}>
        <Header></Header>

      </div>
    </>
  )
}
