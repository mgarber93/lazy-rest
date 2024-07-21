import React from 'react'
import {useAppSelector} from '../features/store'
import {ApiConfiguration} from '../../models/api-configuration'
import SidebarMainLayout from '../layouts/sidebar-main-layout'
import {SendMessage} from '../components/send-message'


export function ConversationsPage() {
  const tools = useAppSelector(state => state.tools) as { api: Record<string, ApiConfiguration> }
  return (
    <SidebarMainLayout>
      <div
        className="h-full flex flex-col justify-end  p-4 divide-y divide-gray-200">
        <SendMessage/>
      </div>
    </SidebarMainLayout>
  )
}
