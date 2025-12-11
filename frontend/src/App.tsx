import { useState, useEffect } from 'react'
import './App.css'
import TagList from './components/TagList'
import TagSearch from './components/TagSearch'
import { tagService } from './services/tagService'
import type { TagInfo } from './types'

function App() {
  const [tags, setTags] = useState<TagInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllTags = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await tagService.getAllTags()
      setTags(data)
    } catch (err) {
      setError('Error fetching tags. Make sure the backend is running and you are authenticated with Azure.')
      console.error('Error fetching tags:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (tagKey: string, tagValue: string) => {
    setLoading(true)
    setError(null)
    try {
      if (!tagKey && !tagValue) {
        await fetchAllTags()
      } else {
        const data = await tagService.searchTags({ tagKey, tagValue })
        setTags(data)
      }
    } catch (err) {
      setError('Error searching tags. Make sure the backend is running and you are authenticated with Azure.')
      console.error('Error searching tags:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllTags()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Azure Tag Analyzer</h1>
        <p>Analyze tags across your Azure subscriptions, resource groups, and resources</p>
      </header>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="content">
        <TagSearch onSearch={handleSearch} loading={loading} />
        <TagList tags={tags} loading={loading} />
      </div>
    </div>
  )
}

export default App
