import React, {Component} from 'react'
import {connect} from 'react-redux'
import  {selectSegment, selectMotion, modifyMotion, modifySegment, selectPersona, modifyPersona,  exportedInfo,modifyIndex, deleteInfo, modifyDeleteRow, exportModelRowCount} from '../actions/index';
import { bindActionCreators } from "redux";

class ExportedNarrative extends Component{
	constructor(props){
			super(props)
			this.state = {

			}
	}
	componentWillMount(){
		this.props.exportedInfo(this.props.selections);
		window.scrollTo(0, 0);
  }
	refreshExportNarrative(){
		this.props.exportedInfo(this.props.selections);
	}
	deleteExportTable(campaign,table,status){
			this.props.modifyDeleteRow({table:[{campaign:campaign,table: table,status:status}]});
			this.props.deleteInfo(this.props.selections,() => {
	    this.props.exportedInfo(this.props.selections);
	});
}
closeExportModel(){
	    document.getElementById('exportedModal').classList.remove('activeModel');
}

	exportedNarrative(){
	 return this.props.exportedNarrative.map((data,index)=> {
		 		return(
					<div key={index} className="dispRow tr" >
						<div className="dispCol col-sn">
							{index+1}
						</div>
						<div className="dispCol col-campaign">
							{data[0]}
						</div>
						<div className="dispCol col-title">
							{data[1]}
						</div>
						<div className="dispCol col-status">
							{data[2]}
						</div>
						<div className="dispCol col-date">
							{data[3]}
						</div>
						<div className="dispCol col-action">
							<i className="glyphicon glyphicon-trash delete"  onClick={()=>this.deleteExportTable(data[0],data[1], data[2])}></i>
						</div>
					</div>

      );
  });
	}
// pagination
nextItemList(i){
	this.props.modifyIndex({index:i});
	this.props.exportedInfo(this.props.selections);
	let listId = `pagger_${i}`;
	// Remove active class from all page items
	let removeActive = document.getElementsByClassName("pagger");
	for (let k=0; k<removeActive.length; k++)
  {
			removeActive[k].classList.remove("activePage");
	}
	document.getElementById(listId).classList.add('activePage');
}
nextRows(next){
	let currentIndex =   document.getElementsByClassName('activePage')[0];
	currentIndex = currentIndex.getAttribute('data-Id');
	currentIndex = parseInt(currentIndex,10);
	let count = Math.ceil(parseFloat((this.props.exportModelRowCount)/5));
	if((currentIndex>=1) && (currentIndex <= count))
	{	// Next 5 items
		if(next === 'nextPage'){
			if(currentIndex < count){
				let nextIndex = (currentIndex+1);
				this.props.modifyIndex({index:nextIndex});
				this.props.exportedInfo(this.props.selections);
				let listId = `pagger_${nextIndex}`;
				// Remove active class from all page items
				let removeActive = document.getElementsByClassName("pagger");
				for (let k=0; k<removeActive.length; k++)
			  {
						removeActive[k].classList.remove("activePage");
				}
				document.getElementById(listId).classList.add('activePage');
 			}
		}
		else if(next === 'previousPage'){
			if(currentIndex > 1){
				let nextIndex = (currentIndex-1);
				this.props.modifyIndex({index:nextIndex});
				this.props.exportedInfo(this.props.selections);
				let listId = `pagger_${nextIndex}`;

				// Remove active class from all page items
				let removeActive = document.getElementsByClassName("pagger");
				for (let k=0; k<removeActive.length; k++)
			  {
						removeActive[k].classList.remove("activePage");
				}
				document.getElementById(listId).classList.add('activePage');
 			}
		}
	}

}
showpagination(){
	if(this.props.exportModelRowCount>5)
	{ let count = parseFloat((this.props.exportModelRowCount)/5);
		count = Math.ceil(count);
		var items = [];
		for(let i=1;(i<=count);i++)
		{		let listId = `pagger_${i}`;
				let activeIndex= '';
				if(i===1){
					activeIndex= 'activePage';
				}
				else{
					activeIndex= '';
				}
				items.push(<li key={listId} className={`pagger ${activeIndex}`} id={listId} data-Id={i} onClick= {()=>this.nextItemList(i)}><span >{i}</span></li>);
		}
		return(
			<nav aria-label="Page navigation" className="navigation">
				<ul className="pagination">
				<li onClick={()=>this.nextRows('previousPage')} id="previousPage" data-previousPage='0' >
					<span aria-label="Previous">
					<span aria-hidden="true">&laquo;</span>
					</span>
				</li>
				{items}
				<li onClick={()=>this.nextRows('nextPage')} id="nextPage" data-nextPage='0'>
					<span aria-label="Next">
					<span aria-hidden="true">&raquo;</span>
					</span>
				</li>
				</ul>
			</nav>
		)
	}
}

render(){
	return(
    <div>
			<div className="container-fluid exportNarr">
				<div className="row">
					<div className="col-sm-12">
						<div className="tab-content cisco-panel">
							<div className="row clearAll">
								<div className="col-xs-12 pad0">
									<div className="prevew">Export Narrative
										<div className="btnClose" onClick={()=>this.closeExportModel()}><div className="iconClose"><span>Close <i className="fa fa-times-circle"></i></span></div></div>
									</div>
								</div>
								<div className="col-xs-12">

									<div className="dispTable">
										{/* table Header */}
										<div className="dispRow th">
											<div className="dispCol col-sn">
												<i className="fa fa-hashtag" aria-hidden="true"></i>
											</div>
											<div className="dispCol col-campaign">
												<i className="fa fa-list" aria-hidden="true"></i> Campaign
											</div>
											<div className="dispCol col-title">
												<i className="fa fa-table" aria-hidden="true"></i> Table Name
											</div>
											<div className="dispCol col-status">
												<i className="fa fa-adjust" aria-hidden="true"></i> Status
											</div>
											<div className="dispCol col-date">
												<i className="fa fa-calendar-o" aria-hidden="true"></i> Request Date
											</div>
											<div className="dispCol col-action">
												<i className="fa fa-pencil-square-o" aria-hidden="true"></i> Action
											</div>
										</div>
										{/* Table rows */}
												{this.exportedNarrative()}

									</div>
									<div className="row">

										<div className="col-xs-6">
										<button className="mbtn btnType-save" onClick={()=>this.refreshExportNarrative()}><span className="btnLabel">Refresh</span><i className="fa fa-refresh btnPaddLeft" aria-hidden="true"> </i></button>
										</div>
										<div className="col-xs-6" style={{'display':'block'}}>
											{this.showpagination()}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

    </div>
    )
  	}
}
const mapStateToProps = (state, ownProps = {}) => {
	return {
		signInStatus : state.signInStatus,
    selections : state.globalSelection,
    campaignHomeStatus : state.campaignHomeStatus,
		exportedNarrative : state.exportedNarrative,
		exportModelRowCount:state.exportModelRowCount
  }
}
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({selectSegment: selectSegment, modifySegment:modifySegment,
                              selectPersona: selectPersona, modifyPersona: modifyPersona,
                              selectMotion : selectMotion, modifyMotion : modifyMotion,exportedInfo:exportedInfo, modifyIndex:modifyIndex, deleteInfo:deleteInfo,modifyDeleteRow:modifyDeleteRow}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportedNarrative);
