import React, { useEffect, useState } from 'react'
import styles from './PageList.module.scss'
function PageList({productsProps, totalProduct, currentPage, productsPerPage, onPageChange}) {
    const totalPerPages = Math.ceil(totalProduct / productsPerPage)

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPerPages) {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const goToNextPage = () => goToPage(currentPage + 1)
    const goToPrevPage = () => goToPage(currentPage - 1)

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        

        let startPage = Math.max(1,currentPage - Math.floor(maxVisiblePages/2))
        let endPage = Math.min(totalPerPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1,endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }
    
    if (totalProduct === 0) {
        return <div className={styles.noProduct}>Список пуст...</div>
    }

    if (totalPerPages <= 1) {
        return null; 
    }

  return (
    <div className={`${styles['page-list']}`}>
        <button className={`${currentPage === 1 ? styles['page-list__btn_disabled'] : styles['page-list__btn']}`}
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M15.3536 5.64645C15.5488 5.84171 15.5488 6.15829 15.3536 6.35355L9.70711 12L15.3536 17.6464C15.5488 17.8417 15.5488 18.1583 15.3536 18.3536C15.1583 18.5488 14.8417 18.5488 14.6464 18.3536L8.64645 12.3536C8.45118 12.1583 8.45118 11.8417 8.64645 11.6464L14.6464 5.64645C14.8417 5.45118 15.1583 5.45118 15.3536 5.64645Z" fill="#414141"/>
            </svg>
        </button>
        <div className={`${styles['page-list__container_numbers']}`}>
            {getPageNumbers().map(page =>(
                <button className={`${styles['page-list__page_btn']} ${currentPage === page ? styles['page-list__page_active'] : ''}`}
                key={page}
                onClick={()=>{goToPage(page)}}
                >
                    {page}
                </button>
            ))}
        </div>
        <button className={`${currentPage === totalPerPages ? styles['page-list__btn_disabled'] : styles['page-list__btn']}`}
        onClick={goToNextPage}
        disabled={currentPage === totalPerPages}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.64645 5.64645C8.84171 5.45118 9.15829 5.45118 9.35355 5.64645L15.3536 11.6464C15.5488 11.8417 15.5488 12.1583 15.3536 12.3536L9.35355 18.3536C9.15829 18.5488 8.84171 18.5488 8.64645 18.3536C8.45118 18.1583 8.45118 17.8417 8.64645 17.6464L14.2929 12L8.64645 6.35355C8.45118 6.15829 8.45118 5.84171 8.64645 5.64645Z" fill="#414141"/>
            </svg>
        </button>
    </div>
  )
}

export default PageList