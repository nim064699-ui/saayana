'use client'

import { useEffect, useState } from 'react'

const USERNAME = 'Juan12'
const PASSWORD = 'klingmotion'

const MODELS = {
  'kling-2.6-std':
    'https://api.magnific.com/v1/ai/video/kling-v2-6-motion-control-std',

  'kling-2.6-pro':
    'https://api.magnific.com/v1/ai/video/kling-v2-6-motion-control-pro',

  'kling-3-std':
    'https://api.magnific.com/v1/ai/video/kling-v3-motion-control-std',

  'kling-3-pro':
    'https://api.magnific.com/v1/ai/video/kling-v3-motion-control-pro'
}

export default function Page() {
  const [loggedIn, setLoggedIn] =
    useState(false)

  const [username, setUsername] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [apiKey, setApiKey] =
    useState('')

  const [model, setModel] = useState(
    'kling-2.6-std'
  )

  const [imageUrl, setImageUrl] =
    useState('')

  const [videoUrl, setVideoUrl] =
    useState('')

  const [prompt, setPrompt] =
    useState('')

  const [cfgScale, setCfgScale] =
    useState(0.5)

  const [loading, setLoading] =
    useState(false)

  const [status, setStatus] =
    useState('')

  const [resultVideo, setResultVideo] =
    useState('')

  const [history, setHistory] =
    useState([])

  useEffect(() => {
    const login =
      localStorage.getItem('login')

    if (login === 'true') {
      setLoggedIn(true)
    }

    const savedHistory =
      localStorage.getItem('history')

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const saveHistory = (item) => {
    const updated = [item, ...history]

    setHistory(updated)

    localStorage.setItem(
      'history',
      JSON.stringify(updated)
    )
  }

  const handleLogin = () => {
    if (
      username === USERNAME &&
      password === PASSWORD
    ) {
      localStorage.setItem('login', 'true')

      setLoggedIn(true)
    } else {
      alert('Username atau password salah')
    }
  }

  const logout = () => {
    localStorage.removeItem('login')

    setLoggedIn(false)
  }

  const generateVideo = async () => {
    try {
      setLoading(true)

      setStatus('Generating video...')

      const res = await fetch(
        '/api/generate',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            apiKey,

            endpoint: MODELS[model],

            imageUrl,

            videoUrl,

            prompt,

            cfgScale
          })
        }
      )

      const data = await res.json()

      if (data.video_url) {
        setResultVideo(data.video_url)

        saveHistory({
          video: data.video_url,
          prompt
        })
      } else {
        alert(JSON.stringify(data))
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)

      setStatus('')
    }
  }

  if (!loggedIn) {
    return (
      <div style={loginWrap}>
        <div style={loginBox}>
          <h1>MOTION CONTROL SAYAANA</h1>

          <input
            placeholder='Username'
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={handleLogin}
            style={buttonStyle}
          >
            LOGIN
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={mainStyle}>
      <div style={container}>
        <div style={card}>
          <h1 style={title}>
            MOTION CONTROL SAYAANA
          </h1>

          <button
            onClick={logout}
            style={logoutStyle}
          >
            Logout
          </button>

          <input
            placeholder='Magnific API Key'
            value={apiKey}
            onChange={(e) =>
              setApiKey(e.target.value)
            }
            style={inputStyle}
          />

          <select
            value={model}
            onChange={(e) =>
              setModel(e.target.value)
            }
            style={inputStyle}
          >
            <option value='kling-2.6-std'>
              Kling 2.6 Standard
            </option>

            <option value='kling-2.6-pro'>
              Kling 2.6 Pro
            </option>

            <option value='kling-3-std'>
              Kling 3 Standard
            </option>

            <option value='kling-3-pro'>
              Kling 3 Pro
            </option>
          </select>

          <input
            placeholder='Image URL'
            value={imageUrl}
            onChange={(e) =>
              setImageUrl(e.target.value)
            }
            style={inputStyle}
          />

          <input
            placeholder='Video URL'
            value={videoUrl}
            onChange={(e) =>
              setVideoUrl(e.target.value)
            }
            style={inputStyle}
          />

          <textarea
            placeholder='Prompt Motion'
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
            style={textareaStyle}
          />

          <h3>
            CFG Scale: {cfgScale}
          </h3>

          <input
            type='range'
            min='0'
            max='1'
            step='0.1'
            value={cfgScale}
            onChange={(e) =>
              setCfgScale(e.target.value)
            }
            style={{ width: '100%' }}
          />

          <button
            onClick={generateVideo}
            disabled={loading}
            style={buttonStyle}
          >
            {loading
              ? status
              : 'Generate Video'}
          </button>
        </div>

        {resultVideo && (
          <div style={card}>
            <h2>Result Video</h2>

            <video
              src={resultVideo}
              controls
              style={{
                width: '100%',
                borderRadius: 20
              }}
            />
          </div>
        )}

        <div style={card}>
          <h1>History Generate</h1>

          {history.map((item, index) => (
            <div
              key={index}
              style={{
                marginTop: 20
              }}
            >
              <video
                src={item.video}
                controls
                style={{
                  width: '100%',
                  borderRadius: 20
                }}
              />

              <p>{item.prompt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const loginWrap = {
  minHeight: '100vh',
  background: '#020617',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20
}

const loginBox = {
  width: '100%',
  maxWidth: 400,
  background: '#0f172a',
  padding: 25,
  borderRadius: 25,
  color: 'white'
}

const mainStyle = {
  minHeight: '100vh',
  background: '#020617',
  padding: 20,
  color: 'white'
}

const container = {
  maxWidth: 900,
  margin: '0 auto'
}

const card = {
  background: '#0f172a',
  padding: 20,
  borderRadius: 25,
  marginBottom: 20
}

const title = {
  fontSize: 38,
  marginBottom: 10
}

const inputStyle = {
  width: '100%',
  padding: 15,
  marginTop: 15,
  borderRadius: 15,
  border: '1px solid #334155',
  background: '#1e293b',
  color: 'white'
}

const textareaStyle = {
  width: '100%',
  height: 120,
  marginTop: 20,
  borderRadius: 15,
  border: '1px solid #334155',
  background: '#1e293b',
  color: 'white',
  padding: 15
}

const buttonStyle = {
  width: '100%',
  padding: 15,
  marginTop: 20,
  border: 'none',
  borderRadius: 15,
  background: '#2563eb',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
}

const logoutStyle = {
  padding: '10px 20px',
  borderRadius: 15,
  border: 'none',
  background: '#dc2626',
  color: 'white',
  marginBottom: 20
          }
