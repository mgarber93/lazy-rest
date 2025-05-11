import React, {useState} from 'react'
import {CloudIcon, CubeIcon, ServerIcon} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {TProvider} from '../../models/responder'

interface ProviderOption {
  id: TProvider;
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface ProviderSelectorProps {
  selectedProvider: TProvider;
  onProviderChange: (provider: TProvider) => void;
}

export function ProviderSelector({selectedProvider, onProviderChange}: ProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const providers: ProviderOption[] = [
    {
      id: 'ollama',
      icon: <CubeIcon className="h-5 w-5"/>,
      label: 'Ollama',
      color: 'text-green-500 dark:text-green-400',
    },
    {
      id: 'bedrock',
      icon: <ServerIcon className="h-5 w-5"/>,
      label: 'Bedrock',
      color: 'text-yellow-500 dark:text-yellow-400',
    },
    {
      id: 'openai',
      icon: <CloudIcon className="h-5 w-5"/>,
      label: 'OpenAI',
      color: 'text-blue-500 dark:text-blue-400',
    },
  ]
  
  const selectedProviderOption = providers.find(p => p.id === selectedProvider) || providers[0]
  
  const handleProviderClick = () => {
    setIsOpen(!isOpen)
  }
  
  const handleProviderSelect = (provider: TProvider) => {
    onProviderChange(provider)
    setIsOpen(false)
  }
  
  return (
    <div className="relative">
      {/* Active provider icon */}
      <button
        className={clsx(
          "flex items-center justify-center p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700",
          selectedProviderOption.color,
        )}
        onClick={handleProviderClick}
        title={selectedProviderOption.label}
      >
        {selectedProviderOption.icon}
      </button>
      
      {/* Provider dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1 z-10 bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-600">
          <div className="py-1">
            {providers.map((provider) => (
              <button
                key={provider.id}
                className={clsx(
                  "w-full flex items-center px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700",
                  provider.id === selectedProvider ? provider.color : "text-neutral-700 dark:text-neutral-200",
                )}
                onClick={() => handleProviderSelect(provider.id)}
              >
                <span className="mr-2">{provider.icon}</span>
                <span>{provider.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
