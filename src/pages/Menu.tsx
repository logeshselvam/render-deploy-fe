"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, GripVertical, Upload, Save, MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

// Backend API Base URL
const API_BASE_URL = "https://render-deploy-iib7.onrender.com"

// Updated interfaces to match backend structure
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

// API Functions
const api = {
  async fetchMenus(): Promise<Menu[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/menus`)
      if (!response.ok) throw new Error('Failed to fetch menus')
      return await response.json()
    } catch (error) {
      console.error('Error fetching menus:', error)
      return []
    }
  },

  async createMenu(menuData: Omit<Menu, 'id'>): Promise<Menu | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/menus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData)
      })
      if (!response.ok) throw new Error('Failed to create menu')
      return await response.json()
    } catch (error) {
      console.error('Error creating menu:', error)
      return null
    }
  },

  async createCategory(menuId: number, categoryData: Omit<MenuCategory, 'id'>): Promise<MenuCategory | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/menus/${menuId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      })
      if (!response.ok) throw new Error('Failed to create category')
      return await response.json()
    } catch (error) {
      console.error('Error creating category:', error)
      return null
    }
  },

  async createItem(categoryId: number, itemData: Omit<MenuItem, 'id'>): Promise<MenuItem | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      })
      if (!response.ok) throw new Error('Failed to create item')
      return await response.json()
    } catch (error) {
      console.error('Error creating item:', error)
      return null
    }
  }
}

const PREDEFINED_TAGS = [
  "gluten-free",
  "vegetarian", 
  "vegan",
  "spicy",
  "signature",
  "popular",
  "new",
  "dairy-free",
  "nut-free",
  "keto",
  "low-carb",
  "organic",
  "seasonal",
]

const AVAILABLE_TIMES = ["breakfast", "lunch", "dinner"]
const AGE_GROUPS = ["All", "Kids", "Adults", "Senior"]
const CUISINES = ["American", "Italian", "French", "Chinese", "Japanese", "Mexican", "Indian", "Thai", "Mediterranean", "Other"]

export default function RestaurantMenuManager() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { toast } = useToast()

  const selectedMenu = menus.find((menu) => menu.id === selectedMenuId)

  // Menu form state
  const [menuForm, setMenuForm] = useState({
    name: "",
    cuisine: "",
    ageGroup: "All",
    imageUrl: "",
    availableTimes: [] as string[],
    restaurantId: 1 // Default restaurant ID
  })

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    position: 1
  })

  // Item form state
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    tags: [] as string[],
    ingredients: "",
    imageUrl: "",
    spiceLevel: 1,
    calories: "",
    availableTimes: [] as string[],
    ageGroup: "All"
  })

  // Load menus on component mount
  useEffect(() => {
    loadMenus()
  }, [])

  const loadMenus = async () => {
    setLoading(true)
    const fetchedMenus = await api.fetchMenus()
    setMenus(fetchedMenus)
    if (fetchedMenus.length > 0 && !selectedMenuId) {
      setSelectedMenuId(fetchedMenus[0].id!)
    }
    setLoading(false)
  }

  const resetMenuForm = () => {
    setMenuForm({
      name: "",
      cuisine: "",
      ageGroup: "All",
      imageUrl: "",
      availableTimes: [],
      restaurantId: 1
    })
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      position: 1
    })
  }

  const resetItemForm = () => {
    setItemForm({
      name: "",
      description: "",
      price: "",
      tags: [],
      ingredients: "",
      imageUrl: "",
      spiceLevel: 1,
      calories: "",
      availableTimes: [],
      ageGroup: "All"
    })
    setEditingItem(null)
  }

  const addMenu = async () => {
    if (!menuForm.name.trim() || !menuForm.cuisine) {
      toast({
        title: "Missing information",
        description: "Please fill in menu name and cuisine.",
        variant: "destructive",
      })
      return
    }

    const menuData: Omit<Menu, 'id'> = {
      restaurantId: menuForm.restaurantId,
      name: menuForm.name,
      cuisine: menuForm.cuisine,
      ageGroup: menuForm.ageGroup,
      imageUrl: menuForm.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      availableTimes: menuForm.availableTimes,
      rating: 0,
      numRatings: 0
    }

    const newMenu = await api.createMenu(menuData)
    
    if (newMenu) {
      setMenus([...menus, { ...newMenu, categories: [] }])
      setSelectedMenuId(newMenu.id!)
      resetMenuForm()
      setIsAddMenuOpen(false)

      toast({
        title: "Menu created",
        description: `"${menuForm.name}" has been added successfully.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to create menu. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addCategory = async () => {
    if (!categoryForm.name.trim() || !selectedMenu?.id) {
      toast({
        title: "Missing information",
        description: "Please fill in category name.",
        variant: "destructive",
      })
      return
    }

    const categoryData: Omit<MenuCategory, 'id'> = {
      name: categoryForm.name,
      position: categoryForm.position
    }

    const newCategory = await api.createCategory(selectedMenu.id, categoryData)
    
    if (newCategory) {
      const updatedMenus = menus.map((menu) =>
        menu.id === selectedMenuId 
          ? { 
              ...menu, 
              categories: [...(menu.categories || []), { ...newCategory, items: [] }] 
            } 
          : menu
      )

      setMenus(updatedMenus)
      resetCategoryForm()
      setIsAddCategoryOpen(false)

      toast({
        title: "Category added",
        description: `"${categoryForm.name}" has been added to ${selectedMenu.name}.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addOrUpdateItem = async () => {
    if (!itemForm.name.trim() || !itemForm.price || selectedCategoryId === null) {
      toast({
        title: "Missing information",
        description: "Please fill in required fields.",
        variant: "destructive",
      })
      return
    }

    const ingredients = itemForm.ingredients
      .split(",")
      .map((ing) => ing.trim())
      .filter((ing) => ing)
    const price = Number.parseFloat(itemForm.price)
    const calories = itemForm.calories ? Number.parseInt(itemForm.calories) : undefined

    if (isNaN(price)) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price.",
        variant: "destructive",
      })
      return
    }

    const itemData: Omit<MenuItem, 'id'> = {
      name: itemForm.name,
      description: itemForm.description,
      price: price,
      tags: itemForm.tags,
      ingredients: ingredients,
      imageUrl: itemForm.imageUrl || "https://images.unsplash.com/photo-1519864600265-abb23847ef2c",
      spiceLevel: itemForm.spiceLevel,
      calories: calories,
      availableTimes: itemForm.availableTimes,
      ageGroup: itemForm.ageGroup,
      rating: 0,
      numRatings: 0
    }

    if (!editingItem) {
      // Create new item
      const newItem = await api.createItem(selectedCategoryId, itemData)
      
      if (newItem) {
        const updatedMenus = menus.map((menu) =>
          menu.id === selectedMenuId
            ? {
                ...menu,
                categories: menu.categories?.map((category) =>
                  category.id === selectedCategoryId
                    ? {
                        ...category,
                        items: [...(category.items || []), newItem],
                      }
                    : category
                ) || []
              }
            : menu
        )

        setMenus(updatedMenus)
        resetItemForm()
        setIsAddItemOpen(false)

        toast({
          title: "Item added",
          description: `"${itemForm.name}" has been added successfully.`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to create item. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      // For editing, we'd need PUT endpoints - for now just update locally
      const updatedMenus = menus.map((menu) =>
        menu.id === selectedMenuId
          ? {
              ...menu,
              categories: menu.categories?.map((category) =>
                category.id === selectedCategoryId
                  ? {
                      ...category,
                      items: category.items?.map((item) => 
                        item.id === editingItem.id 
                          ? { ...itemData, id: editingItem.id } 
                          : item
                      ) || [],
                    }
                  : category
              ) || []
            }
          : menu
      )

      setMenus(updatedMenus)
      resetItemForm()
      setIsAddItemOpen(false)

      toast({
        title: "Item updated",
        description: `"${itemForm.name}" has been updated successfully.`,
      })
    }
  }

  const deleteItem = (categoryId: number, itemId: number) => {
    // For deletion, we'd need DELETE endpoints - for now just update locally
    const updatedMenus = menus.map((menu) =>
      menu.id === selectedMenuId
        ? {
            ...menu,
            categories: menu.categories?.map((category) =>
              category.id === categoryId
                ? { ...category, items: category.items?.filter((item) => item.id !== itemId) || [] }
                : category
            ) || []
          }
        : menu
    )

    setMenus(updatedMenus)

    toast({
      title: "Item deleted",
      description: "The menu item has been removed.",
    })
  }

  const editItem = (item: MenuItem, categoryId: number) => {
    setEditingItem(item)
    setSelectedCategoryId(categoryId)
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      tags: item.tags,
      ingredients: item.ingredients.join(", "),
      imageUrl: item.imageUrl || "",
      spiceLevel: item.spiceLevel || 1,
      calories: item.calories?.toString() || "",
      availableTimes: item.availableTimes,
      ageGroup: item.ageGroup
    })
    setIsAddItemOpen(true)
  }

  const toggleTag = (tag: string) => {
    setItemForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const toggleAvailableTime = (time: string, formType: 'menu' | 'item') => {
    if (formType === 'menu') {
      setMenuForm((prev) => ({
        ...prev,
        availableTimes: prev.availableTimes.includes(time) 
          ? prev.availableTimes.filter((t) => t !== time) 
          : [...prev.availableTimes, time],
      }))
    } else {
      setItemForm((prev) => ({
        ...prev,
        availableTimes: prev.availableTimes.includes(time) 
          ? prev.availableTimes.filter((t) => t !== time) 
          : [...prev.availableTimes, time],
      }))
    }
  }

  const MenuSidebar = () => (
    <div className="w-80 border-r bg-muted/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Menus</h2>
        <Dialog open={isAddMenuOpen} onOpenChange={setIsAddMenuOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Menu</DialogTitle>
              <DialogDescription>Add a new menu to your restaurant.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="menu-name">Menu Name *</Label>
                <Input
                  id="menu-name"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm(prev => ({...prev, name: e.target.value}))}
                  placeholder="e.g., Breakfast Menu"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cuisine">Cuisine *</Label>
                <Select value={menuForm.cuisine} onValueChange={(value) => setMenuForm(prev => ({...prev, cuisine: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CUISINES.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="age-group">Age Group</Label>
                <Select value={menuForm.ageGroup} onValueChange={(value) => setMenuForm(prev => ({...prev, ageGroup: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_GROUPS.map((group) => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="menu-image">Image URL</Label>
                <Input
                  id="menu-image"
                  value={menuForm.imageUrl}
                  onChange={(e) => setMenuForm(prev => ({...prev, imageUrl: e.target.value}))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid gap-2">
                <Label>Available Times</Label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TIMES.map((time) => (
                    <Badge
                      key={time}
                      variant={menuForm.availableTimes.includes(time) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => toggleAvailableTime(time, 'menu')}
                    >
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddMenuOpen(false)}>Cancel</Button>
              <Button onClick={addMenu}>Create Menu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading menus...</div>
        ) : (
          <div className="space-y-2">
            {menus.map((menu) => (
              <Button
                key={menu.id}
                variant={selectedMenuId === menu.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedMenuId(menu.id!)}
              >
                <div className="text-left">
                  <div className="font-medium">{menu.name}</div>
                  <div className="text-xs text-muted-foreground">{menu.cuisine}</div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <MenuSidebar />
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
              <MenuIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <MenuSidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          {selectedMenu ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold">{selectedMenu.name}</h1>
                  <p className="text-muted-foreground mt-1">
                    {selectedMenu.cuisine} • {selectedMenu.ageGroup} • {selectedMenu.availableTimes.join(", ")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Menu Image
                  </Button>
                  <Button onClick={() => loadMenus()}>
                    <Save className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Categories</h2>
                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Category</DialogTitle>
                      <DialogDescription>Create a new category for your menu items.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category-name">Category Name *</Label>
                        <Input
                          id="category-name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm(prev => ({...prev, name: e.target.value}))}
                          placeholder="e.g., Appetizers, Mains, Desserts"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category-position">Position</Label>
                        <Input
                          id="category-position"
                          type="number"
                          value={categoryForm.position}
                          onChange={(e) => setCategoryForm(prev => ({...prev, position: parseInt(e.target.value) || 1}))}
                          min="1"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button>
                      <Button onClick={addCategory}>Add Category</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-8">
                {selectedMenu.categories?.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            {category.name}
                          </CardTitle>
                          <CardDescription>
                            {category.items?.length || 0} item{(category.items?.length || 0) !== 1 ? "s" : ""} • Position {category.position}
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedCategoryId(category.id!)
                            resetItemForm()
                            setIsAddItemOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!category.items?.length ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No items in this category yet. Add your first item!
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {category.items.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                              <GripVertical className="h-4 w-4 text-muted-foreground mt-1" />
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <span className="font-semibold text-lg">${item.price.toFixed(2)}</span>
                                      <div className="flex gap-1">
                                        {item.tags.map((tag) => (
                                          <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                                      {item.ingredients.length > 0 && (
                                        <p>
                                          <span className="font-medium">Ingredients:</span> {item.ingredients.join(", ")}
                                        </p>
                                      )}
                                      <p>
                                        <span className="font-medium">Available:</span> {item.availableTimes.join(", ")} • {item.ageGroup}
                                      </p>
                                      {item.calories && (
                                        <p>
                                          <span className="font-medium">Calories:</span> {item.calories} • 
                                          <span className="font-medium"> Spice Level:</span> {item.spiceLevel}/5
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => editItem(item, category.id!)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteItem(category.id!, item.id!)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!selectedMenu.categories?.length && (
                <Card>
                  <CardContent className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No categories yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding your first category to organize your menu items.
                    </p>
                    <Button onClick={() => setIsAddCategoryOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Category
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No menu selected</h2>
              <p className="text-muted-foreground">
                {loading ? "Loading menus..." : "Select a menu from the sidebar to get started."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog
        open={isAddItemOpen}
        onOpenChange={(open: boolean) => {
          setIsAddItemOpen(open)
          if (!open) resetItemForm()
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the details for this menu item." : "Add a new item to your menu category."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="item-name">Item Name *</Label>
                <Input
                  id="item-name"
                  value={itemForm.name}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Grilled Salmon"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="item-price">Price *</Label>
                <Input
                  id="item-price"
                  type="number"
                  step="0.01"
                  value={itemForm.price}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={itemForm.description}
                onChange={(e) => setItemForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your dish..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="item-image">Image URL</Label>
                <Input
                  id="item-image"
                  value={itemForm.imageUrl}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="item-calories">Calories</Label>
                <Input
                  id="item-calories"
                  type="number"
                  value={itemForm.calories}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, calories: e.target.value }))}
                  placeholder="e.g., 450"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="spice-level">Spice Level (1-5)</Label>
                <Input
                  id="spice-level"
                  type="number"
                  min="1"
                  max="5"
                  value={itemForm.spiceLevel}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, spiceLevel: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="item-age-group">Age Group</Label>
                <Select value={itemForm.ageGroup} onValueChange={(value) => setItemForm(prev => ({...prev, ageGroup: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_GROUPS.map((group) => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={itemForm.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Available Times</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TIMES.map((time) => (
                  <Badge
                    key={time}
                    variant={itemForm.availableTimes.includes(time) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleAvailableTime(time, 'item')}
                  >
                    {time}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="item-ingredients">Ingredients</Label>
              <Textarea
                id="item-ingredients"
                value={itemForm.ingredients}
                onChange={(e) => setItemForm((prev) => ({ ...prev, ingredients: e.target.value }))}
                placeholder="Comma-separated ingredients (e.g., salmon, asparagus, lemon)"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addOrUpdateItem}>{editingItem ? "Update Item" : "Add Item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
