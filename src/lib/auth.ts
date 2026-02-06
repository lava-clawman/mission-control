import { createClient } from '@supabase/supabase-js'
import { Agent } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function validateApiKey(apiKey: string): Promise<Agent | null> {
  if (!apiKey) return null

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('api_key', apiKey)
    .single()

  if (error || !data) return null

  return data as Agent
}

export async function requireAuth(request: Request): Promise<Agent> {
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey) {
    throw new Response('Missing x-api-key header', { status: 401 })
  }

  const agent = await validateApiKey(apiKey)
  
  if (!agent) {
    throw new Response('Invalid API key', { status: 401 })
  }

  return agent
}
