import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import clsx from "clsx"
import { HttpRequestPlan } from "../../models/api-call-plan"
import { KeyValueForm } from "./key-value-form"

export function HttpCallDetailComponent({
  step,
}: {
  step?: Partial<HttpRequestPlan>
}) {
  const tabs = [
    {
      name: "Params",
    },
    // {
    //   name: 'Auth',
    // },
    {
      name: "Headers",
    },
    {
      name: "Body",
    },
    // {
    //   name: 'Responses',
    // },
  ]
  return (
    <TabGroup
      className={
        "flex w-full flex-col bg-white/25 dark:bg-transparent rounded mb-1"
      }
    >
      <TabList className="flex gap-4 content-around rounded-t w-full justify-center py-1 border-b border-black/15 dark:border-white/25">
        {tabs.map(({ name }) => (
          <Tab
            key={name}
            className={clsx(
              "rounded-xl py-1 px-3 text-sm/6 font-semibold border border-transparent dark:text-neutral-400",
              "bg-black/5 data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10",
              "focus:outline-none data-[selected]:border data-[selected]:dark:bg-black/25 ",
              "data-[selected]:dark:border-white/1",
              "data-[hover]:dark:bg-black/50 data-[selected]:data-[hover]:dark:bg-black/50",
              "data-[focus]:outline-1 data-[focus]:dark:outline-white data-[selected]:text-neutral-200",
            )}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="">
        <TabPanel key={"Params"} className="rounded p-3">
          <KeyValueForm data={step?.queryParams ?? {}} />
        </TabPanel>
        <TabPanel key={"Headers"} className="rounded p-3">
          <KeyValueForm data={step?.headers ?? {}} />
        </TabPanel>
        <TabPanel key={"Body"} className="rounded p-3">
          <KeyValueForm data={step?.body ?? {}} />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  )
}
