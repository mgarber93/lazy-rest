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
        <Header></Header>
        <div className={clsx(
          "bg-[linear-gradient(115deg,var(--tw-gradient-stops))] from-[#eee] from-[28%] via-[#eee] via-[70%]",
          "bg-[linear-gradient(105deg,var(--tw-gradient-stops))] dark:from-[#000] from-[88%] dark:via-[#000a] via-[98%] dark:to-[#0004]",
          "w-full",
        )}>
          {children}
        </div>
      </div>
    </>
  )
}
