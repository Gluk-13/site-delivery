import React, { useState, useEffect } from 'react'
import styles from './FavoritePage.module.scss'
import CardContent from '../HomePage/section/components/CardContent/CardContent';
import NavComponentSection from '../HomePage/section/components/Nav/NavComponentSection';
import PageList from '../HomePage/section/components/PageList/PageList';
import { useFavoriteStore } from '../../stores/useFavoriteStore';

function FavoritePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState ([])
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const { favorites, loading, favoritesCount } = useFavoriteStore()

  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

  const fetchFavoritesProducts = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/products/bulk`,{
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: favorites }),
      });

      const result = await response.json();
      console.log('Bulk response:', result);

      if (result.success && result.data) {
          setProducts(result.data);
      } else {
          setProducts(result.products || result || []);
      }
    } catch(error) {
      throw new Error('Ошибка сервера',error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromFavorites = (removedProductId) => {
    setProducts(prev => prev.filter(product => product.id !== removedProductId));
  };

  const handleAddToFavorites = (addedProductId) => {

  };

  useEffect(() => {
      const loadProducts = async () => {
          if (favorites.length > 0) {
              await fetchFavoritesProducts();
          } else {
              setProducts([]); 
          }
      };
      if (!loading) {
          loadProducts();
      }
  }, [favorites, loading]); 

  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage)

  return (
    <section className={styles.favorites}>
        <NavComponentSection
          primaryLink='Главная'
          secondLink='Избранное'
        />
        <div className={styles.favorites__content_container}>
          <h1 className={styles.favorites__container_title}>
            Избранное
          </h1>
          <div className={styles.favorites__quantity_container}>
            <p className={styles.favorites__quantity}>{favorites.length}</p>
          </div>
        </div>
        {isLoading ? (
            <div>Загрузка избранных товаров...</div>
        ) : favorites.length === 0 ? (
            <div className={styles.empty}>В избранном пока ничего нет</div>
        ) : (
              <>
                <div className={styles.favorites__container_content}>
                    {currentProducts.map(product => {
                      if (!product.id) {
                          console.warn('Товар без ID обнаружен:', product);
                          return null;
                      }
                      return (
                        <CardContent
                            key={product.id}
                            productId={product.id}
                            name={product.name}
                            price={product.price}
                            discountPrice={product.discount_price}
                            imageUrl={product.image_url}
                            rating={product.rating}
                            discountPercent={product.discount_percent}
                            onRemoveFromFavorites={handleRemoveFromFavorites}
                            onAddToFavorites={handleAddToFavorites}
                        />
                      )
                    })}
                </div>
                <PageList
                  productsProps={products}
                  totalProduct={favorites.length}
                  currentPage={currentPage}
                  productsPerPage={productsPerPage}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
    </section>
  )
}

export default FavoritePage