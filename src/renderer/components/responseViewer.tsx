import React from 'react'
import {Editor} from '@monaco-editor/react'
import clsx from 'clsx'

// In your React component or renderer entry point
(window as any).MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: string, label: string) {
    if (label === 'json') return './worker/json.worker.js'
    if (label === 'css') return './worker/css.worker.js'
    if (label === 'html') return './worker/html.worker.js'
    if (label === 'typescript' || label === 'javascript')
      return './worker/ts.worker.js'
    return './worker/editor.worker.js'
  },
}

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
      theme="vs-dark"
    />
  </div>
}
