import { UPLOAD_DATA, RESET_DATA, UPLOAD_DATA_PROGRESS } from '../constants';

export default function(state = [], action) {
    let uploadData = {uploadData:''};

    switch (action.type) {
      case UPLOAD_DATA:
          console.log("DATA UPLOAD TABLE", action.payload.data);
          uploadData = action.payload.data;
          return uploadData;

      case UPLOAD_DATA_PROGRESS:
          console.log("UPLOAD_DATA_PROGRESS", action.payload.data);
          uploadData = action.payload.data;
          return uploadData;

      case RESET_DATA:
          uploadData = {uploadData:[]};
          return uploadData;

      default:
        return state;
      }
}
