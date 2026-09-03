export * from './auth'
export * from './project'
export * from './task'

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : 'https://d3ujwk09smrk9z.cloudfront.net')
