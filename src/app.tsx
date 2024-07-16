import "reflect-metadata"
import {createRoot} from 'react-dom/client'
import React from 'react'
import {createHashRouter, RouterProvider} from 'react-router-dom'
import {Provider} from 'react-redux'

import ConversationPage from './renderer/pages/conversations'
import {store} from './renderer/features/store'
import {Home} from './renderer/pages/home'
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
    element: <Home/>,
  },
  {
    path: "/conversations",
    element: <ConversationPage/>,
  },
])

const App = () => (
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)

root.render(<React.StrictMode><App/></React.StrictMode>)