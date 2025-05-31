"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, GripVertical, Upload, Save, MenuIcon } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { ScrollArea } from "../components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Toaster } from "../components/ui/toaster"
import { useToast } from "../components/ui/use-toast"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  tags: string[]
  ingredients: string[]
}

interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

interface Menu {
  id: string
  name: string
  categories: MenuCategory[]
}

const PREDEFINED_TAGS = [
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Spicy",
  "Popular",
  "New",
  "Dairy-Free",
  "Nut-Free",
  "Keto",
  "Low-Carb",
  "Organic",
  "Seasonal",
]

export default function RestaurantMenuManager() {
  const [menus, setMenus] = useState<Menu[]>([
    {
      id: "1",
      name: "Breakfast Menu",
      categories: [
        {
          id: "1",
          name: "Appetizers",
          items: [
            {
              id: "1",
              name: "Avocado Toast",
              description: "Fresh avocado on sourdough with cherry tomatoes",
              price: 12.99,
              tags: ["Vegetarian", "Popular"],
              ingredients: ["Avocado", "Sourdough bread", "Cherry tomatoes", "Olive oil", "Salt", "Pepper"],
            },
          ],
        },
      ],
    },
  ])

  const [selectedMenuId, setSelectedMenuId] = useState<string>("1")
  const [newMenuName, setNewMenuName] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { toast } = useToast()

  const selectedMenu = menus.find((menu) => menu.id === selectedMenuId)

  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    tags: [] as string[],
    ingredients: "",
  })

  const resetItemForm = () => {
    setItemForm({
      name: "",
      description: "",
      price: "",
      tags: [],
      ingredients: "",
    })
    setEditingItem(null)
  }

  const addMenu = () => {
    if (!newMenuName.trim()) return

    const newMenu: Menu = {
      id: Date.now().toString(),
      name: newMenuName,
      categories: [],
    }

    setMenus([...menus, newMenu])
    setSelectedMenuId(newMenu.id)
    setNewMenuName("")
    setIsAddMenuOpen(false)

    toast({
      title: "Menu created",
      description: `"${newMenuName}" has been added successfully.`,
    })
  }

  const addCategory = () => {
    if (!newCategoryName.trim() || !selectedMenu) return

    const newCategory: MenuCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      items: [],
    }

    const updatedMenus = menus.map((menu) =>
      menu.id === selectedMenuId ? { ...menu, categories: [...menu.categories, newCategory] } : menu,
    )

    setMenus(updatedMenus)
    setNewCategoryName("")
    setIsAddCategoryOpen(false)

    toast({
      title: "Category added",
      description: `"${newCategoryName}" has been added to ${selectedMenu.name}.`,
    })
  }

  const addOrUpdateItem = () => {
    if (!itemForm.name.trim() || !itemForm.price || !selectedCategoryId) return

    const ingredients = itemForm.ingredients
      .split(",")
      .map((ing) => ing.trim())
      .filter((ing) => ing)
    const price = Number.parseFloat(itemForm.price)

    if (isNaN(price)) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price.",
        variant: "destructive",
      })
      return
    }

    const newItem: MenuItem = {
      id: editingItem?.id || Date.now().toString(),
      name: itemForm.name,
      description: itemForm.description,
      price: price,
      tags: itemForm.tags,
      ingredients: ingredients,
    }

    const updatedMenus = menus.map((menu) =>
      menu.id === selectedMenuId
        ? {
            ...menu,
            categories: menu.categories.map((category) =>
              category.id === selectedCategoryId
                ? {
                    ...category,
                    items: editingItem
                      ? category.items.map((item) => (item.id === editingItem.id ? newItem : item))
                      : [...category.items, newItem],
                  }
                : category,
            ),
          }
        : menu,
    )

    setMenus(updatedMenus)
    resetItemForm()
    setIsAddItemOpen(false)

    toast({
      title: editingItem ? "Item updated" : "Item added",
      description: `"${newItem.name}" has been ${editingItem ? "updated" : "added"} successfully.`,
    })
  }

  const deleteItem = (categoryId: string, itemId: string) => {
    const updatedMenus = menus.map((menu) =>
      menu.id === selectedMenuId
        ? {
            ...menu,
            categories: menu.categories.map((category) =>
              category.id === categoryId
                ? { ...category, items: category.items.filter((item) => item.id !== itemId) }
                : category,
            ),
          }
        : menu,
    )

    setMenus(updatedMenus)

    toast({
      title: "Item deleted",
      description: "The menu item has been removed.",
    })
  }

  const editItem = (item: MenuItem, categoryId: string) => {
    setEditingItem(item)
    setSelectedCategoryId(categoryId)
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      tags: item.tags,
      ingredients: item.ingredients.join(", "),
    })
    setIsAddItemOpen(true)
  }

  const toggleTag = (tag: string) => {
    setItemForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Menu</DialogTitle>
              <DialogDescription>Add a new menu to your restaurant (e.g., Breakfast, Lunch, Dinner).</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="menu-name">Menu Name</Label>
                <Input
                  id="menu-name"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  placeholder="e.g., Breakfast Menu"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addMenu}>Create Menu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-2">
          {menus.map((menu) => (
            <Button
              key={menu.id}
              variant={selectedMenuId === menu.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedMenuId(menu.id)}
            >
              {menu.name}
            </Button>
          ))}
        </div>
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
                  <p className="text-muted-foreground mt-1">Manage categories and menu items</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Menu Image
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
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
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                          id="category-name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g., Appetizers, Mains, Desserts"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addCategory}>Add Category</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-8">
                {selectedMenu.categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            {category.name}
                          </CardTitle>
                          <CardDescription>
                            {category.items.length} item{category.items.length !== 1 ? "s" : ""}
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedCategoryId(category.id)
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
                      {category.items.length === 0 ? (
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
                                    {item.ingredients.length > 0 && (
                                      <p className="text-xs text-muted-foreground mt-2">
                                        <span className="font-medium">Ingredients:</span> {item.ingredients.join(", ")}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => editItem(item, category.id)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteItem(category.id, item.id)}
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

              {selectedMenu.categories.length === 0 && (
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
              <p className="text-muted-foreground">Select a menu from the sidebar to get started.</p>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the details for this menu item." : "Add a new item to your menu category."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
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
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={itemForm.description}
                onChange={(e) => setItemForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your dish..."
                rows={3}
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
