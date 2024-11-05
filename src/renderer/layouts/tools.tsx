import React from "react"
import { classNames } from "../utils/classNames"

const tools = [
  { id: 1, name: "Spotify", href: "#", initial: "S", current: false },
  { id: 2, name: "Weather", href: "#", initial: "W", current: false }
]
export const Tools: React.FC = () => {
  return (
    <>
      <ul role="list" className="-mx-2 mt-2 space-y-1">
        {tools.map((team) => (
          <li key={team.name}>
            <a
              href={team.href}
              className={classNames(
                team.current
                  ? "bg-neutral-50 text-neutral-600"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-950",
                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
              )}
            >
              <span
                className={classNames(
                  team.current
                    ? "border-neutral-600 text-neutral-600"
                    : "border-neutral-200 text-neutral-400 group-hover:border-neutral-600 group-hover:text-neutral-600",
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded border bg-white dark:bg-black text-[0.625rem] font-medium"
                )}
              >
                {team.initial}
              </span>
              <span className="truncate">{team.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
