import {ReactNode} from 'react'
import {cardEffect} from '../utils/card'
import clsx from 'clsx'


export function Card({children, className}: { children: ReactNode, className?: string }) {
  return (
    <div className={clsx(cardEffect, className)}>
      {children}
    </div>
  )
}
