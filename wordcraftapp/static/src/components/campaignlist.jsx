import React, { Component } from 'react';
import Header from './header';
import Footer from './Footer';
import { connect } from "react-redux";
import { getCampaignList, getUserSettings, modifyCampaign,modifyCampaignDescription, selectCampaign,addUserList,modifyCampaignHomeStatus,
         addNewUserPermission, deleteUserPermission,modifyReviewData, modifySearchData, changeUserPermission,modifyViewName, getReviewContent, modifyReviewHomeStatus,
         uploadHtmlTemplate, resetHtmlTemplate
        } from "../actions/index";
import { bindActionCreators } from "redux";
class CampaignList extends Component {
  constructor(props){
    super(props);
    this.state = {
      setupSlideClass:"setupOverlay",
      addUser:"",
      addRole:"",
      oldRole:"",
      addUserMessage:"",
      addUserMessageClass:"",
      htmlTemplate :[],
      htmlTemplateText:"",
      fileUploadErr:"",
      customFileName:"",
      uploadResult:"",

    }
  }

  componentWillReceiveProps(nextprops){
    if(nextprops.signInStatus !=="loggedin"){
      this.props.history.push('/signin');
    }
    if(nextprops.campaignHomeStatus === "goToNotificationsPage"){
      this.props.history.push("/notifications");
    }
    if(nextprops.campaignHomeStatus === "goToReviewPage"){
      this.props.history.push("/review");
    }
  }

  componentWillMount(){
    this.props.modifyReviewData();
    this.props.modifySearchData();
    this.props.modifyCampaignHomeStatus({campaignHome:"inCampaignList"});
    if(this.props.signInStatus !=="loggedin"){
      this.props.history.push('/signin');
    }else{
    this.props.getCampaignList({user:this.props.selections.user});
    }
    this.props.modifyViewName({currentView:"profileBased"})
    window.scrollTo(0, 0);
  }


 openNav(selection) {
   if(!document.getElementById("root").classList.contains('overflowNone')){
      document.getElementById("root").classList.add('overflowNone');
   }
   selection.user = this.props.selections.user;
   this.props.modifyCampaign(selection);
   this.props.getUserSettings({user:this.props.selections.user,campaign:this.props.selections.campaign});
   this.props.addUserList(this.props.selections);
   this.setState({setupSlideClass:'setupOverlay active'});
  }

 closeNav() {
   if(document.getElementById("root").classList.contains('overflowNone')){
      document.getElementById("root").classList.remove('overflowNone');
   }
    this.setState({setupSlideClass:'setupOverlay',addUserMessage:""});
    this.setState({fileUploadErr:""});
    this.setState({uploadResult:""})
    this.setState({htmlTemplate:[]})
    this.setState({customFileName:""})
    this.props.resetHtmlTemplate();
    document.getElementById("uploadFile").value="";
    document.getElementById("fileName").value="";
  }

  selectCampaign(campaign){
    this.props.modifyCampaign(campaign);
    this.props.modifyCampaignDescription({description:campaign.description});
    this.props.selectCampaign(this.props.selections);
    this.props.modifyCampaignHomeStatus({campaignHome:"inCampaignHome"});
    this.props.history.push('/CampaignHome');
  }

  addNewUserPermission(){
    if(this.state.addRole === "Editor" || this.state.addRole === "Reviewer"){
    this.props.addNewUserPermission({'addUser':this.state.addUser,'role':this.state.addRole,user:this.props.selections.user,'campaign':this.props.selections.campaign},(data) => {
         this.setState({"addUserMessage":data.data.message});
         if(data.data.message === "User is not registered"){
           this.setState({addUserMessageClass:"errorMsg"});
         }else{
           this.setState({addUserMessageClass:"successMsg"});
         }
         this.props.getUserSettings({'user':this.props.selections.user,'campaign':this.props.selections.campaign});
    });
  }else{
    this.setState({addUserMessage:"Please select a valid Role",addUserMessageClass:"errorMsg"});
  }
  }


  deleteUserPermission(email){
    this.setState({addUserMessage:""});
    this.props.deleteUserPermission({'updateUser':email.email,'campaign':this.props.selections.campaign},() => {
      this.props.getUserSettings({'user':this.props.selections.user,'campaign':this.props.selections.campaign});
    });
  }

  changeUserPermission(value){
    this.setState({addUserMessage:""});
    this.props.changeUserPermission(value,() => {
    //this.props.getUserSettings({'user':this.props.selections.user,'campaign':this.props.selections.campaign});
    });
  }
  goToReviewPage(selection){
    this.props.modifyCampaign({campaign:selection.campaign});
    this.props.getReviewContent({user:this.props.selections.user,campaign:[selection.campaign],profile:[]});
    this.props.modifyCampaignHomeStatus({campaignHome:"goToReviewPage"});
    this.props.modifyReviewHomeStatus({reviewHome:"goToReviewPageFromList"});
    this.props.modifySearchData();
    this.props.history.push('/review');
  }
  /* function to upload html template */
  uploadHtmlTemplate(){
      let uploadedFile =  this.state.htmlTemplate;
      if(uploadedFile.length>0){
        let file  = uploadedFile[0];
        if(file.type ==="text/html" && this.state.customFileName!=""){
          let fileReader = new FileReader();
          fileReader.readAsText(file, "UTF-8");
          fileReader.addEventListener("loadend",() => {
              this.props.uploadHtmlTemplate({campaign:this.props.selections.campaign, user:this.props.selections.user,
                fileName:file.name,fileCustomName:this.state.customFileName,fileType:file.type,
                fileText:fileReader.result},(data)=>{
                 if(data.data.message!= ""){
                     this.setState({fileUploadErr:""});
                   this.setState({uploadResult:"Successfully Uploaded HTML Template"})
                 }

                });
              });
        }
        else{
          if(file.type !=="text/html" &&  this.state.customFileName==="")
          {
            this.state.fileUploadErr ="File format is not supported and file name can't be empty, please upload only .html file and provide a custom name for the file";
            this.setState({fileUploadErr:this.state.fileUploadErr});
          }
          else if(file.type !=="text/html" &&  this.state.customFileName!="")
          {
            this.state.fileUploadErr ="File format is not supported, please upload only .html file";
            this.setState({fileUploadErr:this.state.fileUploadErr});
          }
          if(file.type ==="text/html" &&  this.state.customFileName==="")
          {
            this.state.fileUploadErr ="Please  provide a custom name for the file";
            this.setState({fileUploadErr:this.state.fileUploadErr});
          }
          else
          {
            this.state.fileUploadErr ="File format is not supported, please upload only .html file";
            this.setState({fileUploadErr:this.state.fileUploadErr});
          }


        }
      }
      else{
        this.state.fileUploadErr ="Please select a file";
        this.setState({fileUploadErr:this.state.fileUploadErr});
      }
      // let file  = document.getElementById("uploadFile").files[0];
      // let fileContent  = document.getElementById("fileContent");
      // let fileReader = new FileReader();
      // fileReader.readAsText(file, "UTF-8");
      // let x = fileReader.addEventListener("loadend",() => {
      //       this.setState({htmlTemplateText:fileReader.result});
      //   });
      // console.log("x",x)
      // console.log("htmlTemplateText",fileReader);
      // console.log("Uploaded File", this.state.htmlTemplateText);
      //console.log("Uploaded File FIKE", conte);

  }
 renderUserOptions(selection){
   if(selection.role === "Editor"){
     return(
       <div className="col-xs-12 pad0">
         <div className="icon type">
           <span>{selection.role}</span>
         </div>
         <div className="icon">
           <i className="fa fa-cog" aria-hidden="true" onClick={() => this.openNav(selection)}></i>
         </div>
         <div className="icon">
           <i className="fa fa-edit" aria-hidden="true" onClick={() => this.selectCampaign(selection)}></i>
         </div>
         <div className="icon">
           <i className="fa fa-share" aria-hidden="true" onClick={() => this.goToReviewPage(selection)}></i>
         </div>
       </div>

     )
   }else{
     return(
      <div className="col-xs-12 pad0">
         <div className="icon type">
           <span>{selection.role}</span>
         </div>
        <div className="icon">
           <i className="fa fa-share" aria-hidden="true" onClick={() => this.goToReviewPage(selection)}></i>
         </div>
      </div>
   )
   }
 }

 renderCampaignTitle(selection){
   if(selection.role === "Editor"){
    return(
       <div className="col-xs-12 clearAll title" onClick={() => this.selectCampaign(selection)} >
         <span className="span">{selection.campaign}</span>
         <span className="span desc">{selection.description}</span>
       </div>

    )
   }
   else {
     return(
        <div className="col-xs-12 clearAll title" onClick={() => this.goToReviewPage(selection)} >
          <span className="span">{selection.campaign}</span>
          <span className="span desc">{selection.description}</span>
        </div>

     )
   }
 }

 renderCampaignList(){
   return this.props.campaignList.campaign.map((campaign,index) => {
     return(
       <div className="col-xs-12 col-sm-6 col-md-4 whiteTile">
						<div className="mouseEffect">
							<div className="col-xs-12 clearAll settings">
								<div className="col-xs-12 pad0 sno">
									<span>{this.props.campaignList.campaign_ids[index]}</span>
								</div>
							</div>
              {this.renderCampaignTitle({campaign:campaign,role:this.props.campaignList.role[index], description:this.props.campaignList.description[index]})}

              <div className="row clearAll boxFooter">
								{this.renderUserOptions({campaign:campaign,role:this.props.campaignList.role[index],description:this.props.campaignList.description[index]})}
							</div>
						</div>
					</div>





     )
   });
 }

 renderUserRoleSelection(role){
   if(role.role === "Editor"){
     return(
       <select  className="form-control"
         onChange={(event) => this.changeUserPermission({'addUser':role.email,role:event.target.value,user:this.props.selections.user,campaign:this.props.selections.campaign})}>
          <option selected key="Editor">Editor</option>
          <option key="Reviewer">Reviewer</option>
        </select>
     )
   }else if(role.role === "Reviewer"){
     return(
     <select  className="form-control"
       onChange={(event) => this.changeUserPermission({'addUser':role.email,role:event.target.value,user:this.props.selections.user,campaign:this.props.selections.campaign})}>
        <option selected key="Reviewer">Reviewer</option>
        <option key="Editor">Editor</option>
      </select>
    )
   }
 }

 renderUserSettings(){
   return this.props.settinginfo.email.map((email,index) => {
     return(
       <div className="winTRow">
         <div className="winTcol sno">
            {index+1}
         </div>
         <div className="winTcol name">
           {email}
         </div>
         <div className="winTcol email">
            {email}
         </div>
         <div className="winTcol owner">
           {this.renderUserRoleSelection({'email':email,'role':this.props.settinginfo.role[index]})}
         </div>
         <div className="winTcol settings">
            <i className="fa fa-trash  proEdit" onClick={() => this.deleteUserPermission({'email':email})}></i>
         </div>
       </div>

     )
   });
 }


 renderAddUser(){
   return this.props.addUserNames.users.map(user => {
     return(
       <option value={user} />
     )
   });
 }


  render() {
    return (
      <div>
        <div>
          <Header />
        </div>
        <div className="setupContainer" style={{"background":"#fff"}}>
          <div className="container-fluid padding-top ">
            <div className="row cPaddingBottom">
               <div className="col-xs-12  col-sm-12 col-md-12 winSetup">
                  <div className="row headingTop">
                    <div className="col-xs-12">
                      <span>Global customer engagement campaigns</span>
                      <span className="desc">Personalized content at scale</span>
                    </div>
                  </div>
                  <div className="row ">
                    {this.renderCampaignList()}
                  </div>
                </div>
            </div>
          </div>


          <div id="setupSlide" className={this.state.setupSlideClass} >

            <div className="overlayContent">
              <div></div>
              <div className="container content">
                <div className="titleBar">
                  <span className="titleText"><i className="fa fa-caret-right"></i>{this.props.selections.campaign[0]}</span>
                  <span className="closebtn" onClick={() => this.closeNav()}>&times;</span>
                </div>

                <div className="row clearAll">
                  <div className="col-xs-12 col-sm-12 col-md-8 user currentUser">
                      <div className="blockItems">
                          <p className="userlist"><i className="fa fa-users"></i> User Managment</p>
                          <div className="winTable">
                            <div className="winTbody">
                                {/* <!--  Table Title Row  --> */}
                                <div className="winTRow th">
                                  <div className="winTcol sno">
                                     #
                                  </div>
                                  <div className="winTcol name">
                                     <i className="fa fa-user" aria-hidden="true"></i>
                                     User Name
                                  </div>
                                  <div className="winTcol email">
                                     <i className="fa fa-envelope" aria-hidden="true"></i>
                                     Email ID
                                  </div>
                                  <div className="winTcol owner">
                                    <i className="fa fa-check-square-o" aria-hidden="true"></i>
                                     Role
                                  </div>
                                  <div className="winTcol settings">
                                    <i className="fa fa-cog" aria-hidden="true"></i>
                                     Action
                                  </div>
                                </div>
                                {/* <!-- Row  --> */}
                                {this.renderUserSettings()}
                                {/* <!-- Row  --> */}
                             </div>
                        </div>
                      </div>
                  </div>
                  {/* <!-- Add New User --> */}
                   <div className="col-xs-12 col-sm-12 col-md-4 user addNewUser">
                      <div className="col-xs-12 blockItems bgColorBlue">
                          <p className="userlist"><i className="fa fa-user-plus"></i> Add New User</p>
                          <div className="col-xs-12 addUser">
                            <div className="row inputgGrp">
                              <div className="form-group">
                                  <label htmlFor="inputEmail3" className="col-sm-2 control-label">Email</label>
                                  <div className="col-sm-10">
                                    <input list="email" name="email" className="form-control" placeholder="Email" onChange={(event) => this.setState({addUser:event.target.value,addUserMessage:""})}/>
                                    <datalist id="email">
                                      {this.renderAddUser()}
                                    </datalist>

                                  </div>
                              </div>
                            </div>
                            <div className="row inputgGrp">
                              <div className="form-group">
                                  <label htmlFor="inputEmail3" className="col-sm-2 control-label">Role</label>
                                  <div className="col-sm-10">
                                    <select  className="form-control" onChange={(event) => this.setState({addRole:event.target.value,addUserMessage:""})}>
                                       <option selected disabled>Select Role</option>
                                       <option value="Reviewer">Reviewer</option>
                                       <option value="Editor">Editor</option>
                                     </select>
                                  </div>
                                </div>
                              </div>
                              <div className={this.state.addUserMessageClass}>{this.state.addUserMessage}</div>
                              <div className={this.state.addUserMessageClass} style={{'color':'green'}}>{this.props.uploadHtmlTemplate}</div>
                              <button className="mbtn btnType-save" onClick={() => this.addNewUserPermission()} ><span className="btnLabel"> Add </span><i className="fa fa-long-arrow-right btnPaddLeft" aria-hidden="true"> </i></button>
                          </div>
                       </div>
                       {/* upload Html file  start */}
                       <div className="col-xs-12 blockItems bgColorGreen">
                         <p className="userlist"><i className="fa fa-upload"></i> Add Html Template</p>
                         <div className="col-xs-12 addUser">
                           <div className="row inputgGrp">
                             <div className="form-group">
                                 <label htmlFor="inputEmail3" className="col-sm-2 control-label">File</label>
                                 <div className="col-sm-10">
                                   <input type="file" name="email" className="form-control" id="uploadFile" placeholder="Select Html Template"  onChange ={(event)=>this.setState({"htmlTemplate":event.target.files})}/>
                                 </div>
                            </div>
                           </div>
                           <div className="row inputgGrp">
                             <div className="form-group">
                                 <label htmlFor="inputEmail3" className="col-sm-2 control-label">Name</label>
                                 <div className="col-sm-10">
                                   <input  name="fileName" id="fileName" className="form-control" placeholder="File Name" placeholder="Template Name"  onChange={(event)=> this.setState({"customFileName":event.target.value})} />
                                 </div>
                               </div>
                             </div>
                            <div className="errorMsg">{this.state.fileUploadErr}</div>
                            <div className="errorMsg" style={{'color':'#fff'}}>{this.state.uploadResult}</div>
                             <button className="mbtn btnType-save"  onClick = {(event)=>this.uploadHtmlTemplate()}><span className="btnLabel"> Upload </span><i className="fa fa-upload btnPaddLeft" aria-hidden="true"> </i></button>
                         </div>
                       </div>
                       {/* upload Html file ends  */}

                   </div>
                  {/* <!-- Add New User --> */}

                </div>

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
    signInStatus : state.signInStatus,
    selections : state.globalSelection,
    campaignHomeStatus : state.campaignHomeStatus,
    campaignList:state.campaignList,
    settinginfo:state.settinginfo,
    addUserNames:state.addUserNames,
    reviewHomeStatus:state.reviewHomeStatus,
    uploadHtmlTemplate:state.uploadHtmlTemplate
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({modifyReviewHomeStatus,modifyReviewData,modifySearchData, getCampaignList,getUserSettings,modifyCampaign,modifyCampaignDescription, addUserList,addNewUserPermission,
                             modifyViewName, getReviewContent,deleteUserPermission, changeUserPermission, modifyCampaignHomeStatus, selectCampaign, uploadHtmlTemplate, resetHtmlTemplate

                           }, dispatch);
}


export default connect(mapStateToProps,mapDispatchToProps)(CampaignList);
