import React, { useState, useRef } from 'react'
import styles from "./Cataloge.module.scss"
import { Link } from 'react-router-dom'

function Cataloge() {

  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef()

  const hundleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setIsOpen(true)
  } 

  const hundleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 300)
  }

  const firstCategories = [
    {id: 1, name: 'Молоко, сыр, яйцо', link: '/cataloge/dairy-eggs'},
    {id: 2, name: 'Хлеб', link: '/cataloge/bread', },
    {id: 3, name: 'Кондитерские изделия', link: '/cataloge/confectionery'},
    {id: 4, name: 'Фрукты и овощи', link: '/cataloge/fruits-vegetables'}
  ]

  const secondCategories = [
    {id: 5, name: 'Напитки', link: '/cataloge/beverages'},
    {id: 6, name: 'Чай, кофе', link: '/cataloge/tea-coffee'},
    {id: 7, name: 'Сладкое', link: '/cataloge/sweets'},
  ]

  const thirdCategories = [
    {id: 8, name: 'Бакалея', link: '/cataloge/groceries'},
    {id: 9, name: 'Морепродукты', link: '/cataloge/seafood'},
    {id: 10, name: 'Мясо', link: '/cataloge/meat'}
  ]

  const fourCategories = [
    {id: 11, name: 'Детское питание', link: '/cataloge/baby-food'},
    {id: 12, name: 'Зоотовары', link: '/cataloge/pet-supplies'},
    {id: 13, name: 'Непродовольственные товары', link: '/cataloge/non-food'},
  ]

  return (
    <div className={styles.cataloge}>
      <button className={styles.cataloge__btn}
        onClick={()=>setIsOpen(!isOpen)}
      >
        <svg className={styles.cataloge__svg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.5 12C2.5 11.7239 2.72386 11.5 3 11.5H21C21.2761 11.5 21.5 11.7239 21.5 12C21.5 12.2761 21.2761 12.5 21 12.5H3C2.72386 12.5 2.5 12.2761 2.5 12Z" fill="black"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M2.5 6C2.5 5.72386 2.72386 5.5 3 5.5H21C21.2761 5.5 21.5 5.72386 21.5 6C21.5 6.27614 21.2761 6.5 21 6.5H3C2.72386 6.5 2.5 6.27614 2.5 6Z" fill="black"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M2.5 18C2.5 17.7239 2.72386 17.5 3 17.5H21C21.2761 17.5 21.5 17.7239 21.5 18C21.5 18.2761 21.2761 18.5 21 18.5H3C2.72386 18.5 2.5 18.2761 2.5 18Z" fill="black"/>
        </svg>        
      </button>
      <Link to='/cataloge' className={styles.cataloge__link}>
          <p className={styles.cataloge__descr}>Каталог</p>
      </Link>
      {isOpen && (
        <div 
          className={styles[`cataloge__drop-menu`]}
          onMouseEnter={hundleMouseEnter}
          onMouseLeave={hundleMouseLeave}
        >
          <nav className={styles[`cataloge__drop-menu_container`]}>
            <ul className={styles[`cataloge__drop-menu_column`]}>
              {firstCategories.map(item=>(
                <Link to={item.link} className={styles[`cataloge__drop-menu_link`]} key={item.id}>
                  {item.name}
                </Link>
              ))}
            </ul>
            <ul className={styles[`cataloge__drop-menu_column`]}>
              {secondCategories.map(item=>(
                <Link to={item.link} className={styles[`cataloge__drop-menu_link`]} key={item.id}>
                  {item.name}
                </Link>
              ))}
            </ul>
            <ul className={styles[`cataloge__drop-menu_column`]}>
              {thirdCategories.map(item=>(
                <Link to={item.link} className={styles[`cataloge__drop-menu_link`]} key={item.id}>
                  {item.name}
                </Link>
              ))}
            </ul>
            <ul className={styles[`cataloge__drop-menu_column`]}>
              {fourCategories.map(item=>(
                <Link to={item.link} className={styles[`cataloge__drop-menu_link`]} key={item.id}>
                  {item.name}
                </Link>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}

export default Cataloge