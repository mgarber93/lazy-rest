import React from 'react'
import SidebarMainLayout from '../layouts/sidebar-main-layout'
import {SendMessage} from '../components/send-message'


export function ConversationsPage() {
  return (
    <SidebarMainLayout>
      <div
        className="h-full flex flex-col justify-end  p-4 divide-y divide-gray-200">
        <SendMessage/>
      </div>
    </SidebarMainLayout>
  )
}
