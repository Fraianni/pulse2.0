import { gql } from "@apollo/client";

// Query per ottenere le dimensioni della mappa
export const GET_MAP_DIMENSIONS = gql`
  query GetMap($mapId: Int!) {
    map(id: $mapId) {
      width
      height
    }
  }
`;


// Mutazione per aggiornare larghezza e altezza
export const UPDATE_MAP_DIMENSIONS = gql`
  mutation UpdateMap($mapId: Int!, $width: Float!, $height: Float!) {
    updateMap(id: $mapId, width: $width, height: $height) {
      map {
        width
        height
      }
    }
  }
`;
