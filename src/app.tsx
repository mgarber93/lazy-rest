import "reflect-metadata"
import {createRoot} from 'react-dom/client'
import React from 'react'
import {createHashRouter, Navigate, RouterProvider} from 'react-router-dom'
import {Provider} from 'react-redux'
import {Toaster} from 'sonner'
import "@fontsource/poppins"
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/400-italic.css"

import {store} from './renderer/features/store'
import {ConversationsPage} from './renderer/pages/conversations-page'
import {connectCallbacks} from './connect-callbacks'
import {SettingsPage} from './renderer/pages/settings-page'
import {ServersPage} from './renderer/pages/servers-page'

connectCallbacks(store)

const container = document.getElementById('root')
if (!container) {
  throw new Error('cannot find root container in document')
}
const root = createRoot(container)
const router = createHashRouter([
  {
    path: "config",
    element: <SettingsPage/>,
  },
  {
    path: "servers",
    element: <ServersPage/>
  },
  {
    path: "chats/:chatId",
    element: <ConversationsPage/>,
  },
  {
    path: "*",
    element: <Navigate to="config" replace />,
  },
])

const App = () => (
  <Provider store={store}>
    <Toaster position="bottom-right" />
    <RouterProvider router={router}/>
  </Provider>
)

root.render(<React.StrictMode><App/></React.StrictMode>)
