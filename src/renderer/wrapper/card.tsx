import {ReactNode} from 'react'
import clsx from 'clsx'
import {Button, Input, Select} from '@headlessui/react'

export const cardEffect = "rounded-xl px-4 py-2 bg-zinc-50 dark:bg-zinc-800 dark:shadow drop-shadow mb-2 shadow-zinc-300 dark:shadow-zinc-950 border-2 border-transparent hover:border-zinc-100 hover:border-opacity-100 dark:hover:border-transparent box-border transition-all duration-1000"

export function Card({children, className}: { children: ReactNode, className?: string }) {
  const layout = 'flex flex-col gap-4'
  return (
    <div className={clsx(cardEffect, layout, className)}>
      {children}
    </div>
  )
}

/**
 * Used once in a card
 * @param children
 * @constructor
 */
export function CardH2({children}: { children: ReactNode }) {
  const headerClasses = `font-semibold text-2xl border-b border-black/50 dark:border-white/50 leading-relaxed`
  return <h2 className={headerClasses}>{children}</h2>
}

/**
 * Separates sections of a card
 * @param children
 * @constructor
 */
export function CardH3({children}: { children: ReactNode }) {
  const headerClasses = `font-semibold border-b border-black/20 dark:border-white/50 leading-relaxed`
  return <h3 className={headerClasses}>{children}</h3>
}

export function CardSection({children}: { children: ReactNode }) {
  return <div className={"bg-zinc-500/5 p-2 rounded-xl flex flex-col gap-2"}>
    {children}
  </div>
}


export function HttpCallCard() {
  const elements = `border rounded-xl bg-black/15 border-zinc-700`
  return <div className={"p-4 flex flex-row gap-2"}>
    <Select name="status"
            className={clsx(elements, "h-full bg-transparent data-[hover]:shadow data-[focus]:bg-blue-100")}
            aria-label="Project status">
      <option value="get">Get</option>
      <option value="post">Post</option>
      <option value="put">Put</option>
      <option value="delete">Delete</option>
    </Select>
    <Input
      className={clsx(
        elements,
        'flex-grow py-1.5 px-3 text-sm/6 text-white',
        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
      )}
    />
    <Button className={clsx(elements, "px-2 border-zinc-500")}
            onClick={() => console.log('hello world')}>Send</Button>
  </div>
}
