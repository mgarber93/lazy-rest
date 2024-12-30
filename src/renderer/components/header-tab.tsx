import clsx from "clsx"
import {ReactElement} from "react"
import {NavLink} from "react-router-dom"

export function HeaderTab({children, to, className}: {
  children: ReactElement,
  to: string,
  className?: string,
}) {
  const classes = `flex rounded no-drag h-full items-center min-h-[1rem] text-xs font-semibold`
  const borderActive = `!border-neutral-800 dark:border-neutral-700`
  const border = `border border-transparent border-[0.5px]`
  return (
    <NavLink
      to={to}
      tabIndex={-1}
      className={
        ({isActive}) => clsx(
          classes,
          border,
          isActive && clsx(
            borderActive,
            "bg-white hover:bg-white dark:bg-neutral-800 hover:dark:bg-neutral-800 dark:text-white",
          ),
          !isActive && clsx("bg-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:bg-neutral-900"),
          className,
        )}>
      {children}
    </NavLink>
  )
}
