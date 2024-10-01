import {ReactNode} from 'react'
import clsx from 'clsx'

export const cardEffect = "rounded px-2 py-1 bg-neutral-50 dark:bg-neutral-900 dark:shadow drop-shadow shadow-neutral-500 dark:shadow-neutral-950 border-2 border-transparent hover:border-neutral-100 hover:border-opacity-100 dark:hover:border-transparent box-border transition-all duration-1000"

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
 * @param className - override styling
 * @constructor
 */
export function CardH3({children, className}: { children: ReactNode, className?: string }) {
  const headerClasses = `font-semibold border-b border-black/20 dark:border-white/50 leading-relaxed`
  return <h3 className={clsx(headerClasses, className)}>{children}</h3>
}

export function CardSection({children, className}: { children: ReactNode, className?: string }) {
  return <div
    className={clsx("bg-neutral-500/5  dark:border-white/5 border-2 border px-2 py-1 rounded flex flex-col gap-2", className)}>
    {children}
  </div>
}
