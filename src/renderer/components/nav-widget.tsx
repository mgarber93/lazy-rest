import React, {ReactElement} from "react"
import {NavLink} from "react-router-dom"
import clsx from "clsx"


export function NavWidget({children, to, className}: {
  children: ReactElement,
  to: string,
  className?: string
}) {
  const classes = `flex rounded no-drag items-center pl-[0.5rem] pr-[0.25rem] h-8 text-xs font-semibold`
  const border = `border border-transparent`
  return (
    <NavLink
      to={to}
      tabIndex={-1}
      className={
        ({isActive}) => clsx(
          classes,
          border,
          isActive && clsx(
            `bg-black dark:border-neutral-700`,
            "bg-white hover:bg-white dark:bg-neutral-800 hover:dark:bg-neutral-800 dark:text-white",
          ),
          !isActive && clsx("bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:bg-neutral-900"),
          className,
        )}>
      {children}
    </NavLink>
  )
}
