import React, { useEffect, useState } from "react"
import { Editor } from "@monaco-editor/react"
import clsx from "clsx"

export function ResponseViewer({
                                 response
                               }: {
  response: { data: object } | null
}) {
  const code = response
    ? JSON.stringify(response.data, null, 2)
    : "// Send to get response"
  const [theme, setTheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "vs-dark"
      : "light"
  )
  // const monaco = useMonaco()
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const colorSchemeChangeHandler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "vs-dark" : "light")
    }
    mediaQuery.addEventListener("change", colorSchemeChangeHandler)

    return () => {
      mediaQuery.removeEventListener("change", colorSchemeChangeHandler)
    }
  }, [setTheme])

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (!monaco) return
  //     // Add logic to deselect in Monaco Editor
  //     const editorInstance = monaco.editor.getModels()[0]
  //     if (editorInstance) {
  //       editorInstance.modifyPosition(new monaco.Position(0, 0), 0)
  //     }
  //   }
  //
  //   document.addEventListener('click', handleClickOutside)
  //
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside)
  //   }
  // }, [monaco])
  return (
    <div className="h-full min-h-10 flex flex-col ">
      <Editor
        language="json"
        height="100%"
        width="100%"
        className={clsx("h-full", response?.data ? "min-h-80" : "min-h-10")}
        options={{ readOnly: true, automaticLayout: true }}
        value={code}
        theme={theme}
      />
    </div>
  )
}
