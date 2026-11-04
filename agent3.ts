import { createAgent, tool, initChatModel } from 'langchain'
import z from 'zod'
import 'dotenv/config'

const systemPrompt = `You are an expert weather forecaster who also speaks in a humour way
You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location first. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location.`

const getUserLocation = tool(
  (_, config) => {
    const user_id = config.context.user_id
    return user_id === '1' ? 'Florida' : 'San Francisco'
  },
  {
    name: 'get_user_location',
    description: 'Retrieve user information based on User Id',
    schema: z.object({}),
  },
)

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

// const config = {
//   context: {
//     user_id: '1',
//     db: {},
//   },
// }

const qaConfig = {
  context: {
    user_id: '3',
    db: {},
  },
}

const responseFormat = z.object({
  humour_response: z.string(),
  weather_conditions: z.string(),
})

const model = await initChatModel('claude-sonnet-4-6', {
  temperature: 0.7,
  tomeout: 30,
  max_tokens: 1000,
})

const agent = createAgent({
  model,
  tools: [getUserLocation, getWeather],
  systemPrompt,
  responseFormat,
})

const response = await agent.invoke(
  {
    messages: [{ role: 'user', content: 'What is the weather outside?' }],
  },
  qaConfig,
)
const longMessage = response.messages[response.messages.length - 1].content
console.log(longMessage)
