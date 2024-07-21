import React from 'react'
import {Card} from '../wrapper/card'
import {useAppSelector} from '../features/store'
import {ApiConfiguration} from '../../models/api-configuration'
import SidebarMainLayout from '../layouts/sidebar-main-layout'

export function ApiToolPreview({api}: { api: ApiConfiguration }) {
  return <Card>
    <div className="d-flex flex-column gap-3">
      <div>{api.name}</div>
      <div>{api.baseUrl}</div>
    </div>
  </Card>
}

export function Home() {
  const tools = useAppSelector(state => state.tools) as { api: Record<string, ApiConfiguration> }
  return (
    <SidebarMainLayout>
      <div
        className={"sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white dark:bg-black px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"}>
      </div>
    </SidebarMainLayout>
  )
}
