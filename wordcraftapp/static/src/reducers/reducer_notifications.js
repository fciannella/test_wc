import { GET_NOTIFICATION_DATA } from '../constants';

export default function(state ={data:[],nrow:0,count:0} , action) {
    let notifications = {data:[],nrow:0,count:0};
    switch (action.type) {
      case GET_NOTIFICATION_DATA:
          notifications = action.payload.data;
          return notifications;
      default:
        return state;
      }
}
