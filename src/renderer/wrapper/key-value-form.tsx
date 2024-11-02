import {useCallback, useEffect, useState} from 'react'
import clsx from 'clsx'
import {Input} from '@headlessui/react'
import {MinusCircleIcon, PlusCircleIcon} from '@heroicons/react/24/outline'

const elements = `border rounded bg-transparent border-neutral-700 dark:bg-neutral-950/5`

export const inputClass = clsx(
  elements,
  'flex-grow py-1.5 px-3 text-sm/6 dark:text-white',
  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
)

export type KeyValueFormProps<T> = {
  data: T;
  onChange?: (data: T) => void;
}

export function KeyValueForm<T extends Record<string, any>>({data, onChange}: KeyValueFormProps<T>) {
  const [dataAsRows, setDataAsRows] = useState(Object.entries(data))
  useEffect(() => {
    setDataAsRows(Object.entries(data))
  }, [data])
  Object.entries(data ?? {})
  const handleChange = useCallback((index: number, key: keyof T, value: T[keyof T]) => {
    if (data) {
      const newData = {...data} as T
      const entries = Object.entries(newData) as [keyof T, T[keyof T]][]
      if (entries[index]) {
        const [oldKey] = entries[index]
        delete newData[oldKey]
        newData[key as keyof T] = value
      }
      
      onChange?.(newData)
    }
  }, [dataAsRows])
  
  const handleRowRemove = useCallback((index: number) => {
    setDataAsRows((prevRows) => prevRows.filter((_, i) => i !== index))
  }, [])
  
  const handleRowAdd = useCallback(() => {
    setDataAsRows((prevRows) => [...prevRows, ['', '']])
  }, [])
  return <div className={clsx("flex flex-col gap-y-1")}>
    {
      dataAsRows
        .map((entry, index) => (
          <div className={"flex flex-row gap-x-1"} key={index}>
            <Input
              className={inputClass}
              placeholder="Key"
              defaultValue={entry[0]}
              onBlur={(e) => handleChange(index, e.target.value as keyof T, entry[1] as T[keyof T])}
            />
            <Input
              className={inputClass}
              placeholder="Value"
              defaultValue={entry[1]}
              onBlur={(e) => handleChange(index, entry[0] as keyof T, e.target.value as T[keyof T])}
            />
            <div className={"flex flex-col justify-center"}>
              <MinusCircleIcon className={clsx("h-7 w-7 cursor-pointer")} onClick={() => handleRowRemove(index)}/>
            </div>
          </div>))
    }
    <div
      className={"flex flex-col justify-center w-full rounded hover:bg-black/5 border border-transparent hover:border-black/15 dark:hover:bg-white/15 hover:opacity-30 transition pl-2"}
      onClick={handleRowAdd}
    >
      <PlusCircleIcon className={clsx("h-7 w-7 ml-auto cursor-pointer mr-[-1px] opacity-70")}/>
    </div>
  </div>
}
