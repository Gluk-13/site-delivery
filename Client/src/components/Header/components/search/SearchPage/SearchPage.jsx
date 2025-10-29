import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styles from './SearchPage.module.scss'
import NavComponentSection from '../../../../HomePage/section/components/Nav/NavComponentSection'
import CardContent from '../../../../HomePage/section/components/CardContent/CardContent'

function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

  const searchProducts = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Ошибка поиска: ${response.status}`)
      }
      
      const data = await response.json()
      setSearchResults(data.data || [])
      
    } catch (err) {
      setError(err.message)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      searchProducts(query)
    } else {
      setSearchResults([])
      setError(null)
    }
  }, [query])

  const handleBackClick = () => {
    navigate(-1)
  }

  return (
    <section className={styles['search-page']}>
      <NavComponentSection
        primaryLink='Главная'
        secondLink='Поиск'
      />
      
      <div className={styles['search-page__container']}>
        <div className={styles['search-page__header']}>
          <h1 className={styles['search-page__title']}>
            {query ? `Результаты поиска: "${query}"` : 'Поиск товаров'}
          </h1>
        </div>

        {isLoading ? (
          <div className={styles['search-page__loading']}>
            Ищем товары...
          </div>
        ) : query ? (
          <div className={styles['search-page__results']}>
            <p className={styles['search-page__subtitle']}>
              Найдено товаров: {searchResults.length}
            </p>
            
            {searchResults.length > 0 ? (
              <div className={styles['search-page__products']}>
                {searchResults.map(product => (
                  <CardContent
                    key={product.id}
                    productId={product.id}
                    name={product.name}
                    price={product.price}
                    discountPrice={product.discount_price}
                    discountPercent={product.discount_percent}
                    imageUrl={product.image_url}
                    rating={product.rating}
                  />
                ))}
              </div>
            ) : (
              <div className={styles['search-page__empty']}>
                По запросу "{query}" ничего не найдено
              </div>
            )}
          </div>
        ) : (
          <div className={styles['search-page__descr']}>
            Введите поисковый запрос...
          </div>
        )}
      </div>
    </section>
  )
}

export default SearchPage