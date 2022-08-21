<template>
  <div id="map"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  name: "locationPicker",
  props: {
    lngLat: {
      type: String,
      required: false,
    },
  },
  created() {
    setTimeout(() => {
      this.mapBoxInit();
      if (this.lngLat) {
        this.map.setCenter([
          this.lngLat.split(",")[1],
          this.lngLat.split(",")[0],
        ]);
      }
    }, 1000);
  },
  data() {
    return {
      map: {},
      marker: {},
      serviceLocation: "",
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
      this.addMarker();
      this.addMapEvents();
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
    addMapEvents() {
      this.marker.on("dragend", () => {
        this.setServiceLocation(this.marker.getLngLat());
      });
      this.map.on("moveend", () => {
        this.marker.setLngLat(this.map.getCenter());
        this.setServiceLocation(this.map.getCenter());
      });
    },
    setServiceLocation(lngLat) {
      this.$emit("location", { longitude: lngLat.lng, latitude: lngLat.lat });
      this.serviceLocation = lngLat;
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
