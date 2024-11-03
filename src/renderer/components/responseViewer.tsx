import React from 'react'
import {Editor} from '@monaco-editor/react'


export function ResponseViewer({response}: { response: { data: object } | null }) {
  return <Editor
    height="100%" defaultLanguage="javascript" defaultValue={JSON.stringify(response?.data, null, 2)}
    options={{readOnly: true}}
  />
}
