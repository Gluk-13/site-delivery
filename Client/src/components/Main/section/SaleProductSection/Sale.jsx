import React, {useState, useEffect} from 'react'
import styles from './Sale.module.scss'
import ContentTitle from '../components/ContentTitle/ContentTitle'
import CardContent from '../components/CardContent/CardContent'
//Подключаем все нужные библиотеки и компоненты

function Sale () { 
  const [products, setProducts] = useState ([]); 
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null); //Создаем хуки для рендеринга компонентов


  const fetchDiscountedProducts = async () => { // Функция для API запроса на сервер
    try {
      setLoading(true); //Крутим загрузку пока не придет ответ или не получим ошибку
      setError(null);

      const response = await fetch('http://localhost:4200/api/products/discounted'); //Путь к роутеру который создал на сервере
      console.log(response.status,response.statusText)

      if (!response.ok) { //Раньше ни разу не видел но эта запись для response типо вычисляет диапозон 200-299 true а дальше false, ну а 
      // "!" знак для того чтобы цикл выполнился при ошибке
        throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
      }

      const result = await response.json(); //распарсить в JSON чтобы можно было передать карточке эти значения
      console.log('📦 Полные данные от сервера:', result);
      if (result.success && result.data) { // тоже не сразу понял как работает, по сути это доп проверка на формат в котором мне придет файл 
        // если success: false ,значит на сервере он уже не прошёл проверку и был отправлен сюда с неправильным форматом
        // и чтобы мы не пытались вставить в карточку то чего нет мы это и проверяем, а result.data это проверка на то что файлы там есть, а значит 
        // его значение будет true
        setProducts(result.data); // передаем для перерисовки карточки данные
      } else { // обработка ответа если формат не верный то:
        throw new Error('Неверный формат ответа');
      }

      

    } catch (err) { 
      setError(err.message);
      console.error('Ошибка загрузки', err); // Обработка ошибок, ошибка загрузки и ошибка которую мы обработали выше
    } finally { // тоже не знал про такую возможность, выполняется в любом случае в конце функции не важно были или не было ошибок
      setLoading(false); //отчистка от плашки загрузки
    }
  }
  
  useEffect(()=>{
    fetchDiscountedProducts(); // при монтировании компонента, юзер зашел на страницу 
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
    <section className={styles.sale}>
      <ContentTitle
        titleText='Акции'
        buttonText='Все акции'
      />
      <div className={styles.sale__container_content}>
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

export default Sale