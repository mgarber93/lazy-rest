import {ReactNode} from 'react'


export function Card(props: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white dark:bg-black shadow">
      <div className="px-4 py-5 sm:p-6">{props.children}</div>
    </div>
  )
}
