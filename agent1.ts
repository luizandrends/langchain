import { createAgent, tool } from 'langchain'
import z from 'zod'
import 'dotenv/config'

const getWeather = tool(
  (input) => {
    return `It's sunny in ${input.city}`
  },
  {
    name: 'get_weather',
    description: 'Get the weather for a given city',
    schema: z.object({
      city: z.string(),
    }),
  },
)

const getTime = tool(
  (input) => {
    return `The current time in ${input.city} is 3:00PM`
  },
  {
    name: 'get_time',
    description: 'Get the time for a given city',
    schema: z.object({
      city: z.string(),
    }),
  },
)

const agent = createAgent({
  model: 'claude-sonnet-4-6',
  tools: [getWeather, getTime],
})

const response = await agent.invoke({
  // messages: [{role: "user", content: "how is the weather and time in New York?"}]
  // messages: [{role: "user", content: "how is the time in New York?"}]
  messages: [{ role: 'user', content: 'How is the time & weather in NY?' }],
})

console.log(response)
// const longMessage = response.messages[response.messages.length-1].content
// console.log(longMessage)
