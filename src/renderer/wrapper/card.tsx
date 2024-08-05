import {ReactNode} from 'react'


export function Card(props: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded bg-white dark:bg-zinc-950 border-zinc-800 shadow h-full w-full">
      <div className="px-4 py-5 sm:p-6">{props.children}</div>
    </div>
  )
}
