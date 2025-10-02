// Better Auth server for handling authentication
import { createServer } from 'http'
import { auth } from '../lib/auth'

const server = createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  // Only handle auth routes
  if (req.url?.startsWith('/api/auth')) {
    try {
      const request = new Request(`http://localhost:3001${req.url}`, {
        method: req.method,
        headers: req.headers as any,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? 
          await new Promise((resolve) => {
            let body = ''
            req.on('data', chunk => body += chunk)
            req.on('end', () => resolve(body))
          }) : undefined
      })

      const response = await auth.handler(request)
      
      // Copy response headers
      response.headers.forEach((value, key) => {
        res.setHeader(key, value)
      })
      
      res.writeHead(response.status)
      
      if (response.body) {
        const reader = response.body.getReader()
        const pump = async (): Promise<void> => {
          const { done, value } = await reader.read()
          if (done) {
            res.end()
            return
          }
          res.write(value)
          return pump()
        }
        await pump()
      } else {
        res.end()
      }
    } catch (error) {
      console.error('Auth server error:', error)
      res.writeHead(500)
      res.end('Internal Server Error')
    }
  } else {
    res.writeHead(404)
    res.end('Not Found')
  }
})

const PORT = process.env.AUTH_SERVER_PORT || 3001

server.listen(PORT, () => {
  console.log(`Better Auth server running on http://localhost:${PORT}`)
})

export default server
