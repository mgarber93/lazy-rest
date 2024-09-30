import {Input, Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react'
import clsx from 'clsx'
import {MinusCircleIcon, PlusCircleIcon} from '@heroicons/react/24/outline'
import {HttpRequestPlan} from '../../models/api-call-plan'

const elements = `border rounded-xl bg-transparent border-neutral-700`
const inputClass = clsx(
  elements,
  'flex-grow py-1.5 px-3 text-sm/6 dark:text-white',
  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
)

export function QueryParameterForm({step}: { step?: Partial<HttpRequestPlan> }) {
  return <div className={clsx("flex flex-col gap-y-1")}>
    {
      Object.entries(step?.queryParams ?? {}).map((entry, index) => (
        <div className={"flex flex-row gap-x-1"} key={index}>
          <Input
            className={inputClass}
            placeholder="Key"
            defaultValue={entry[0]}
          />
          <Input
            className={inputClass}
            placeholder="Value"
            defaultValue={entry[1]}
          />
          <div className={"flex flex-col justify-center"}>
            <MinusCircleIcon className={clsx("h-7 w-7 cursor-pointer")}/>
          </div>
        </div>))
    }
    <div
      className={"flex flex-col justify-center w-full rounded-xl hover:bg-black/5 border border-transparent hover:border-black/15 transition pl-2"}>
      <PlusCircleIcon className={clsx("h-7 w-7 ml-auto cursor-pointer mr-[-1px]")}/>
    </div>
  </div>
}

export function HttpCallDetailComponent({step}: { step?: Partial<HttpRequestPlan> }) {
  const tabs = [
    {
      name: 'Params',
    },
    {
      name: 'Auth',
    },
    {
      name: 'Headers',
    },
    {
      name: 'Body',
    },
    {
      name: 'Responses',
    },
  ]
  return (
    <TabGroup className={"flex w-full flex-col bg-white/25 dark:bg-black/25 rounded-3xl mb-1 mt-2"}>
      <TabList
        className="flex gap-4 content-around rounded-t w-full justify-center py-1 border-b border-black/15 dark:border-white/25">
        {tabs.map(({name}) => (
          <Tab
            key={name}
            className={clsx(
              "rounded-full py-1 px-3 text-sm/6 font-semibold",
              "bg-black/5 data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10",
              "focus:outline-none data-[selected]:dark:bg-white/10 data-[hover]:dark:bg-white/5 data-[selected]:data-[hover]:dark:bg-white/10 data-[focus]:outline-1 data-[focus]:dark:outline-white",
            )}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="">
        <TabPanel key={'Params'} className="bg-white/5 dark:bg-black/5 rounded-xl p-3">
          <QueryParameterForm step={step}/>
        </TabPanel>
        <TabPanel key={'Auth'} className="bg-white/5 dark:bg-black/5 rounded-xl p-3">
          Auth
        </TabPanel>
        <TabPanel key={'Headers'} className="bg-white/5 dark:bg-black/5 rounded-xl p-3">
          Headers
        </TabPanel>
        <TabPanel key={'Body'} className="bg-white/5 dark:bg-black/5 rounded-xl p-3">
          Body
        </TabPanel>
        <TabPanel key={'Responses'} className="bg-white/5 dark:bg-black/5 rounded-xl p-3">
          Body
        </TabPanel>
      </TabPanels>
    </TabGroup>
  )
}
