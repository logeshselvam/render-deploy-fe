"use client"

import { useState, useEffect } from "react"
import { Clock, Star, Users, Utensils, Coffee, Cookie, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MenuChat } from "@/components/ui/chat"
import { cn } from "@/lib/utils"

// Backend API Base URL
const API_BASE_URL = "https://render-deploy-iib7.onrender.com"

// Types matching the backend structure
interface MenuItem {
  id?: number
  name: string
  description: string
  price: number
  tags: string[]
  ingredients: string[]
  imageUrl?: string
  rating?: number
  numRatings?: number
  spiceLevel?: number
  calories?: number
  availableTimes: string[]
  ageGroup: string
}

interface MenuCategory {
  id?: number
  name: string
  position: number
  items?: MenuItem[]
}

interface Menu {
  id?: number
  restaurantId: number
  name: string
  cuisine: string
  ageGroup: string
  imageUrl?: string
  rating?: number
  numRatings?: number
  availableTimes: string[]
  categories?: MenuCategory[]
}

/**
 * CustomerMenuView Component
 * 
 * A beautiful, customer-facing menu display that showcases restaurant offerings
 * with elegant styling and smooth animations. Features:
 * - Responsive card-based layout for menu categories and items
 * - Integrated AI-powered menu recommendation chat
 * - Restaurant-inspired warm color palette and typography
 * - Smooth hover effects and transitions
 * - Mobile-optimized design
 * 
 * @component
 */
export default function CustomerMenuView() {
  // State management for menu data and UI
  const [menus, setMenus] = useState<Menu[]>([])
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState("")

  /**
   * Fetches menu data from the backend API
   * Only performs GET requests for read-only customer display
   */
  const fetchMenus = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/menus`)
      if (!response.ok) throw new Error('Failed to fetch menus')
      
      const fetchedMenus = await response.json()
      setMenus(fetchedMenus)
      
      // Auto-select first menu for immediate display
      if (fetchedMenus.length > 0) {
        setSelectedMenu(fetchedMenus[0])
      }
    } catch (error) {
      console.error('Error fetching menus:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Determines the appropriate category icon based on category name
   * @param {string} categoryName - The name of the menu category
   * @returns {JSX.Element} Lucide icon component
   */
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes('appetizer') || name.includes('starter')) return <Utensils className="h-5 w-5" />
    if (name.includes('main') || name.includes('entree')) return <Sparkles className="h-5 w-5" />
    if (name.includes('dessert') || name.includes('sweet')) return <Cookie className="h-5 w-5" />
    if (name.includes('drink') || name.includes('beverage')) return <Coffee className="h-5 w-5" />
    return <Utensils className="h-5 w-5" />
  }

  /**
   * Formats price for consistent display across the menu
   * @param {number} price - The price value to format
   * @returns {string} Formatted price string
   */
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  /**
   * Generates star rating display for menu items
   * @param {number} rating - Rating value (0-5)
   * @returns {JSX.Element[]} Array of star icons
   */
  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3 w-3",
          i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
        )}
      />
    ))
  }

  /**
   * Returns appropriate styling classes for dietary/preference tags
   * @param {string} tag - The tag to style
   * @returns {string} Tailwind CSS classes
   */
  const getTagStyle = (tag: string) => {
    const tagLower = tag.toLowerCase()
    if (tagLower.includes('vegan')) return "bg-green-100 text-green-800 border-green-200"
    if (tagLower.includes('vegetarian')) return "bg-emerald-100 text-emerald-800 border-emerald-200"
    if (tagLower.includes('gluten-free')) return "bg-blue-100 text-blue-800 border-blue-200"
    if (tagLower.includes('spicy')) return "bg-red-100 text-red-800 border-red-200"
    if (tagLower.includes('signature') || tagLower.includes('popular')) return "bg-amber-100 text-amber-800 border-amber-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  // Initialize component on mount
  useEffect(() => {
    fetchMenus()
    
    // Update current time for "available now" indicators
    const updateTime = () => {
      const now = new Date()
      const hour = now.getHours()
      if (hour < 11) setCurrentTime("breakfast")
      else if (hour < 17) setCurrentTime("lunch")
      else setCurrentTime("dinner")
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  // Loading state with elegant spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
          <p className="text-orange-800 font-medium">Preparing your menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Custom Fonts Integration */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-inter { font-family: 'Inter', sans-serif; }
        `
      }} />

      {/* Header Section */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-2">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900">
              Our Menu
            </h1>
            {selectedMenu && (
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 font-inter">
                <div className="flex items-center gap-1">
                  <Utensils className="h-4 w-4 text-orange-600" />
                  <span>{selectedMenu.cuisine} Cuisine</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span>{selectedMenu.ageGroup}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span>{selectedMenu.availableTimes.join(", ")}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Menu Navigation - Multiple menus selector */}
      {menus.length > 1 && (
        <nav className="bg-white/60 backdrop-blur-sm border-b border-orange-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollArea className="w-full">
              <div className="flex gap-3 pb-2">
                {menus.map((menu) => (
                  <button
                    key={menu.id}
                    onClick={() => setSelectedMenu(menu)}
                    className={cn(
                      "px-6 py-3 rounded-full font-inter font-medium transition-all duration-300 whitespace-nowrap",
                      selectedMenu?.id === menu.id
                        ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
                        : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-700 border border-orange-200"
                    )}
                  >
                    {menu.name}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedMenu?.categories?.length ? (
          <div className="space-y-12">
            {/* Menu Categories */}
            {selectedMenu.categories
              .sort((a, b) => a.position - b.position)
              .map((category, categoryIndex) => (
                <section
                  key={category.id}
                  className="animate-in fade-in-50 duration-700"
                  style={{ animationDelay: `${categoryIndex * 100}ms` }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                      {getCategoryIcon(category.name)}
                    </div>
                    <div>
                      <h2 className="font-playfair text-3xl font-semibold text-gray-900">
                        {category.name}
                      </h2>
                      <p className="text-gray-600 font-inter">
                        {category.items?.length || 0} delicious option{(category.items?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Category Items Grid */}
                  {category.items?.length ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {category.items.map((item, itemIndex) => (
                        <Card
                          key={item.id}
                          className={cn(
                            "group hover:shadow-xl transition-all duration-500 border-orange-100 hover:border-orange-200 bg-white/80 backdrop-blur-sm overflow-hidden",
                            "animate-in fade-in-50 slide-in-from-bottom-4"
                          )}
                          style={{ animationDelay: `${(categoryIndex * 100) + (itemIndex * 50)}ms` }}
                        >
                          <CardContent className="p-0">
                            {/* Item Image */}
                            {item.imageUrl && (
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Available Now Badge */}
                                {item.availableTimes.includes(currentTime) && (
                                  <Badge className="absolute top-3 left-3 bg-green-500 text-white border-0 font-inter">
                                    Available Now
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Item Details */}
                            <div className="p-6 space-y-4">
                              {/* Header with name and price */}
                              <div className="flex justify-between items-start gap-3">
                                <h3 className="font-playfair text-xl font-semibold text-gray-900 leading-tight">
                                  {item.name}
                                </h3>
                                <div className="text-right flex-shrink-0">
                                  <div className="font-playfair text-xl font-bold text-orange-600">
                                    {formatPrice(item.price)}
                                  </div>
                                  {item.rating && item.rating > 0 && (
                                    <div className="flex items-center gap-1 mt-1">
                                      {renderStars(item.rating)}
                                      {item.numRatings && (
                                        <span className="text-xs text-gray-500 ml-1 font-inter">
                                          ({item.numRatings})
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-gray-600 font-inter text-sm leading-relaxed">
                                {item.description}
                              </p>

                              {/* Tags */}
                              {item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {item.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className={cn(
                                        "text-xs font-inter font-medium border",
                                        getTagStyle(tag)
                                      )}
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Additional Info */}
                              <div className="flex items-center justify-between text-xs text-gray-500 font-inter pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-4">
                                  {item.calories && (
                                    <span>{item.calories} cal</span>
                                  )}
                                  {item.spiceLevel && item.spiceLevel > 1 && (
                                    <span className="flex items-center gap-1">
                                      🌶️ {item.spiceLevel}/5
                                    </span>
                                  )}
                                </div>
                                <div className="text-orange-600 font-medium">
                                  {item.availableTimes.join(" • ")}
                                </div>
                              </div>

                              {/* Ingredients (on hover) */}
                              {item.ingredients.length > 0 && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
                                  <p className="text-xs text-gray-500 font-inter">
                                    <span className="font-medium">Ingredients:</span> {item.ingredients.join(", ")}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 font-inter">
                      <Utensils className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No items available in this category yet.</p>
                    </div>
                  )}
                </section>
              ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-20">
            <div className="space-y-4">
              <Utensils className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="font-playfair text-2xl font-semibold text-gray-900">
                Menu Coming Soon
              </h3>
              <p className="text-gray-600 font-inter max-w-md mx-auto">
                We're preparing something delicious for you. Please check back soon!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* AI Menu Assistant Chat - Floating Integration */}
      <MenuChat 
        menuId={selectedMenu?.id || null} 
        menuName={selectedMenu?.name}
      />

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-orange-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-600 font-inter">
            Have questions about our menu? Ask our AI assistant for personalized recommendations! 🤖
          </p>
        </div>
      </footer>
    </div>
  )
} 