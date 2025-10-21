import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import styles from './CategoryPage.module.scss'
import CardContent from '../../../../../HomePage/section/components/CardContent/CardContent'

const categoryTitles = {
    'dairy-eggs': 'Молоко, сыр, яйцо',
    'bread': 'Хлеб и выпечка',
    'confectionery': 'Кондитерские изделия',
    'fruits-vegetables': 'Фрукты и овощи',
    'beverages':'Напитки',
    'tea-coffee':'Чай, кофе',
    'sweets':'Сладкое',
    'groceries':'Бакалея',
    'seafood':'Морепродукты',
    'meat':'Мясо',
    'baby-food':'Детское питание',
    'pet-supplies':'Зоотовары',
    'non-food':'Непродовольственные товары',
}

function CategoryPage() {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

    const decodedCategoryName = decodeURIComponent(categoryName);
    const displayName = categoryTitles[decodedCategoryName] || decodedCategoryName;

    useEffect(() => {
        fetchProductsByCategory(categoryName);
    }, [categoryName]);

    const fetchProductsByCategory = async (category) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Ошибка при запросе:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Загрузка...</div>;

    if (products.length === 0) {
    return (
        <div className={styles.category}>
            <h1 className={styles.category__title}>Категория: {displayName}</h1>
            <div className={styles.category__descr}>Товары не найдены</div>
        </div>
    );
    }

    return (
        <div className={styles.category}>
            <h1 className={styles.category__title}>Категория: {displayName}</h1>
            <div className={styles.category__container}>
                {products.map(item => (
                    <CardContent
                        key={item.id}
                        productId={item.id}
                        name = {item.name}
                        price = {item.price}
                        discountPrice = {item.discount_price}
                        imageUrl = {item.image_url}
                        rating = {item.rating}
                        discountPercent = {item.discount_percent}
                    />
                ))}
            </div>
        </div>
    )
}

export default CategoryPage