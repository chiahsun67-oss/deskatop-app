import { useState } from 'react'
import '../styles/login.css'

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await window.electronAPI.login(username, password)
      if (result.success) {
        onSuccess()
      } else {
        setError(result.error ?? '帳號或密碼不正確，請再試一次。')
      }
    } catch {
      setError('系統錯誤，請稍後再試。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-avatar">
          <UserIcon />
        </div>

        <h1 className="login-title">登入帳號</h1>
        <p className="login-subtitle">請輸入您的帳號與密碼</p>

        <form className="login-fields" onSubmit={handleSubmit} autoComplete="off">
          <div className="login-input-wrap">
            <input
              type="text"
              placeholder="帳號"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              autoFocus
              spellCheck={false}
            />
          </div>
          <div className="login-input-wrap">
            <input
              type="password"
              placeholder="密碼"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            className="login-btn"
            type="submit"
            disabled={loading || !username || !password}
          >
            {loading ? '驗證中…' : '登入'}
          </button>
        </form>
      </div>
    </div>
  )
}
