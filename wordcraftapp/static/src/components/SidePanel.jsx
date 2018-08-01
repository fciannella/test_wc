import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectSegment, selectMotion, modifySegment, selectPersona,
         modifyNewSegment, addSegment, modifyDeleteSegment, deleteSegment, getSegment,
         addRule, getNarrative,  selectFeature} from "../actions/index";
import _ from 'lodash';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    borderColor           : '#6e93fb'
  }
};

class SidePanel extends Component{
  constructor(props){
    super(props);
    this.state = {
      newSegment : '',
      modalIsOpenNewSegment : false,
      modalIsOpenDeleteSegment : false,
      messageModal : 'Please enter a valid name',
      segments: []
    }
  }

  componentWillMount() {
    this.props.getSegment(this.props.selections);
    this.props.selectSegment();
  }

  closeModal() {
    this.setState({modalIsOpenNewSegment: false, modalIsOpenDeleteSegment: false});
  }


  addNewSegment() {
    if(this.state.newSegment === ""){
      this.setState({messageModal : 'Please enter a valid name'});
      this.setState({modalIsOpenNewSegment:true});
    }else if (_.findIndex(this.props.segments, {'segment':this.state.newSegment}) !== -1) {
      this.setState({messageModal : 'Entered name already exists'});
      this.setState({modalIsOpenNewSegment:true});
    }else{
       this.props.modifyNewSegment({"newSegment":this.state.newSegment});
       this.props.addSegment(this.props.selections, () => {
       this.props.getSegment(this.props.selections);
       });
    }
  }


  deleteSegment(segment){
    this.props.modifyDeleteSegment(segment);
    this.setState({modalIsOpenDeleteSegment : true});
  }


  deleteSegmentModal(){
    this.props.deleteSegment(this.props.selections, () => {
      this.props.modifySegment({'segment':''});
      this.props.selectSegment(this.props.selections);
      this.setState({modalIsOpenDeleteSegment : false})
      this.props.getSegment(this.props.selections);
    });
  }



  onSegmentSelect(segment){
    this.props.modifySegment(segment);
    this.props.selectSegment();
    this.props.selectMotion(this.props.selections);
    this.props.selectPersona(this.props.selections);
    this.props.selectFeature(this.props.selections);
    this.props.addRule(this.props.selections);
    this.props.getNarrative(this.props.selections);

    const sideLineItems = document.getElementsByName("sideLi");

    Array.prototype.map.call( sideLineItems, function(sideli){
        if(sideli.id === `${segment.segment}`){
          sideli.className = "active"
        }else{
          sideli.className = ""
        }
      });
  }



  renderList() {
    return this.props.segments.map(segment => {
      return (
        <li
          name="sideLi"
          id={segment.segment}
          key={segment.segment}
          onClick={() => this.onSegmentSelect(segment)}
        >
          <a><span>{segment.segment}</span><span className="" onClick={() => this.deleteSegment(segment)}><i className="glyphicon glyphicon-trash cflt"></i></span></a>
        </li>
      );
    });
  }


  render() {
    return (
      <div>

      <ul className="nav nav-sidebar cisco-sidebar">
        {this.renderList()}
      </ul>
        <div className="form-group form-inline">
        <input
          id = "inputbox"
          className='form-control'
          type="text"
          style={{'marginRight': '3px', 'width' : '71.5%'}}
          placeholder="New Campaign"
          onChange={event => this.setState({newSegment: event.target.value})}
        />
        <li
          className="form-control"
        >
        <a><i className="glyphicon glyphicon-plus cflt" onClick={() => this.addNewSegment()}></i></a>
        </li>
        </div>
        <Modal
          isOpen={this.state.modalIsOpenNewSegment}
          contentLabel="Information"
          style={customStyles}
        >
          <div style={{'marginBottom':'10px'}}><text>{this.state.messageModal}</text></div>
          <center><button className="btn btn-secondary"
                  style={{'marginLeft':'10px'}}
                  onClick={() => this.closeModal()}>close</button></center>
        </Modal>

        <Modal
          isOpen={this.state.modalIsOpenDeleteSegment}
          contentLabel="Information"
          style={customStyles}
        >
          <div style={{'marginBottom':'10px'}}><text>Are you sure you want to delete?</text></div>
          <center>
            <button className="btn btn-secondary"
                  style={{'marginLeft':'10px'}}
                  onClick={() => this.deleteSegmentModal()}>Delete</button>
            <button className="btn btn-secondary"
                  style={{'marginLeft':'10px'}}
                  onClick={() => this.closeModal()}>close</button>
          </center>
        </Modal>

      </div>

    );
  }
}


function mapStateToProps(state) {
  return {
    segments: state.segments,
    selections: state.globalSelection,
    initialState: state.getInitialState
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectSegment: selectSegment, modifySegment:modifySegment,
                              selectPersona: selectPersona,
                              modifyNewSegment : modifyNewSegment, addSegment : addSegment,
                              selectMotion : selectMotion, modifyDeleteSegment:modifyDeleteSegment,
                              deleteSegment : deleteSegment, getSegment : getSegment,
                              addRule : addRule, getNarrative: getNarrative,
                              selectFeature : selectFeature}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(SidePanel);
