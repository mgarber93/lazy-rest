import {AuthoredContent} from '../../models/content'
import {FeedContent} from './feed-content'
import clsx from 'clsx'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React, {useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'

const getThinkContent = (text: string): string[] => {
  const regex = /<think>([\s\S]*?)<\/think>/g
  const matches: string[] = []
  let match
    
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1])
  }
    
  return matches
}

export function ConversationContent({content, chatId}: { content: AuthoredContent, chatId: string }) {
  const [expandedThoughts, setExpandedThoughts] = useState<Record<number, boolean>>({})

  const toggleThought = (index: number) => {
    setExpandedThoughts(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  if (content.apiCallPlan) {
    return <FeedContent contentId={content.id} apiCallPlan={content.apiCallPlan} chatId={chatId}/>
  } else {
    return <div
      className={clsx(
        'leading-relaxed text-xl flex flex-col py-1 transition duration-300 dark:border-white/50 rounded-xl',
        content.role === "user" && "ml-auto w-fit",
      )}
    >
      {
        content.role === "user" &&
        <span
          className={clsx('flex-1 text-right flex ml-auto dark:text-neutral-300 lg:pt-16')}
          key={content.id}
        >
          <Markdown remarkPlugins={[remarkGfm]}>{content.message}</Markdown>
        </span>
      }
      {
        content.role !== "user" && <motion.div>
          {getThinkContent(content.message).map((thinkContent, index) => (
            <div key={index} className="overflow-hidden">
              <motion.div
                className="text-gray-400 text-sm italic mb-2 cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() => toggleThought(index)}
              >
                <AnimatePresence mode="wait">
                  {expandedThoughts[index] ? (
                    <motion.div
                      key="expanded"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Thinking: {thinkContent}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="collapsed"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Thought about it
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ))}
          <span
            className={clsx('flex-1')}
            key={content.id}
          >
            <Markdown remarkPlugins={[remarkGfm]}>
              {content.message.replace(/<think>[\s\S]*?<\/think>/g, '')}
            </Markdown>
          </span>
        </motion.div>
      }
    </div>
  }
}
