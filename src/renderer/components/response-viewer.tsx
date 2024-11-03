import React from 'react'
import {Editor} from '@monaco-editor/react'
import clsx from 'clsx'

export function ResponseViewer({response}: { response: { data: object } | null }) {
  const code = response ? JSON.stringify(response.data, null, 2) : '// Send to get response'
  
  return <div className="h-full min-h-10 flex flex-col ">
    <Editor
      language="json"
      height="100%"
      width="100%"
      className={clsx("h-full", response?.data ? "min-h-80" : "min-h-10")}
      options={{readOnly: true, automaticLayout: true}
      }
      value={code}
      theme={window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "vs-dark" : "light"}
    />
  </div>
}
