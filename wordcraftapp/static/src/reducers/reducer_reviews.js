import { GET_REVIEW_CONTENT, RESET_REVIEW_DATA} from '../constants';

export default function(state = {html:[],narrative:[],roles:[],comments:[],status:[],profiles:[],message:"",languages:[], columnNames:[]}, action) {
    let reviews = {html:[],narrative:[],roles:[],comments:[],status:[],profiles:[],message:"",languages:[], columnNames:[]};

    switch (action.type) {
      case GET_REVIEW_CONTENT:
          reviews = action.payload.data;
          return reviews;
      case RESET_REVIEW_DATA:
          reviews = {html:[],narrative:[],roles:[],comments:[],status:[],profiles:[],message:"",languages:[], columnNames:[]};
          return reviews;

      default:
        return state;
      }
}
