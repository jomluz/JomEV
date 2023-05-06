import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { icon } from "leaflet";
import { useAccount } from "wagmi";

const ICON = icon({
  iconUrl: "/static/marker1.png",
  iconSize: [42, 42],
});

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker icon={ICON} position={position}>
      <Popup>
        <div className="text-white">You are here</div>
      </Popup>
    </Marker>
  );
}

const Map = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [account, setAccount] = useState("");

  useEffect(() => {
    setAccount(address);
    // console.log(latitude, longitude);
    // console.log(data);
    // mapToUserLocation.flyTo();
  }, [account]);
  return (
    <MapContainer
      style={{ height: 500, width: "100%" }}
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
      {/* here will be a loop to render all charging station, now only a demo */}
      <Marker icon={ICON} position={[51.505, -0.09]}>
        <Popup>
          <div className="flex">
            <div>
              <img src="/static/location.png" alt="" className="w-[60px]" />
            </div>
            <div className="ml-3 text-white">
              <div className="no-margin">Station XXX</div>
              <p className="no-margin">Station details</p>
              <p className="no-margin text-justify">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Corrupti eligendi vel delectus ullam cupiditate necessitatibus
                est nam magnam numquam quae.
              </p>
              {address ? (
                <div className="font-bold cursor-pointer mt-3 bg-red-300 w-fit px-4 py-1 rounded bg-[#4caf50]">
                  Book
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
