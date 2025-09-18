import React, { useEffect, useState } from 'react'
import ContentTitle from '../components/ContentTitle/ContentTitle'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import styles from './MapSection.module.scss'



delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const stores = [
  {
    id: 1,
    name: 'Северяночка ТЦ',
    address: 'г.Радужный, 1 квартал, 45',
    position: [55.99572549982963, 40.33048514940367],
    worckingHours: '9:00-21:00',
    phone: '+7(900)451-21-12'
  },
  {
    id: 2,
    name: 'Северяночка',
    address: 'г.Радужный, 3 квартал, 32/2',
    position: [56.003546050044505, 40.3324293989142],
    worckingHours: '9:00-21:00',
    phone: '+7(900)451-21-12'
  }
]

function MapController ({ coords }) {
  const map = useMap();
  useEffect(() => {
  
    if (coords) {
      map.flyTo(coords, 16)
    }
  }, [coords, map]);

  return null;
}

function MapSection() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isClient, setIsClient] = useState(false)
  const [targetCoords, setTargetCoords] = useState(null)

  useEffect (() => {
    setIsClient(true);
  }, [])

  const centerOfMap = [55.999642, 40.331177];
  const zoomCenter = 14;

  return (
    <section className={styles.map}>
      <ContentTitle
        titleText='Наши магазины'
        isStaticComponent={true}
      />
      <div className={styles.map__content}>
        <div className={styles.map__container_btn}>
          {stores.map( btnLocation => (
            <button onClick={()=>{ setTargetCoords(btnLocation.position) }} key={btnLocation.id} className={styles.map__btn_store}>
              {btnLocation.address}
            </button>
          ))}
        </div>

        { isClient && (
        <MapContainer
          center={centerOfMap}
          zoom={zoomCenter}
          style={{height: '100%', width: '100%'}}
          zoomControl={true}
          scrollWheelZoom={true}
        >

          <MapController coords={targetCoords} />

          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
          />
          {stores.map( location =>(
            <Marker
              key={location.id}
              position={location.position}
              eventHandlers={{
                click: () => setSelectedLocation(location)
              }}
            >
              <Popup>
                <div>
                  <h3>{location.name}</h3>
                  <p>{location.address}</p>
                  <p>Координаты на карте: {location.position[0]}{location.position[1]}</p>
                  <p>Телефон: {location.phone}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        )}
      </div>
    </section>
  )
}

export default MapSection