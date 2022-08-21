<template>
  <div style="border-radius: 4px" id="map"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  name: "ComponentViewLocation",
  created() {
    setTimeout(() => {
      this.mapBoxInit();
      this.setServiceLocation(this.coordinates);
    }, 1000);
  },
  props: ["coordinates"],
  data() {
    return {
      map: {},
      marker: {},
    };
  },
  methods: {
    mapBoxInit() {
      mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-71.1802393, 18.9657173],
        zoom: 9,
      });
      this.addMapControls();
    },
    addMapControls() {
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );
    },
    addMarker() {
      this.marker = new mapboxgl.Marker({
        draggable: true,
      })
        .setLngLat([0, 0])
        .addTo(this.map);
    },
    setServiceLocation(lngLat) {
      let coordinates;
      if (lngLat.longitude) {
        coordinates = [lngLat.longitude, lngLat.latitude];
      } else {
        coordinates = lngLat.replace(" ", "").split(",");
        coordinates = coordinates.reverse();
      }
      // eslint-disable-next-line no-unused-vars
      var marker = new mapboxgl.Marker().setLngLat(coordinates).addTo(this.map);

      this.map.setCenter(coordinates);
      this.map.zoomTo(13);
    },
  },
};
</script>
<style lang="css">
@import "https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.0/mapbox-gl.css";
.mapboxgl-map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  left: 0;
}
</style>
