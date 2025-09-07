import React, {useState, useEffect} from 'react'
import CardContent from '../components/CardContent/CardContent'
import ContentTitle from '../components/ContentTitle/ContentTitle'
import styles from './NewProduct.module.scss'

function NewProduct() {
    const [products, setProducts] = useState ([])
    const [loading, setLoading] = useState (true)
    const [error, setError] = useState (null)

    const fetchNewProducts = async () => {
        setLoading(true);
        setError(null);

        try {
        
        const response = await fetch('http://localhost:4200/api/products/new')
        console.log(response.status,response.statusText)

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
        return <div className={styles.sale__err}>Нет товаров со скидкой</div>;
    }

  return (
    <section className={styles['new-product']}>
        <ContentTitle
        titleText='Новинки'
        buttonText='Все новинки'
        />
        <div className={styles['new-product__container_content']}>
        {products.map(product => (
            <CardContent
            key={product.id}
            name = {product.name}
            price = {product.price}
            discountPrice = {product.discount_price}
            imageUrl = {product.image_url}
            rating = {product.rating}
            discountPercent = {product.discount_percent}
            />
        ))}
        </div>
    </section>
  )
};

export default NewProduct