import React,{useState, useEffect} from 'react'
import styles from './DeliveryForm.module.scss'

function DeliveryForm({ onSubmit, onValidationChange, onDataChange }) {
  const [selectedTime, setSelectedTime] = useState('');
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [address, setAddress] = useState({
    city: '',
    street: '',
    house: '',
    apartment: '',
  });

  const [comment, setComment] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 250;
  const cities = [
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
    'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
    'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград'
  ];
  
  useEffect(() => {
    const isValid = address.city && address.street && address.house;
    onValidationChange(isValid);
    onDataChange({
      ...address,
      deliveryTime: selectedTime,
      comment: comment
    });
  }, [address, selectedTime, comment]);

  const handleChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setComment(value);
      setCharCount(value.length);
    }
  };

  const timeSlots = [
    { time: '10:00 - 12:00', available: true },
    { time: '12:00 - 14:00', available: true }, 
    { time: '14:00 - 16:00', available: false, reason: 'В это время доставка невозможна' },
    { time: '16:00 - 18:00', available: true }
  ];

  return (
    <div className={styles.delivery__container}>
      <div className={styles.delivery__container_location}>
        <h1 className={styles.delivery__title}>
          Куда
        </h1>
        <form className={styles.delivery__container_form}
        >
          <div className={styles.delivery__field}>
            <label className={styles.delivery__label}>Город</label>
            <select 
              value={address.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
            >
              <option className={styles.delivery__input} value="">Выберите город</option>
              {cities.map(city => (
                <option className={styles.delivery__input} key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className={styles.delivery__field}>
            <label className={styles.delivery__label}>Улица</label>
            <input
              className={styles.delivery__input}
              type="text"
              maxLength={20}
              value={address.street}
              onChange={(e) => handleChange('street', e.target.value)}
              required
            />
          </div>
          <div className={styles.delivery__field}>
            <label className={styles.delivery__label}>Дом</label>
            <input
              className={styles.delivery__input}
              type="number"
              value={address.house}
              onChange={(e) => handleChange('house', e.target.value)}
              required
            />
          </div>
          <div className={styles.delivery__field}>
            <label className={styles.delivery__label}>Квартира</label>
            <input
              className={styles.delivery__input}
              type="number"
              value={address.apartment}
              onChange={(e) => handleChange('apartment', e.target.value)}
            />
          </div>

        </form>
      </div>
      <div className={styles.delivery__container_location}>
        <h1 className={styles.delivery__title}>
          Когда
        </h1>
        <div className={styles.delivery__container_form}>
              <div className={styles.delivery__container_data}>
                {timeSlots.map(slot => (
                  <div 
                    key={slot.time}
                    className={styles.delivery__container_btn}
                    onMouseEnter={() => setHoveredSlot(slot.time)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    >
                    <button
                      type="button"
                      className={`${styles.delivery__btn} ${
                        selectedTime === slot.time ? styles.delivery__btn_active : ''
                      } ${!slot.available ? styles.delivery__btn_disabled : ''}`}
                      onClick={() =>  slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </button>
                    {!slot.available && hoveredSlot === slot.time && (
                      <div className={styles.delivery__btn_tooltip}>
                        {slot.reason}
                      </div>
                    )}
                  </div>))}
              </div>
        </div>
      </div>
      <div className={styles.delivery__container_location}>
        <h1 className={styles.delivery__title}>
          Описание
        </h1>
        <div className={styles.delivery__container_desc}>
          <label>Комментарий для курьера</label>
          <textarea
            className={styles.delivery__descr}
            value={comment}
            onChange={handleCommentChange}
            rows={3}
          />
          <div className={styles.charCounter}>
            {charCount}/{maxChars}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryForm