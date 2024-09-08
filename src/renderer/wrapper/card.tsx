import {ReactNode} from 'react'
import {cardEffect} from '../utils/card'
import clsx from 'clsx'


export function Card(props: { children: ReactNode }) {
  return (
    <div className={clsx(cardEffect)}>
      {props.children}
    </div>
  )
}
