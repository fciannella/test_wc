import { GET_ALLFILTERS } from '../constants';
export default function(state = [], action) {
    let offers = [];
    switch (action.type) {
      case GET_ALLFILTERS:
          action.payload.data.offers.map(offer => {
              offers = [...offers, {"offer":offer}];
          });
          return offers;
      default:
        return state;
      }
}
