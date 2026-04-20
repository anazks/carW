import { useState } from "react"
import axios from "axios"

type Post = {
  id: number
  title: string
  body: string
}

export default function DemoApiTest() {
  const [data, setData] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await axios.get<Post[]>(
        "https://jsonplaceholder.typicode.com/posts"
      )

      setData(response.data.slice(0, 5))
    } catch (err) {
      setError("API failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Demo API Test</h1>

      <button
        onClick={loadData}
        className="mb-4 px-4 py-2 bg-[#D4AF37] text-black rounded font-semibold hover:bg-yellow-500 transition-colors"
      >
        Call Demo API
      </button>

      {loading && <p className="text-blue-600 font-semibold">Loading...</p>}
      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {data.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-4">
            {data.length} posts loaded
          </p>

          {data.map((item) => (
            <div
              key={item.id}
              className="border rounded p-3 mb-3 bg-gray-50"
            >
              <h2 className="font-semibold text-gray-900">{item.title}</h2>
              <p className="text-sm text-gray-600 mt-2">{item.body}</p>
              <p className="text-xs text-gray-400 mt-2">
                Post ID: {item.id}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
