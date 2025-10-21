import React from 'react'
import Navlink from '../../../../../HomePage/section/components/Nav/NavComponentSection'
import style from './CatalogePage.module.scss'
import { Link, useNavigate } from 'react-router-dom'

const categories = [
  { id: 'dairy-eggs', name: 'Молоко, сыр, яйцо',size: 'medium', image: '/image/categories/dairy-eggs.jpg' },
  { id: 'bread', name: 'Хлеб и выпечка',size: 'small', image: '/image/categories/bread.jpg' },
  { id: 'confectionery', name: 'Кондитерские изделия',size: 'small', image: '/image/categories/confectionery.jpg' },
  { id: 'fruits-vegetables', name: 'Фрукты и овощи',size: 'small', image: '/image/categories/fruits-vegetables.jpg' },
  { id: 'beverages', name: 'Напитки',size: 'small', image: '/image/categories/beverages.jpg' },
  { id: 'tea-coffee', name: 'Чай, кофе',size: 'small', image: '/image/categories/tea-coffee.jpg' },
  { id: 'sweets', name: 'Сладкое',size: 'small', image: '/image/categories/sweets.jpg' },
  { id: 'groceries', name: 'Бакалея',size: 'small', image: '/image/categories/groceries.jpg' },
  { id: 'seafood', name: 'Морепродукты',size: 'small', image: '/image/categories/seafood.jpg' },
  { id: 'meat', name: 'Мясо',size: 'medium', image: '/image/categories/meat.jpg' },
  { id: 'baby-food', name: 'Детское питание',size: 'small', image: '/image/categories/baby-food.jpg' },
  { id: 'pet-supplies', name: 'Зоотовары',size: 'small', image: '/image/categories/pet-supplies.jpg' },
  { id: 'non-food', name: 'Непродовольственные товары',size: 'small', image: '/image/categories/non-food.jpg' },
]

function CatalogePage() {

    return (
        <section className={style.cataloge}>
            <Navlink
                primaryLink='Главная'
                secondLink='Каталог'
            />
            <h1 className={style.cataloge__title}>
                Каталог
            </h1>
            <div className={style.cataloge__grid}>
                {categories.map((category) => (
                    <Link to={`/cataloge/${category.id}`}
                        key={category.id}
                        className={`${style.cataloge__item} ${style[`cataloge__item_${category.size}`]}`}
                        >
                        <img src={category.image} alt="" className={style.cataloge__img} />
                        <h3 className={style.cataloge__name}>
                            {category.name}
                        </h3>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default CatalogePage