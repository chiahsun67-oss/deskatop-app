import { useState } from 'react'
import Login from './pages/Login'

function Dashboard() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '1.25rem',
      color: '#1d1d1f'
    }}>
      歡迎登入！Dashboard 頁面
    </div>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(false)
  return authed ? <Dashboard /> : <Login onSuccess={() => setAuthed(true)} />
}
