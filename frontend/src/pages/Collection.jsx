import React, { useEffect, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import Title from '../components/Title'
import { useShop } from '../hook/useShop'
import ProductItem from '../components/ProductItem'
import SearchBar from '../components/SearchBar'

const Collection = () => {
  const { products,search } = useShop()
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState(products)
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])

  const [sortType, setSortType] = useState('relevant')

  const handleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(category.filter((item) => item !== e.target.value))
    } else {
      setCategory([...category, e.target.value])
    }
  }

  const handleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(subCategory.filter((item) => item !== e.target.value))
    } else {
      setSubCategory([...subCategory, e.target.value])
    }
  }

  useEffect(() => {
    let filteredProducts = products.slice()

    if(search){
        filteredProducts = filteredProducts.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      filteredProducts = filteredProducts.filter((item) => category.includes(item.category))
    }

    if (subCategory.length > 0) {
      filteredProducts = filteredProducts.filter((item) => subCategory.includes(item.subCategory))
    }

    switch (sortType) {
      case 'low-high':
        filteredProducts.sort((a, b) => a.price - b.price)
        break

      case 'high-low':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilterProducts(filteredProducts)
  }, [products, category, subCategory, sortType,search])

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-4 px-5 border-t">
      {/* Left Section */}
      <div className="min-w-60">
        <p onClick={() => setShowFilter(!showFilter)} className="text-xl flex gap-2 text-center mb-5 items-center">
          FILTERS <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
      {/* Categories */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-2 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 font-light text-sm text-gray-700">
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" onChange={handleCategory} value="Men" />Men
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" onChange={handleCategory} value="Women" />Women
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" onChange={handleCategory} value="Kids" />Kids
            </p>
          </div>
        </div>
        {/* Sub Categories */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-2 text-sm font-medium">SUB-CATEGORIES</p>
          <div className="flex flex-col gap-2 font-light text-sm text-gray-700">
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" onChange={handleSubCategory} value="Topwear" />TopWear
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" onChange={handleSubCategory} value="Bottomwear" />BottomWear
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" onChange={handleSubCategory} value="Winterwear" />WinterWear
            </p>
          </div>
        </div>
      </div>

        {/* Right side */}
      <div className="flex-1">
        <SearchBar />
        <div className="flex text-base sm:text-2xl justify-between mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select onChange={(e) => setSortType(e.target.value)} className="border-2 border-gray-500 px-2 text-sm">
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* Render Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 gap-y-6">
          {filterProducts.map((item) => (
            <ProductItem key={item._id} name={item.name} price={item.price} id={item._id} image={item.images} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collection