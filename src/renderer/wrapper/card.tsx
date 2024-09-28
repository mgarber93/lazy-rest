import {ReactNode} from 'react'
import clsx from 'clsx'

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


