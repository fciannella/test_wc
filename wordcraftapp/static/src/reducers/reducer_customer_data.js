import { GET_CUSTOMER_DATA } from '../constants';

export default function(state = [], action) {
    switch (action.type) {
      case GET_CUSTOMER_DATA:
          return action.payload.data.tabledata;
      default:
        return state;
      }
}
