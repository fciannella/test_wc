import React, {Component} from 'react'
import { FormGroup,FormControl, Button, Form } from 'react-bootstrap'
import {connect} from 'react-redux'
import '../style.css';
import  {gettables , modifyDataset, getDataset, updateDataset} from '../actions/index';
import { bindActionCreators } from "redux";
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

const menuItems = (items) => {
    if(!items || !(items.constructor===Array)){
    	return;
    }
    return items.map((item, index) => {
        return <option key={index} value={item} > {item} </option>
    });
}

const DataSetDropDownComponent = ({ dataset,onSubmit }) => (
    <Form inline className="custom-form-inline"  onSubmit={onSubmit}>
        Please Select Dataset: &nbsp;&nbsp;
        <FormGroup controlId="formControlsSelect">
            <FormControl componentClass="select" placeholder="select" name="table">
        	 {menuItems(dataset)}
            </FormControl>
       </FormGroup>
       <Button type="submit" bsStyle="primary" className="form-submit-inline">Submit</Button>
    </Form>
)


class DataSetDropDown extends Component{

	constructor(props){
		super(props)
		this.state = {
			dataset: [],
      currentTable: "",
      modalIsOpen : false,
      messageModal : ""
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}
  componentWillReceiveProps(nextprops){
    console.log("prop",nextprops.dataset);
    this.setState({currentTable: nextprops.dataset});
  }

	componentWillMount() {
		this.props.gettables()
		.then(res => {
			let response = res.payload.data;
			this.setState({dataset: response['tables']});
		});
    this.props.modifyDataset({dataset:this.props.dataset});
    this.setState({currentTable: this.props.dataset});

    }

    closeModal() {
      this.setState({modalIsOpen: false});
    }

	handleSubmit(e){
    console.log("e",this.state.currentTable);
    if(this.props.selections.motion === "" | this.props.selections.segment === ""){
      this.setState({'messageModal': "Please select Campaign and Motion"});
      this.setState({'modalIsOpen':true});
    }else if (this.state.currentTable === null) {
      this.setState({'messageModal': "Please select a Dataset"});
      this.setState({'modalIsOpen':true})
    }else{
		this.props.modifyDataset({dataset:this.state.currentTable});
		this.props.onTableSubmit(this.state.currentTable);
    this.props.updateDataset(this.props.selections);
    this.props.getDataset(this.props.selections);
    }
	}

	selectTable(e){
		this.setState({currentTable: e.target.value});
	}

	render(){
		return(
    <div>
      <Form inline className="custom-form-inline">
	        Please Select Dataset: &nbsp;&nbsp;
	        <FormGroup controlId="formControlsSelect">
	            <FormControl componentClass="select" value={this.state.currentTable} placeholder="select" name="table" onChange={this.selectTable.bind(this)}>
              <option disabled selected>Select</option>
             {menuItems(this.state.dataset)}
	            </FormControl>
	       </FormGroup>
	       <Button type="button" onClick={this.handleSubmit} bsStyle="primary" className="form-submit-inline">Submit</Button>
	    </Form>
      <Modal
        isOpen={this.state.modalIsOpen}
        contentLabel="Information"
        style={customStyles}
      >
        <div style={{'marginBottom':'10px'}}><text>{this.state.messageModal}</text></div>
        <center><button className="btn btn-secondary"
                style={{'marginLeft':'10px'}}
                onClick={() => this.closeModal()}>close</button></center>
      </Modal>
    </div>
    )
  	}



}

const mapStateToProps = (state, ownProps = {}) => {
	return {
    selections : state.globalSelection,
    dataset : state.dataset
  }
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({gettables: gettables, modifyDataset : modifyDataset,
                             getDataset : getDataset, updateDataset : updateDataset}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DataSetDropDown);
