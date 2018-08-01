import React, {Component} from 'react'
import { Table } from 'react-bootstrap'
import {connect} from 'react-redux'
import { bindActionCreators } from "redux";
import '../style.css';
import {getCustomerData} from '../actions/index';

const theaders = (tabledata) => {
	return Object.keys(tabledata.data[0]).map(head => {
		return <th>{head}</th>
	});
}

const columns = (row) => {
	return Object.values(row).map(column => {
		return <td>{column}</td>
	});
}

const rows = (tabledata) => {
	return tabledata.data.map(row => {
		return <tr>{columns(row)}</tr>
	});
}


const TableDataPreviewComponent = ({ tabledata }) => (
    <div>
	    <div style={{'overflowX': 'auto'}}>
		    <Table striped bordered condensed hover>
			    <thead>
			      <tr>
				{theaders(tabledata)}
			      </tr>
			    </thead>
			    <tbody>
			      {rows(tabledata)}
			    </tbody>
			    
			    	
			    
		    </Table>
	    </div>

	    <button onClick={() => this.goPrevious()}>Previous</button>
	    <br></br>
	    <button onClick={() => this.goNext()}>Next</button>
	</div>
)




class TableDataPreview extends Component{
	constructor(props){
		super(props);
		this.state = {
			start_index: 1,
			limit: 5,
			// tabledata: {
			// total_no_rows: 1,
			// data: []
			// // data: [{ "column-1" : "1-1", "column-2": "1-2", "column-3" : "1-3" }]
			// }
	    };
	    let self = this;
		// this.props.getCustomerData(this.state.start_index,this.state.limit)
		// .then(res => {
		// 	let response = res.payload.data;
		// 	self.setState({tabledata: response.tabledata});
		// })
	}
	componentWillMount() {
      
        }

	goNext(){
		this.props.goNext();
		// this.setState({start_index: this.state.start_index+this.state.limit});
		// this.props.getCustomerData(this.state.start_index,this.state.limit)
		// .then(res => {
		// 	let response = res.payload.data;
		// 	this.setState({tabledata: response.tabledata});
		// })
	}

	goPrevious(){
		this.props.goPrevious();
		// if(this.state.start_index!=1){
		// 	this.setState({start_index: this.state.start_index-this.state.limit});
		// 	this.props.getCustomerData(this.state.start_index,this.state.limit)
		// 	.then(res => {
		// 		let response = res.payload.data;
		// 		this.setState({tabledata: response.tabledata});
		// 	})
		// }
	}
			
	render(){
		
		// return < TableDataPreviewComponent tabledata={this.state.tabledata} />

		return(
		<div>
		    <div style={{'overflowX': 'auto'}}>
				{(this.props.tabledata && this.props.tabledata.data && this.props.tabledata.data.length>0) ?    <Table striped bordered condensed hover>
					    <thead>
					      <tr>
						{theaders(this.props.tabledata)}
					      </tr>
					    </thead>
					    <tbody>
					      {rows(this.props.tabledata)}
					    </tbody>
					    
					    	
					    
				    </Table> : null}
		    </div>
		    <div className="mail-content">
			<button className="btn btn-lg btn-primary"
              style={{'marginBottom':'5px'}}
              type="button" onClick={() => this.goPrevious()}>Previous</button>
             &nbsp;&nbsp; 
			<button className="btn btn-lg btn-primary"
              style={{'marginBottom':'5px'}}
              type="button" onClick={() => this.goNext()}>Next</button>
              </div>
		</div>)
	}
	
	
	
}

const mapStateToProps = (state, ownProps = {}) => {
	return {	
		tabledata: state.customerData
	}
 }
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({getCustomerData: getCustomerData}, dispatch) 
}

export default connect(mapStateToProps, mapDispatchToProps)(TableDataPreview);
