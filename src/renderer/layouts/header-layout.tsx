import React, { ReactElement } from "react"
import clsx from "clsx"
import { Header } from "../wrapper/header"

export function HeaderLayout({ children }: { children: ReactElement }) {
  return (
    <>
      <div
        className={clsx(
          "flex flex-col h-full dark:text-neutral-50 border-0",
        )}
      >
        <Header></Header>
        <div
          className={clsx(
            "h-full w-full dark:bg-neutral-950 p-1 overflow-scroll",
          )}
        >
          {children}
        </div>
      </div>
    </>
  )
}
