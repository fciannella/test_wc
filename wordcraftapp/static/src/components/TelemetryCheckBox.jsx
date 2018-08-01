import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectFeature, modifyFeature, modifyNewFeature, addFeature,selectPersona,
         modifyDeleteFeature, deleteFeature, getAllFilters, getMapping } from "../actions/index";
import Modal from 'react-modal';
import _ from 'lodash';

class TelemetryCheckBox extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }

  selectFeature(feature){
    this.props.modifyFeature(feature);
  }

  deleteFeature(){
    this.props.deleteFeature(this.props.selections,() => {
      this.props.getAllFilters(this.props.selections);
      this.props.getMapping(this.props.selections);
      this.buttonElement.click();
    });

  }

  modifydeleteFeature(feature){
    this.props.modifyDeleteFeature({deleteFeature:feature.feature});
    document.getElementById("proDeleteFeature").style.paddingTop = "160px";
  }

  renderList() {
    console.log("My Features", this.props.features);
    return this.props.features.map(feature => {
      return (
        <div  key={`${this.props.selections.persona}${feature.feature}${Math.random()}`} className="checkbox  cisco-checkbox ">
            <label><input type="checkbox" name="feature" value="" onClick={() => this.selectFeature(feature)}/>{feature.feature}</label>
            <span className="" onClick={() => this.modifydeleteFeature(feature)}><a><i className="glyphicon glyphicon-trash cflt" data-toggle="modal" data-target="#proDeleteFeature"></i></a></span>
        </div>
      );
    });
  }


  render() {
    return (
    <div>
      <div className="panel panel-primary">
          <div className="panel-heading">
              <h3 className="panel-title">Features</h3>
          </div>
          <div className="scroll-bar-panel">
              <div className="panel-body nopadding-t-b">
                {this.renderList()}
              </div>
          </div>
      </div>

      <div className="modal fade" id="proDeleteFeature" tabindex="-1" role="dialog">
        <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="proModel modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true"></i></span></button>
          <h4 className="modal-title"><i className="fa fa-trash" aria-hidden="true"> </i> Delete Feature</h4>
          </div>
          <div className="modal-body">
          <form>
            <div className="form-group">
            <label className="control-label">Are you sure you want to delete the Feature?</label>
            </div>
          </form>
          </div>
          <div className="proModel modal-footer clear">
          <button type="button" className="btn btn-default proBtnCancel" data-dismiss="modal" ref={buttonexit => this.buttonElement = buttonexit}><i className="fa fa-times proUpdate" aria-hidden="true"></i> Cancel</button>
          <button type="button" className="btn btn-primary proBtnSave" onClick={() => this.deleteFeature()}>Delete <i className="fa fa-long-arrow-right proUpdate" aria-hidden="true"></i> </button>
          </div>
        </div>
        </div>
      </div>

    </div>

    );
  }
}


function mapStateToProps(state) {
  return {
    features: state.features,
    selections: state.globalSelection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectFeature: selectFeature, modifyFeature: modifyFeature,
                            modifyNewFeature: modifyNewFeature, addFeature: addFeature,
                            selectPersona: selectPersona, modifyDeleteFeature : modifyDeleteFeature,
                            deleteFeature : deleteFeature, getAllFilters : getAllFilters, getMapping:getMapping }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(TelemetryCheckBox);
