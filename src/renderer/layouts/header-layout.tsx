import React, {ReactElement} from 'react'
import clsx from 'clsx'
import {Header} from '../wrapper/header'
import {bodyTransparencyEffect, lgTransparent} from '../utils/transparent'

export function HeaderLayout({children}: { children: ReactElement }) {
  return (
    <>
      <div className={clsx(
        lgTransparent,
        "flex flex-col dark:text-neutral-50 border-0",
      )}>
        <Header></Header>
        <div className={clsx(
          bodyTransparencyEffect,
          "w-full p-1",
        )}>
          {children}
        </div>
      </div>
    </>
  )
}
