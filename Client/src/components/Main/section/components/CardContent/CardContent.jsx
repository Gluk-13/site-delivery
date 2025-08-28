import React from 'react'
import styles from './CardContent.module.scss'



function CardContent({ name, price, discountPrice, imageUrl, rating, discountPercent }) {
    const percentFloor = Math.floor(discountPercent)
    function CalcStars (rating) {
        const stars = [];
        const fullStars = Math.floor(rating)

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push( <div key={i} className={styles.card__star_svg}>
                                <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.10326 0.816985C6.47008 0.0737389 7.52992 0.0737404 7.89674 0.816986L9.11847 3.29249C9.26413 3.58763 9.5457 3.7922 9.87141 3.83953L12.6033 4.2365C13.4235 4.35568 13.751 5.36365 13.1575 5.94219L11.1807 7.8691C10.945 8.09884 10.8375 8.42984 10.8931 8.75423L11.3598 11.4751C11.4999 12.292 10.6424 12.9149 9.90881 12.5293L7.46534 11.2446C7.17402 11.0915 6.82598 11.0915 6.53466 11.2446L4.09119 12.5293C3.35756 12.9149 2.50013 12.292 2.64024 11.4751L3.1069 8.75423C3.16254 8.42984 3.05499 8.09884 2.81931 7.8691L0.842496 5.94219C0.248979 5.36365 0.576491 4.35568 1.39671 4.2365L4.12859 3.83953C4.4543 3.7922 4.73587 3.58763 4.88153 3.29249L6.10326 0.816985Z" fill="#FF6633"/>
                                </svg>
                            </div>);
            } else {
                    stars.push( <div key={i} className={styles.card__star_svg}>
                                    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.10326 0.816985C6.47008 0.0737389 7.52992 0.0737404 7.89674 0.816986L9.11847 3.29249C9.26413 3.58763 9.5457 3.7922 9.87141 3.83953L12.6033 4.2365C13.4235 4.35568 13.751 5.36365 13.1575 5.94219L11.1807 7.8691C10.945 8.09884 10.8375 8.42984 10.8931 8.75423L11.3598 11.4751C11.4999 12.292 10.6424 12.9149 9.90881 12.5293L7.46534 11.2446C7.17402 11.0915 6.82598 11.0915 6.53466 11.2446L4.09119 12.5293C3.35756 12.9149 2.50013 12.292 2.64024 11.4751L3.1069 8.75423C3.16254 8.42984 3.05499 8.09884 2.81931 7.8691L0.842496 5.94219C0.248979 5.36365 0.576491 4.35568 1.39671 4.2365L4.12859 3.83953C4.4543 3.7922 4.73587 3.58763 4.88153 3.29249L6.10326 0.816985Z" fill="#BFBFBF"/>
                                    </svg>
                                </div>);
            }
        }
        
        return stars;
    }

  return (
    <div className={styles.card}>
        <div className={styles.card__container_img} style={{
            backgroundImage:`url('http://localhost:4200/api/uploads/${imageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
        onError={(e) => {
            e.target.style.backgroundImage = "url('/default-image.jpg')";
        }}
        >
            <div className={styles.card__svg_favorite}>
                <div className={styles.card__container_svg}>
                    <svg className={styles.svg__favorite} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.7046 4.25644C13.8299 3.13067 15.3564 2.49817 16.9482 2.49817C18.5399 2.49817 
                        20.0664 3.13063 21.1916 4.25636C22.3174 5.38164 22.95 6.90829 22.95 8.49999C22.95 10.0917 22.3175 11.6183 21.1917 12.7435C21.1917 12.7436 
                        21.1917 12.7435 21.1917 12.7435L12.3517 21.5835C12.1565 21.7788 11.8399 21.7788 11.6446 21.5835L2.80461 12.7435C0.460963 10.3999 0.460963 
                        6.60009 2.80461 4.25644C5.14826 1.91279 8.94807 1.91279 11.2917 4.25644L11.9982 4.96289L12.7046 4.25644C12.7046 4.25641 12.7046 4.25647 12.7046 4.25644ZM16.9482 
                        3.49817C15.6217 3.49817 14.3496 4.02528 13.4118 4.96346L12.3517 6.02355C12.258 6.11732 12.1308 6.16999 11.9982 6.16999C11.8656 6.16999 11.7384 
                        6.11732 11.6446 6.02355L10.5846 4.96355C8.63149 3.01042 5.46484 3.01042 3.51172 4.96355C1.55859 6.91667 1.55859 10.0833 3.51172 12.0364L11.9982 
                        20.5229L20.4846 12.0364C21.4228 11.0987 21.95 9.82648 21.95 8.49999C21.95 7.17351 21.4229 5.90138 20.4847 4.96363C19.5469 4.02544 18.2747 3.49817 
                        16.9482 3.49817Z" fill="#414141"/>
                    </svg>
                </div>
                {discountPercent && (
                <div className={styles.card__sale_info}>
                    <p className={styles.card__sale_descr}>-{percentFloor}%</p>
                </div>)
                }
            </div>
        </div>
        <div className={styles.card__container_content}>
            <div className={styles.card__price_info}>
                <div className={styles.card__price_new}>
                    <h1 className={`${styles.card__price_title} ${styles.card__newPrice_title}`}>{discountPrice}₽</h1>
                    <p className={styles.card__price_subtitle}>С картой</p>
                </div>
                <div className={styles.card__price_old}>
                    <h1 className={styles.card__price_title}>{price}₽</h1>
                    <p className={styles.card__price_subtitle}>Обычная</p>
                </div>
            </div>
            <div className={styles.card__info_product}>
                <p className={styles.card__info_descr}>{name}</p>
            </div>
            <div className={styles.card__score_product}>
                {CalcStars(rating)}
            </div>
            <button className={styles.card__bascket_btn}>В корзину</button>
        </div>
    </div>
  )
}

export default CardContent