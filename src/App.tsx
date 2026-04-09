import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((c) => c + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR
        </p>
      </header>
    </div>
  )
}

export default App