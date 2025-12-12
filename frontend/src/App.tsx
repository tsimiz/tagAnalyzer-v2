import { useState, useEffect, useMemo } from 'react'
import './App.css'
import TagList from './components/TagList'
import TagSearch from './components/TagSearch'
import TagFilters from './components/TagFilters'
import { tagService } from './services/tagService'
import type { TagInfo } from './types'

// Helper function to extract environment from text
// Uses word boundaries to avoid false positives like 'development-tools' matching 'dev'
const extractEnvironment = (text: string): string | null => {
  const lowerText = text.toLowerCase();
  
  // Check for 'dev' as a word boundary (not part of other words like 'device')
  if (/\bdev\b/.test(lowerText) || /\bdevelopment\b/.test(lowerText)) return 'dev';
  
  // Check for 'test' as a word boundary (not part of words like 'protest')
  if (/\btest\b/.test(lowerText) || /\btesting\b/.test(lowerText)) return 'test';
  
  // Check for 'prod' as a word boundary (not part of words like 'product')
  if (/\bprod\b/.test(lowerText) || /\bproduction\b/.test(lowerText)) return 'prod';
  
  return null;
}

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
  const [includeDev, setIncludeDev] = useState(true)
  const [includeTest, setIncludeTest] = useState(true)
  const [includeProd, setIncludeProd] = useState(true)

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
      const matchesNullFilter = !showOnlyNull || !tag.value || (typeof tag.value === 'string' && tag.value.trim() === '')
      
      // Resource type filter
      const isResourceGroup = tag.resourceType.toLowerCase() === 'resourcegroup'
      const matchesResourceType = 
        (includeResourceGroups && includeResources) || // Show all when both are checked
        (!includeResourceGroups && !includeResources) || // Show all when none are checked
        (includeResourceGroups && isResourceGroup) || 
        (includeResources && !isResourceGroup)
      
      // Environment filter
      // First try to extract environment from resource group name, fallback to subscription name
      const environment = extractEnvironment(tag.resourceGroupName) || extractEnvironment(tag.subscriptionName);
      
      // If all environments are selected or none are selected, show all
      const allEnvironmentsSelected = includeDev && includeTest && includeProd;
      const noEnvironmentsSelected = !includeDev && !includeTest && !includeProd;
      
      const matchesEnvironment = 
        allEnvironmentsSelected || 
        noEnvironmentsSelected ||
        (environment === 'dev' && includeDev) ||
        (environment === 'test' && includeTest) ||
        (environment === 'prod' && includeProd) ||
        // Show resources with no detected environment when all are selected or none selected
        (environment === null && (allEnvironmentsSelected || noEnvironmentsSelected));
      
      return matchesKey && matchesValue && matchesNullFilter && matchesResourceType && matchesEnvironment
    })
  }, [allTags, searchKey, searchValue, showOnlyNull, includeResourceGroups, includeResources, includeDev, includeTest, includeProd])

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
          includeDev={includeDev}
          onIncludeDevChange={setIncludeDev}
          includeTest={includeTest}
          onIncludeTestChange={setIncludeTest}
          includeProd={includeProd}
          onIncludeProdChange={setIncludeProd}
        />
        <TagList tags={filteredTags} loading={loading} />
      </div>
    </div>
  )
}

export default App
