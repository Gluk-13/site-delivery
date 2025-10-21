import React, {useState, useEffect} from 'react'
import CardContent from '../components/CardContent/CardContent'
import ContentTitle from '../components/ContentTitle/ContentTitle'
import styles from './NewProduct.module.scss'
import { useLocation } from 'react-router-dom'
import NavComponentSection from '../components/Nav/NavComponentSection'
import PageList from '../components/PageList/PageList'


function NewProduct() {
    const [products, setProducts] = useState ([])
    const [loading, setLoading] = useState (true)
    const [error, setError] = useState (null)
    const [currentPage, setCurrentPage] = useState(1); // Текущая страница
    const [productsPerPage, setProductsPerPage] = useState(10); //Количесто продуктов на странице
    const location = useLocation()

    const isFullSection = location.pathname === '/new-product'

    const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
    const fetchNewProducts = async () => {
        try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/products/new`)

        if (!response.ok) {
            throw new Error (`Ошибка загрузки данных: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()

        if (result.success && result.data) {
                setProducts(result.data);
            } else {
                throw new Error (`Неверный формат данных`);
        }
        } catch (err) { 
            setError(err.message);
            console.error('Ошибка загрузки', err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchNewProducts(); // при монтировании компонента, юзер зашел на страницу 
    }, []);

    if(loading) {
        return <div className={styles.sale__err}>Загрузка товаров</div>
    }

    if (error) {
        return <div className={styles.sale__err}>Ошибка: {error}</div>;
    }

    if (products.length === 0) {
        return <div className={styles.sale__err}>Нет новых товаров</div>;
    }

    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + productsPerPage)
    
    const displayedProducts = isFullSection ? currentProducts : products.slice(0,5)

  if (isFullSection) { return (
      <section className={styles['new-products']}>
        <NavComponentSection
          primaryLink='Главная'
          secondLink='Новинки'
        />
        <div className={styles['new-products__content_container']}>
          <h1 className={styles['new-products__container_title']}>
            Новинки
          </h1>
          <div className={styles['new-products__quantity_container']}>
            <p className={styles['new-products__quantity']}>{products.length}</p>
          </div>
        </div>
        <div className={styles['new-products__container_content']}>
          {displayedProducts.map(product => {
            if (!product.id) {
              console.warn('Товар без ID обнаружен:', product);
              return null;
            }
            return (
              <CardContent
                key={product.id}
                productId={product.id}
                name = {product.name}
                price = {product.price}
                discountPrice = {product.discount_price}
                imageUrl = {product.image_url}
                rating = {product.rating}
                discountPercent = {product.discount_percent}
              />
            )
          })}
        </div>
        <PageList
        productsProps={products}
        totalProduct={products.length}
        currentPage={currentPage}
        productsPerPage={productsPerPage}
        onPageChange={setCurrentPage}
        />
      </section>
    )} else {
    return (
      <section className={styles['new-products']}>
        <ContentTitle
          titleText='Новинки'
          buttonText='Все новинки'
          seeLink={'/new-product'}
        />
        <div className={styles['new-products__container_content']}>
          {displayedProducts.map(product => {
          if (!product.id) {
            console.warn('Товар без ID обнаружен:', product);
            return null;
          }
          return (
          <CardContent
            productId={product.id}
            key={product.id}
            name = {product.name}
            price = {product.price}
            discountPrice = {product.discount_price}
            imageUrl = {product.image_url}
            rating = {product.rating}
            discountPercent = {product.discount_percent}
            />
          )
        })}
        </div>
      </section>
    )}
};

export default NewProduct