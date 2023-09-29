import React, { useEffect, useRef } from "react";
import H from '@here/maps-api-for-javascript'

const getMarkerIcon = (color) => {
    const svgCircle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="marker">
    <circle cx="10" cy="10" r="7" fill="${color}" stroke="${color}" stroke-width="4" />
    </g></svg>`;

    return new H.map.Icon(svgCircle, {
        anchor: {
            x: 3,
            y: 3
        }
    })
}

const calculateRoute = (platform, map, start, destination) => {
    const routeResponseHandler = (response) => {
        const sections = response.routes[0].sections;
        const lineStrings = [];
        sections.forEach(
            (section) => {
                lineStrings.push(H.geo.LineString.fromFlexiblePolyline(section.polyline));
            }
        );
        const multiLineString = new H.geo.MultiLineString(lineStrings);
        const bounds = multiLineString.getBoundingBox();
        // Create the polyline for the route
        const routePolyline = new H.map.Polyline(multiLineString, {
            style: {
                lineWidth: 5
            }
        });

        // Remove all the previous map objects, if any
        map.removeObjects(map.getObjects());

        // Add the polyline to the map
        map.addObject(routePolyline);
        map.addObjects([
            // Add a marker for the user
            new H.map.Marker(start, {
                icon: getMarkerIcon('red')
            }),
            // Add a marker for the selected restaurant
            new H.map.Marker(destination, {
                icon: getMarkerIcon('green')
            })
        ])
    };


    // Get an instance of the H.service.RoutingService8 service
    const router = platform.getRoutingService(null, 8);

    // Define the routing service parameters
    const routingParams = {
        'origin': `${start.lat},${start.lng}`,
        'destination': `${destination.lat},${destination.lng}`,
        'transportMode': 'car',
        'return': 'polyline'
    };
    // Call the routing service with the defined parameters
    router.calculateRoute(routingParams, routeResponseHandler, console.error);
}


const Map = (props) => {
    const mapRef = useRef(null);
    const map = useRef(null);
    const platform = useRef(null);
    const { apikey, userPosition, restaurantPosition } = props;

    const makeNewMap = () => {
        platform.current = new H.service.Platform({ apikey });

        const rasterTileService = platform.current.getRasterTileService(
            {
                queryParams: {
                    style: "explore.day",
                    size: 512,
                },
            }
        );

        const rasterTileProvider = new H.service.rasterTile.Provider(
            rasterTileService
        );

        const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider);

        // const defaultCenter = { lat: 17.5449, lng: 78.5718 }
        const newMap = new H.Map(mapRef.current, rasterTileLayer, {
            pixelRatio: window.devicePixelRatio,
            center: userPosition,
            zoom: 14,
        })

        const behaviour = new H.mapevents.Behavior(
            new H.mapevents.MapEvents(newMap)
        );

        newMap.addObjects([
            // Add a marker for the user
            new H.map.Marker(props.userPosition, {
                icon: getMarkerIcon('red')
            })
        ]);

        map.current = newMap;


    };

    useEffect(
        () => {

            if (userPosition && restaurantPosition) {
                // makeNewMap()
                calculateRoute(platform.current, map.current, userPosition, restaurantPosition);
            }


            if (!map.current) {
                makeNewMap();
            }
        }
        , [apikey, userPosition, restaurantPosition]
    );

    return <div style={{ width: "100%", height: "500px" }} ref={mapRef} />;
}

export default Map;