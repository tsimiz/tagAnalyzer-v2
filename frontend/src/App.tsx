import { useState, useEffect, useMemo } from 'react'
import './App.css'
import TagList from './components/TagList'
import TagSearch from './components/TagSearch'
import TagFilters from './components/TagFilters'
import { tagService } from './services/tagService'
import type { TagInfo } from './types'

function App() {
  const [allTags, setAllTags] = useState<TagInfo[]>([])
  const [searchKey, setSearchKey] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [showOnlyNull, setShowOnlyNull] = useState(false)
  const [includeResourceGroups, setIncludeResourceGroups] = useState(true)
  const [includeResources, setIncludeResources] = useState(true)

  const fetchAllTags = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await tagService.getAllTags()
      setAllTags(data)
    } catch (err) {
      setError('Error fetching tags. Make sure the backend is running and you are authenticated with Azure.')
      console.error('Error fetching tags:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (tagKey: string, tagValue: string) => {
    setSearchKey(tagKey)
    setSearchValue(tagValue)
  }

  // Filter tags on the client side
  const filteredTags = useMemo(() => {
    return allTags.filter(tag => {
      // Search filters
      const matchesKey = !searchKey || tag.key.toLowerCase().includes(searchKey.toLowerCase())
      const matchesValue = !searchValue || tag.value.toLowerCase().includes(searchValue.toLowerCase())
      
      // Null value filter
      const matchesNullFilter = !showOnlyNull || !tag.value || tag.value.trim() === ''
      
      // Resource type filter
      const isResourceGroup = tag.resourceType.toLowerCase() === 'resourcegroup'
      const matchesResourceType = 
        (includeResourceGroups && includeResources) || // Show all when both are checked
        (!includeResourceGroups && !includeResources) || // Show all when none are checked
        (includeResourceGroups && isResourceGroup) || 
        (includeResources && !isResourceGroup)
      
      return matchesKey && matchesValue && matchesNullFilter && matchesResourceType
    })
  }, [allTags, searchKey, searchValue, showOnlyNull, includeResourceGroups, includeResources])

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
        <TagFilters
          showOnlyNull={showOnlyNull}
          onShowOnlyNullChange={setShowOnlyNull}
          includeResourceGroups={includeResourceGroups}
          onIncludeResourceGroupsChange={setIncludeResourceGroups}
          includeResources={includeResources}
          onIncludeResourcesChange={setIncludeResources}
        />
        <TagList tags={filteredTags} loading={loading} />
      </div>
    </div>
  )
}

export default App
