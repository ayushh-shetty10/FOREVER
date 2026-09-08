import React, { useEffect, useState } from 'react'
import { useShop } from '../hook/useShop'
import ProductGrid from './product/ProductGrid';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useShop();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCp = products.slice();

      productsCp = productsCp.filter(
        (item) =>
          item.category === category &&
          item.subCategory === subCategory &&
          String(item._id) !== String(currentProductId)
      );

      setRelated(productsCp.slice(0, 5));
    }
  }, [products, category, subCategory, currentProductId])

  return (
    <div className='my-24 font-sans'>
      <div className="text-center py-6 select-none">
        <h2 className="text-h2 font-display text-foreground mb-2">Related Products</h2>
        <p className="text-small text-muted-foreground font-sans">Handpicked sarees sharing similar weaves and styles</p>
      </div>
      <ProductGrid 
        products={related} 
        columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" 
      />
    </div>
  )
}

export default RelatedProducts