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
import Link from "next/link";
import { IconButton, Icon } from "@chakra-ui/react";
import { BsCartCheck } from "react-icons/bs";

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

const Map = ({ data }) => {
  const { address, isConnecting, isDisconnected } = useAccount();

  // useEffect(() => {
  //   // console.log(data);
  //   // console.log(latitude, longitude);
  //   // console.log(data);
  //   // mapToUserLocation.flyTo();
  // }, [data]);
  return (
    <MapContainer
      style={{ height: "85vh", width: "100%" }}
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
      {data.map((item) => {
        // console.log("this is a market" + item);
        return (
          <Marker
            key={item.clientId}
            icon={ICON}
            position={[
              item.location.coordinates[1],
              item.location.coordinates[0],
            ]}
          >
            <Popup>
              <div className="flex">
                <div>
                  <img src="/static/location.png" alt="" className="w-[60px]" />
                </div>
                <div className="flex flex-col ml-3 text-white justify-center">
                  <div className="no-margin">{item.name}</div>
                  <p className="no-margin text-justify">
                    {item.physicalAddress}
                  </p>
                  {address ? (
                    <Link href={`/book/${item.clientId}`}>
                      <div className="font-bold cursor-pointer mt-3 w-fit px-4 py-1 rounded bg-[#4caf50]">
                        Book
                      </div>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {/* <Link href="/book/1">
                  <IconButton
                    colorScheme="orange"
                    aria-label="Book the charging connector"
                    icon={<Icon as={BsCartCheck} />}
                  />
                </Link> */}
                </div>
              </div>
            </Popup>
            ;
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
