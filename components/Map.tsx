import { Store } from '@boom-platform/globals';
import GoogleMapReact from 'google-map-react';
import supercluster from 'points-cluster';
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';

import { DefaultCoords } from '../constants';

interface MapProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

interface OptionProps {
  minZoom: number;
  maxZoom: number;
}

export interface MarkerProps {
  id: string;
  lat: number;
  lng: number;
  showtitle?: boolean;
}

type Props = {
  mapProps?: MapProps;
  options?: OptionProps;
  markers?: MarkerProps[];
  clusterRadius?: number;
  children?: (data: {
    id: string;
    numPoints: number;
    lat: number;
    lng: number;
    onMarkerClick: (id, flag) => void;
    onClusterClick: (props) => void;
    mid: string;
    showtitle: boolean;
    store: Store;
    points: [];
  }) => void;
};

/**
 * Generic Google Map that lets us cluster markers depending on zoom level
 */

let _map;

const Map: FunctionComponent<Props> = ({ mapProps, markers, options, clusterRadius, children }) => {
  const [theMapProps, setTheMapProps] = useState<MapProps>({});
  const [currentMarkers, setCurrentMarkers] = useState(markers);

  useEffect(() => {
    setTheMapProps({ ...mapProps });
  }, [mapProps]);

  useEffect(() => {
    setCurrentMarkers(markers);
  }, [markers]);

  const clusters = useMemo(() => {
    const getCluster = supercluster(currentMarkers, {
      minZoom: options?.minZoom, // min zoom to generate clusters on
      maxZoom: options?.maxZoom, // max zoom level to cluster the points on
      radius: clusterRadius, // cluster radius in pixels
    });
    return theMapProps.bounds
      ? getCluster?.(theMapProps).map(({ wx, wy, numPoints, points }) => ({
          lat: wy,
          lng: wx,
          text: numPoints,
          numPoints,
          id: `${numPoints}_${points[0].id}`,
          mid: points[0].id,
          points: points,
          showtitle: points[0].showtitle,
          store: points[0],
        }))
      : currentMarkers || [];
  }, [options, clusterRadius, currentMarkers, theMapProps]);

  const onMarkerClick = useCallback((id, flag) => {
    const index = parseInt(id);
    const newMarkers = currentMarkers;
    if (newMarkers?.[index]) {
      newMarkers[index].showtitle = flag === 0 ? true : false;
    }
    setCurrentMarkers(newMarkers);
  }, []);

  const onChange = ({ center, zoom, bounds }) => {
    setTheMapProps({ center, zoom, bounds });
  };

  const onLoad = (map) => {
    _map = map;
  };

  const onClusterClick = (props) => {
    const bounds = new google.maps.LatLngBounds();
    for (const i in props.points)
      bounds.extend(new google.maps.LatLng(props.points[i].lat, props.points[i].lng));
    _map.fitBounds(bounds);
  };

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.NEXT_GOOGLE_MAPS_API_KEY ?? '' }}
      center={theMapProps.center}
      zoom={theMapProps.zoom}
      onChange={onChange}
      onGoogleApiLoaded={({ map }) => onLoad(map)}
    >
      {clusters.map(({ id, mid, numPoints, lat, lng, showtitle, store, points }) =>
        children?.({
          id,
          mid,
          numPoints,
          lat,
          lng,
          onMarkerClick,
          onClusterClick,
          showtitle,
          store,
          points,
        })
      )}
    </GoogleMapReact>
  );
};

Map.defaultProps = {
  mapProps: {
    center: {
      lat: DefaultCoords.LAT,
      lng: DefaultCoords.LNG,
    },
    zoom: 11,
    bounds: undefined,
  },
  options: {
    minZoom: 3,
    maxZoom: 15,
  },
  clusterRadius: 60,
  markers: [],
} as Partial<Props>;

export default Map;

export const SimpleMarker = (props: any) => {
  return (
    <div style={{ transform: 'translate(-18px, -40px)' }}>
      <img width='36px' height='auto' src='/images/map-icon-listed.png' alt='Simple map marker' />
    </div>
  );
};
