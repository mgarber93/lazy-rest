import React from 'react'
import clsx from 'clsx'

import {HeaderLayout} from '../layouts/header-layout'
import {OpenAiForm} from '../wrapper/open-ai-form'
import {CardH2} from '../wrapper/card'
import {OllamaForm} from '../wrapper/ollama-form'
import {BedrockForm} from '../wrapper/bedrock-form'

export function SettingsPage() {
  const card = "bg-white mx-2 dark:bg-neutral-900 rounded-lg shadow-lg"
  return (
    <HeaderLayout
      classList={clsx("flex-1 w-screen flex flex-col gap-4 bg-neutral-100 dark:bg-neutral-800")}>
      <div className={clsx("pt-2 pb-4")}>
        <div className={clsx("p-4 mb-4", card)}>
          <CardH2>Ollama</CardH2>
          <OllamaForm/>
        </div>
        
        <div className={clsx("p-4 mb-4", card)}>
          <CardH2>Open AI</CardH2>
          <OpenAiForm/>
        </div>
        
        <div className={clsx("p-4", card)}>
          <CardH2>BedRock</CardH2>
          <BedrockForm/>
        </div>
      </div>
    </HeaderLayout>
  )
}
