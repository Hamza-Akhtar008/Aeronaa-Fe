'use client'

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  reviewCount?: number
}

export default function NavigationTabs({ activeTab, onTabChange, reviewCount = 0 }: NavigationTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
  
  
    { id: 'reviews', label: `Guest reviews (${reviewCount})` },
  ]

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-2 border-b-2 whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
