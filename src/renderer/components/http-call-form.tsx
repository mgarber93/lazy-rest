import clsx from 'clsx'
import {Input, Select} from '@headlessui/react'
import {AppButton} from './app-button'
import React from 'react'
import {ActivityItem} from './feed-content'
import {HttpCallDetailComponent} from '../wrapper/http-call-detail-component'

const elements = `border rounded-xl bg-transparent border-neutral-700`
const inputClass = clsx(
  elements,
  'flex-grow py-1.5 px-3 text-sm/6 dark:text-white',
  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
)

export function HttpCallForm({step}: { step?: ActivityItem['step'] }) {
  const elements = `border rounded-xl bg-transparent border-neutral-700`
  return <div className={clsx('flex flex-col gap-1')}>
    <div className={"flex flex-row gap-2"}>
      <Select
        name="status"
        className={clsx(elements, "h-full bg-transparent data-[hover]:shadow data-[focus]:bg-black-100")}
        aria-label="Project status"
        defaultValue={step?.httpVerb?.toLowerCase()}>
        <option value="get">Get</option>
        <option value="post">Post</option>
        <option value="put">Put</option>
        <option value="delete">Delete</option>
      </Select>
      <Input
        className={inputClass}
        defaultValue={step?.url}
      />
      <AppButton className={clsx(elements, "px-2 border-neutral-500")}
                 onClick={() => console.log(step)}>Send</AppButton>
    </div>
    <HttpCallDetailComponent step={step}/>
  </div>
}
