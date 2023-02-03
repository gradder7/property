import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
function ListingLocation({ geolocation, address }) {
  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      //lat and lng to center
      center={[geolocation.latitude, geolocation.longitude]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
      />

      <Marker position={[geolocation.latitude, geolocation.longitude]}>
        <Popup>{address}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default ListingLocation;
