import {HeaderLayout} from '../layouts/header-layout'
import clsx from 'clsx'
import {CardH2, CardSection} from '../wrapper/card'
import {useAppSelector} from '../features/store'
import {ApiForm} from '../wrapper/api-form'


export function ServersPage() {
  const apis = useAppSelector(state => state.tools.api)
  const card = "bg-white dark:bg-neutral-900 rounded-lg shadow-lg"
  
  return (
    <HeaderLayout classList={clsx("w-full min-h-full p-2 flex flex-col gap-4 overflow-scroll", "bg-neutral-100 dark:bg-neutral-800")}>
      <>
        <div className={clsx("min-h-[20rem] p-4", card)}>
          <CardH2>Api Specifications</CardH2>
          {Object.keys(apis).length > 0 && <CardSection>
            <div className={"flex flex-col"}>
              {
                Object.keys(apis).map((key) => <div className={"my-4"} key={key}>{apis[key].name}</div>)
              }
            </div>
          </CardSection>
          }
        </div>
        
        <div className={clsx("min-h-[20rem] p-4", card)}>
          <CardH2>Add new api</CardH2>
          <ApiForm/>
        </div>
      </>
    </HeaderLayout>
  )
}
