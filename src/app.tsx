import "reflect-metadata"
import {createRoot} from 'react-dom/client'
import React from 'react'
import {createHashRouter, RouterProvider} from 'react-router-dom'
import {Provider} from 'react-redux'

import {store} from './renderer/features/store'
import {ConversationsPage} from './renderer/pages/conversations-page'
import {connectCallbacks} from './connect-callbacks'

connectCallbacks(store)

const container = document.getElementById('root')
if (!container) {
  throw new Error('cannot find root container in document')
}
const root = createRoot(container)
const router = createHashRouter([
  {
    path: "*",
    element: <ConversationsPage/>,
  },
])

const App = () => (
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)

root.render(<React.StrictMode><App/></React.StrictMode>)
