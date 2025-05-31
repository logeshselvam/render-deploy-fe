import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Settings } from "lucide-react"
import Menu from './pages/Menu'
import CustomerMenuView from './pages/CustomerMenuView'

function App() {
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer')

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Restaurant Menu System</h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant={currentView === 'customer' ? 'default' : 'outline'}
              onClick={() => setCurrentView('customer')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Customer View
              {currentView === 'customer' && (
                <Badge variant="secondary" className="ml-1">Active</Badge>
              )}
            </Button>
            
            <Button
              variant={currentView === 'admin' ? 'default' : 'outline'}
              onClick={() => setCurrentView('admin')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Admin Panel
              {currentView === 'admin' && (
                <Badge variant="secondary" className="ml-1">Active</Badge>
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {currentView === 'customer' ? (
          <CustomerMenuView />
        ) : (
          <Menu />
        )}
      </main>
    </div>
  )
}

export default App
