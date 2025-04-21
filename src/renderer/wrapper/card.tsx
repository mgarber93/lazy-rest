import {ReactNode} from 'react'
import clsx from 'clsx'

export const cardEffect = "bg-neutral-50 dark:bg-neutral-900 drop-shadow border-2 border-transparent hover:border-neutral-100 hover:border-opacity-100 dark:hover:border-transparent box-border transition-all duration-1000"


/**
 * Used once in a card
 * @param children
 * @param className
 * @constructor
 */
export function CardH2({children, className}: { children: ReactNode, className?: string }) {
  const headerClasses = `font-semibold text-2xl border-b border-black/50 dark:border-white/15 leading-relaxed`
  return <h2 className={clsx(headerClasses, className)}>{children}</h2>
}


export function CardSection({children, className}: { children: ReactNode, className?: string }) {
  return <div
    className={clsx("bg-neutral-050 dark:bg-neutral-900 border-2 px-2 py-1 rounded-lg flex flex-col gap-2", className)}>
    {children}
  </div>
}
