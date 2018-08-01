import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import VisualEditor from './Editor';
import {
    addRule, exportNarrative, featureNarrative, getCustomerData, getNarrative, getRule, modifyExportPersonas,
    modifyLanguage, modifyRule, modifyTableName, selectFeature,exportedTables,exportedInfo, submitReview, modifyVcState,
    getVersionData, modifyVersionName, saveVersion, modifyViewName, uploadData
} from "../actions/index";
import RichTextEditor from 'react-rte';
import Textarea from 'react-textarea-autosize';
import SavedVersion from './SavedVersions';

class MailContent extends Component{
  constructor(props){
    super(props);
    this.state={
      messageAlert : "",
      tableName : "",
      loaderClass : "col-xs-12 preloader",
      classDataViewer : "col-xs-12 pad0 dataViewerTable",
      classDataAlternate : "noData toggleDisp",
      infoBoxModal : "modal fade",
      classRte : "disabled",
      visualEditor:"hidden",
      editorBlock:"col-xs-12 editorHead hidden",
      codeEditor:"hidden",
      classButtonSubmit: '',
      modalIsOpen : false,
      exportModalIsOpen: false,
      csvfilename: 'No file selected',
      start_index: 0,
      limit: 5,
      messageModal : 'Please select a single Feature to save Rule',
      value: RichTextEditor.createEmptyValue(), //not used anywhere,
      narrative:"",
      textEditor:"form-control textarea hidden",
      html:"",
      versionSatus:false,
      vcName:'',
      preview_html:'',

      unknownTagsHtml:'',
      UnusedTagsNarr:'',
      selectedFile:'',
      fileUploadErr:""
    }
  }

  componentWillReceiveProps(nextprops){
      if(nextprops.narrative.header.length === 0 || nextprops.narrative.header.length == null){
        this.setState({classDataViewer : "col-xs-12 pad0 dataViewerTable",
                       classDataAlternate : "noData toggleDisp"});
      }else{
        this.setState({classDataViewer : "col-xs-12 pad0 dataViewerTable toggleDisp",
                       classDataAlternate : "noData"});
      }

      // if current view is profile based
      if(nextprops.selections.currentView==="profileBased"){
        if(nextprops.narrative.html){
            document.getElementById("loader").classList.add('hidden');
            this.setState({html:nextprops.narrative.html});
            this.setState({textEditor:"form-control textarea hidden"});
            this.setState({unknownTagsHtml:nextprops.narrative.unknownTagsHtml});
            this.setState({UnusedTagsNarr:nextprops.narrative.UnusedTagsNarr});
            
        }
        else{
            document.getElementById("loader").classList.add('hidden');
            this.setState({narrative:nextprops.narrative.narrative});
            this.setState({textEditor:"form-control textarea"});
            this.setState({html:""});
            this.setState({unknownTagsHtml:""});
            this.setState({UnusedTagsNarr:""});
            document.getElementById("missingTagsBlk").classList.add('hidden');

        }
        this.setState({editorBlock:"col-xs-12 editorHead hidden"});
      }
      else{
          document.getElementById("loader").classList.add('hidden');
          this.setState({narrative:nextprops.narrative.narrative});
          this.setState({textEditor:"form-control textarea"});
          this.setState({html:""});
          this.setState({editorBlock:"col-xs-12 editorHead"});
          document.getElementById("missingTagsBlk").classList.add('hidden');

      }

      this.setState({value:RichTextEditor.createEmptyValue()});
      this.setState({value:RichTextEditor.createValueFromString(nextprops.rule.rule, 'html')});
        if(nextprops.disableContent.editor !== this.state.classRte){
         this.setState({classRte:nextprops.disableContent.editor});
         this.setState({codeEditor:"hidden"});
         this.setState({visualEditor:"display"});
         document.getElementById("save-preview").style.display = "none";
         this.setState({editorBlock:"col-xs-12 editorHead"});

         this.setState({value:RichTextEditor.createValueFromString("", 'html')});
       }
      if(nextprops.selections.currentView==="fatureBased"){
            document.getElementById("loader").classList.add('hidden');
            document.getElementById("vcBtn").classList.remove('hidden');
            document.getElementById("saveVC").classList.remove('hidden');
            document.getElementById("export-narrative").classList.add('hidden');
            document.getElementById("request-review").classList.add('hidden');

            //this.toogleEditorView("visualView");
      }
      else{

          document.getElementById("loader").classList.add('hidden');
          document.getElementById("vcBtn").classList.add('hidden');
          document.getElementById("saveVC").classList.add('hidden');
          document.getElementById("export-narrative").classList.remove('hidden');
          document.getElementById("request-review").classList.remove('hidden');
          //this.toogleEditorView("codeView");
        }
  }


  toogleEditorView(editorType){
    if(editorType==="visualView"){
      this.setState({submit:"enabled", codeEditor:"hidden", visualEditor:"enabled display", editorBlock:"col-xs-12 editorHead"},()=>{
        document.getElementById("save-preview").style.display = "none";
      });

    }
    else if(editorType==="codeView"){
      this.setState({submit:"enabled", codeEditor:"enabled", visualEditor:"hidden", editorBlock:"col-xs-12 editorHead"},()=>{
        document.getElementById("save-preview").style.display = "block";
      });
    }
  }
  closeModal() {
    this.setState({modalIsOpen: false, exportModalIsOpen: false});
    this.setState({infoBoxModal:"modal fade"});
    document.getElementById("infoBox").style.display = "none";

  }


  onChange = (value) => {
    this.setState({value});
  };




  getRule(event) {

    /* smooth scroll */
    let smoothScroll = {
      timer: null,

      stop: function () {
        clearTimeout(this.timer);
      },

      scrollTo: function (id, callback) {
        var settings = {
          duration: 1000,
          easing: {
            outQuint: function (x, t, b, c, d) {
              return c*((t=t/d-1)*t*t*t*t + 1) + b;
            }
          }
        };
        var percentage;
        var startTime;
        var node = document.getElementById(id);
        var nodeTop = node.offsetTop;
        var nodeHeight = node.offsetHeight;
        var body = document.body;
        var html = document.documentElement;
        var height = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        var windowHeight = window.innerHeight
        var offset = window.pageYOffset;
        var delta = nodeTop - offset;
        var bottomScrollableY = height - windowHeight;
        var targetY = (bottomScrollableY < delta) ?
          bottomScrollableY - (height - nodeTop - nodeHeight + offset):
          delta;

        startTime = Date.now();
        percentage = 0;

        if (this.timer) {
          clearInterval(this.timer);
        }

        function step () {
          var yScroll;
          var elapsed = Date.now() - startTime;

          if (elapsed > settings.duration) {
            clearTimeout(this.timer);
          }

          percentage = elapsed / settings.duration;

          if (percentage > 1) {
            clearTimeout(this.timer);

            if (callback) {
              callback();
            }
          } else {
            yScroll = settings.easing.outQuint(0, elapsed, offset, targetY, settings.duration);
            window.scrollTo(0, yScroll);
            this.timer = setTimeout(step, 10);
          }
        }

        this.timer = setTimeout(step, 10);
      }
    };
    /* smooth scroll */


    if(document.getElementById("profileBasedView").style.display === "block"){


      if(this.props.selections.exportPersonas.length !== 1){
        this.setState({infoBoxModal:"modal fade in",messageAlert:"Select single Profile to generate preview"});
        document.getElementById("infoBox").style.display = "block";
        document.getElementById("infoBox").style.paddingTop = "160px";
      }else{
      //this.setState({value:RichTextEditor.createValueFromString(this.props.rule.rule, 'html')});
      if(document.getElementById("loader").classList.contains('hidden')){
         document.getElementById("loader").classList.remove('hidden');
      }
      if(document.getElementById("missingTagsBlk").classList.contains('hidden')){
         document.getElementById("missingTagsBlk").classList.remove('hidden');
      }
      this.props.getNarrative(this.props.selections);
      document.getElementById("ta").style.resize = true;
      document.getElementById("toggleVisibility").style.display = 'block';
      smoothScroll.scrollTo('toggleVisibility');
     }

   }else{
     if(this.props.selections.exportFeature.length === 0){
       this.setState({infoBoxModal:"modal fade in",messageAlert:"Select a Feature to generate preview"});
       document.getElementById("infoBox").style.display = "block";
       document.getElementById("infoBox").style.paddingTop = "160px";
     }else{
       if(!document.getElementById("loader").classList.contains('hidden')){
          document.getElementById("loader").classList.add('hidden');
       }
       this.props.featureNarrative({user:this.props.selections.user,campaign:this.props.selections.campaign,
                                  language:this.props.selections.language,previewFeature:this.props.selections.exportFeature,
                                  previewPersona:[this.props.mapping.featurepersona[this.props.selections.exportFeature[0]][0]]});
        document.getElementById("toggleVisibility").style.display = 'block';
        document.getElementById("toggleVisibility").style.display ='block';
        smoothScroll.scrollTo('toggleVisibility');
        if(!document.getElementById("missingTagsBlk").classList.contains('hidden')){
           document.getElementById("missingTagsBlk").classList.add('hidden');
        }
      }
   }

 }

  saveTemplate() {
    this.props.modifyRule({rule:this.state.value.toString('html')});
    this.props.addRule(this.props.selections, () => {
    this.props.featureNarrative({user:this.props.selections.user,campaign:this.props.selections.campaign,
                                 language:this.props.selections.language,previewFeature:this.props.selections.exportFeature,
                                 previewPersona:[this.props.mapping.featurepersona[this.props.selections.exportFeature[0]][0]]});

    });
  }

  openExportModal(){
      document.getElementById("proEditCurrentBlock1").style.paddingTop = "160px";
  }
  openVersionModal(){
    this.setState({vcName:""});
    document.getElementById("saveVCModal").style.paddingTop = "160px";
  }
  selectLanguage(language){
    this.props.modifyLanguage({language:language});
    this.props.selectFeature(this.props.selections);
  }

  submitReview(){
    this.props.submitReview(this.props.selections, (res) => {
      console.log("Call Back for submit review", res);
      let response = res.data.message;
      console.log("call back response for submit review", response);
      if(response === 'Unsuccessful'){
        this.setState({infoBoxModal:"modal fade in",messageAlert:"Profile has been not submitted for review, reviewer is not assigned for this campaign."});
        document.getElementById("infoBox").style.display = "block";
        document.getElementById("infoBox").style.paddingTop = "160px";
      }
      else if(response === 'Success'){
        this.setState({infoBoxModal:"modal fade in",messageAlert:"Profile has been submitted for review"});
        document.getElementById("infoBox").style.display = "block";
        document.getElementById("infoBox").style.paddingTop = "160px";
      }


    });

  }

  exportAllNarrative(){
    let tableName = this.state.tableName.trim();
    if(this.props.selections.exportPersonas.length === 0){
      this.setState({infoBoxModal:"modal fade in",messageAlert:"Please select a profile to export."});
    }else if(tableName === ""){
        this.setState({infoBoxModal:"modal fade in",messageAlert:"Please enter a valid table name."});
    }
    else if(this.props.exportedTables.indexOf(tableName)!== -1){
        this.setState({infoBoxModal:"modal fade in",messageAlert:"Table name exists, please enter a unique name."});
    }
    else{
      this.props.modifyTableName({"filename":this.state.tableName.trim()});
      this.props.exportNarrative(this.props.selections);
      this.setState({infoBoxModal:"modal fade in",messageAlert:"Your request has been queued. Click on table icon on top to check the status."});
      this.props.exportedInfo(this.props.selections);

    }
      document.getElementById("infoBox").style.display = "block";
      document.getElementById("infoBox").style.paddingTop = "160px";
      this.buttonElement.click();
  }

  languagelist(){
    return this.props.language.map(language => {

      if(this.props.selections.language===language.language){
        return(
            <option selected key={language.language}>{language.language}</option>
           );
      }
      else{
        return(
            <option key={language.language}>{language.language}</option>
          );
      }
  });
  }

/* render Unknown Html tags */
renderUnknTagsHtml(){
  console.log("My Narr", this.props.narrative);
  if(this.state.unknownTagsHtml===''){
    return(
        <li>No unknown tag found in html template</li>
    );
  }

  else{
  return this.state.unknownTagsHtml.map(tags => {
    return(


            <li>{tags}</li>

    );
  })
  }
}
/* render Unused  tags from Narrative */
renderUnusedTagsNarr(){

  if(this.state.UnusedTagsNarr===''){
    return(
      <li>No unknown tag found in html template</li>
    );
  }

  else{
  return this.state.UnusedTagsNarr.map(tags => {
    return(

            <li>{tags}</li>

    );
  })
  }
}

  renderViewerHeader(){
    return this.props.narrative.header.map((header,index) => {
      return(
        <th key={index}>{header}</th>
      )
    });
  }
  renderAddRows(value){
    return value.map(value => {
      return(
          <td>{value}</td>
      )
    });
  }

  renderViewerRows(){
    return this.props.narrative.values.map((value,index) => {
      return(
        <tr>
          <td>{index+1}</td>
          {this.renderAddRows(value)};
        </tr>
      )
    });
  }

vcModel(){
  let i = true;
  this.props.getVersionData(this.props.selections);
  this.props.modifyVcState({vcState:true});
  if(this.props.selections.vcState)
  {
    document.getElementById('savedVersions').classList.add('activeModel');
  }
  else{
    document.getElementById('savedVersions').classList.remove('activeModel');
  }
}
// Check if the version name is valid
setVersionName(event)
{
  this.setState({"vcName":event.target.value,"errorMessage":""});
  if(event.target.value ===""){
      document.getElementById("versionStateName").style.display = "block";
  }
  else{
      document.getElementById("versionStateName").style.display = "none";
  }
}
saveCurrentState(){
  this.props.modifyVersionName({"versionName":this.state.vcName.trim()});
  if(this.props.selections.versionName===""){
    document.getElementById("versionStateName").style.display = "block";
  }
  else{
      this.props.saveVersion(this.props.selections).then(res => {
       let response = res.payload.data;
       if(response.message === 'true'){
        //document.getElementById("saveVCModal").style.display = "none";
        this.setState({infoBoxModal:"modal fade in",messageAlert:"Current state has been saved."});
        document.getElementById("infoBox").style.display = "block";
        document.getElementById("infoBox").style.paddingTop = "160px";
        this.buttonElement.click();
       }
       else{
         this.setState({infoBoxModal:"modal fade in",messageAlert:"Operation failed, try again!"});

       }
     });
  }
}

/*  CUrrent Campaign name */
currentCampaignName(){
  return this.props.campaigns.map(campaign => {
      return (
        <span style={{"fontWeight": "bold", "color": "#0098dc", "textTransform": "capitalize"}}>{campaign.campaign}</span>
      )});
}
resetUploadModal(event){
  this.setState({fileUploadErr:""})
  this.setState({'csvfilename':"No file selected"})

}

/* Upload Excel */
uploadData(event){
  this.setState({fileUploadErr:""})
  this.setState({'csvfilename':"No file selected"})
  let selectedFile  =  event.target.files[0]
  let selectedFiles  =  event.target.files
  if((selectedFile!=null) && (typeof selectedFile!='undefined')){
     if(selectedFile.type==="text/csv"){
         this.setState({'csvfilename':selectedFile.name})
         let preLoader = document.getElementById('editorPreloader');
         if((typeof preLoader!="undefined") && (preLoader!=null)){
            if(!preLoader.classList.contains('activeLoader')){
              preLoader.classList.add('activeLoader');
            }
         }
         let file = selectedFile;
         let reader = new FileReader();
         reader.addEventListener("loadend",(e) => {
           let texto = reader.result;
           let csv = texto;
           let lines = csv.split("\n");
           let result = [];
           let headers;
           for (var i = 0; i < lines.length; i++) {
               headers = lines[i].split("\n");
           }
           let cont = 0;
           for (let i = 0; i < lines.length; i++) {

           let obj = {};
           let currentline = lines[i].split("\n");
           for (let j = 0; j < headers.length; j++) {
               obj[cont] = currentline[j];
           }
           cont++;
           result.push(obj);
       }

         this.props.uploadData({'file':result})


      });
      reader.readAsText(file);
       let preLoader2 = document.getElementById('editorPreloader');
         if((typeof preLoader2!="undefined") && (preLoader2!=null)){
            if(preLoader2.classList.contains('activeLoader')){
              preLoader2.classList.remove('activeLoader');
            }
         }
          this.setState({fileUploadErr:"CSV file parsed successfuly, close model and continue"})
          
    }
    else{
      this.setState({fileUploadErr:"File format is not supported, please selected another file."})
    }
  }

  


}


render() {
    return (
      <div>

        <div className="row mail-content clearAll">
          <div className="col-xs-12 clearAll" style={{'paddingBottom':'32px'}}>

            <div className="row clearAll" >

               <div className="col-xs-6 pad0" style={{'textAlign':'left'}}>

               </div>
               <div className="col-xs-6 pad0" style={{'textAlign':'right'}}>
                 <select className="form-control" id="sel1" style={{'display':'inline-block','float':'none', 'marginRight':'10px'}} onChange={(event) => this.selectLanguage(event.target.value)}>
                    {this.languagelist()}
                  </select>
                 <button id="btn-getRule" className="mbtn btnType-save alignRight" data-target="#infoBox" style={{'display':'inline-block','float':'none'}}  onClick={(event) => this.getRule(event)}><span className="btnLabel">Submit</span><i className="fa fa-long-arrow-right btnPaddLeft" aria-hidden="true"> </i></button>
               </div>
            </div>
          </div>

          <div className="row" id="toggleVisibility" >
          <div className="col-xs-12">
            <div className="row clearAll">
               <div className="col-xs-12 pad0 clear">
                 <p className="prevew" style={{'marginTop':'0px'}}>Preview <i className="fa fa-angle-double-right"></i>  {this.currentCampaignName()}</p>

                 <div className="btnClose" id="vcBtn" onClick={()=>this.vcModel()}><div className="iconClose"><span><i className="fa fa-github"></i> Versions  </span></div></div>
                 <div className="col-xs-12 pad0">
                   <div className="loader" id="loader">
                     <img src={require('../loader.gif')} className="img-resposive" />
                   </div>
                  <div dangerouslySetInnerHTML={{__html:this.state.html}} />

                  <Textarea
                  id="ta"
                  className={this.state.textEditor}
                  type="text"
                  placeholder="Please make selections to generate content"
                  style={{'marginBottom': '5px','color':'black', 'clear':'both', 'float':'none'}}
                  value={this.state.narrative}
                />


              <div className="col-xs-12 missingTagsBlk" id="missingTagsBlk">
                {/* Missing tags in  Html Template*/}
                  <div className="col-xs-12 col-sm-6 missingTag">
                      <div className="col-xs-12  missingTagCont">
                        <h3 className="missingTagContTitle">Unknown Tags In Html Template</h3>
                        <div className="missingTagContList">
                            <ul>
                             {this.renderUnknTagsHtml()}
                           </ul>
                        </div>
                      </div>
                  </div>

                  {/* Missing tags in  Narrative*/}

                    <div className="col-xs-12 col-sm-6 missingTag">
                        <div className="col-xs-12  missingTagCont">
                          <h3 className="missingTagContTitle">Unused Tags In Narrative Template</h3>
                          <div className="missingTagContList">
                              <ul>
                                  {this.renderUnusedTagsNarr()}

                              </ul>
                          </div>
                        </div>
                  </div>

              </div>
               </div>
              </div>
            </div>
          </div>
          <hr></hr>
            {/*  Model For adding Rule File  */}
            <div className="modal fade editorUploadFile" id="uploadRuleFile" tabindex="-1" role="dialog" aria-labelledby="uploadRuleFile"  data-keyboard="false">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title" id="myModalLabel"><i className="fa fa-upload"></i>&nbsp; Upload Excel Rule File</h4>
                  </div>
                  <div className="modal-body">
                    <div className="row  center">
                      <div className="editorUploadBody">
                        <div className="preloader" id="editorPreloader">
                          <div className="preloaderImg">
                             <img src={require('../loaderSmall.gif')} className="img-resposive" />
                             {/*<div className="uploadLiveStat"><span id="uploadLiveStat">10</span> %</div> */}
                          </div>
                        </div>

                        <div className="upload-btn-wrapper">
                          <button className="btn">Upload a file</button>
                          <input type="file"  id="fileUploader" name="myfile" placeholder="select a file to upload" onChange={(event)=>this.uploadData(event)} />
                        </div>
                        <div className="fileMsg"><span className="selFileName" id="selFileName">{this.state.csvfilename}</span>
                             <span className="selFileType"> Supported file formats - .csv </span>
                        </div>
                      </div>
                      <div className="fileMsg"><span className="selFileErr">{this.state.fileUploadErr}</span></div>
                    </div>
                  </div>
                  <div className="modal-footer editorUpload hidden">
                    <button type="button" className="mbtn btnType-save alignRight" data-dismiss="modal">Cancel</button>
                    <button type="button" className="mbtn btnType-save alignRight"><i className="fa fa-upload"></i>&nbsp; Upload</button>
                  </div>
                </div>
              </div>
            </div>
            {/*  Model For adding Rule File  ends */}
            <div className="col-xs-12 pad0 clear">
              <div className={this.state.editorBlock}  id="editorWrapper">
                <div className="col-xs-12 editorHeadList">
                  <span className="linkItem" data-toggle="modal" data-target="#uploadRuleFile" onClick={(event) => this.resetUploadModal(event)}>Import Rule</span>
                  <span className="linkItem" onClick={(event)=>this.toogleEditorView("visualView")}>Visual</span>
                  <span className="linkItem" onClick={(event)=>this.toogleEditorView("codeView")}>Code</span>
                </div>
                <div id="editorWrapperStart" className={this.state.visualEditor}>
                  <VisualEditor />
                </div>
                <div className="col-xs-12 pad0">{this.state.error}</div>
                <div className={this.state.codeEditor} id="rte-editor" style={{"margin-top": "42px"}}>
                    <RichTextEditor className={this.state.classRte} style={{"padding-top":"20px;"}} value={this.state.value} onChange={this.onChange} />
                </div>
              </div>
            </div>



          <div className="col-xs-12 clear paddTop">
            <button className="mbtn btnType-save alignLeft" id="save-preview" style={{'float':'left'}} onClick={() => this.saveTemplate()}><span className="btnLabel"> Save </span><i className="fa fa-long-arrow-right btnPaddLeft" aria-hidden="true"> </i></button>
            <button className="mbtn btnType-save alignLeft" id="request-review"  style={{'float':'right'}} onClick={() => this.submitReview()}><span className="btnLabel"> Request Review </span><i className="fa fa-long-arrow-right btnPaddLeft" aria-hidden="true"> </i></button>
          </div>

          <div className="row clearAll">
             <div className="col-xs-12">
                  <p className="prevew">Data Viewer</p>
                  <div className="col-xs-12 pad0">
                    <div className={this.state.classDataViewer}>
                      <div className="col-xs-12  padd0 dataViewerBlock">
                      <table className="table table-bordered table-condensed customDataViewer" >
                        <tr>
                          <th style={{padding:'5px'}}>#</th>
                          {this.renderViewerHeader()}
                        </tr>
                        {this.renderViewerRows()}
                      </table>
                    </div>
                  </div>


                    <div className={this.state.classDataAlternate}><span>No data to display</span></div>
                  </div>
                </div>

            </div>
            <div className="col-xs-12 smallButton" style={{float: 'none', clear: 'both'}}>
                <button className="mbtn btnType-save alignButton" id="saveVC" style={{'float':'left'}} onClick={() => this.openVersionModal()} data-toggle="modal" data-target="#saveVCModal" data-backdrop="static" data-keyboard="false">
                    <span className="btnLabel"> Save Current State</span><i className="fa fa-github btnPaddLeft"   aria-hidden="true"> </i>
                </button>

                <button className="mbtn btnType-save alignButton" id="export-narrative" onClick={() => this.openExportModal()} data-toggle="modal" data-target="#proEditCurrentBlock1" data-backdrop="static" data-keyboard="false">
                    <span className="btnLabel"> Export Narrative</span><i className="fa fa-long-arrow-right btnPaddLeft"   aria-hidden="true"> </i>
                </button>
            </div>
          </div>
        </div>


        {/* <!-- ------------------------------------------------- -->
      	<!-- -Model For Save Narrative ----Start- -->
      	<!-- ------------------------------------------------- -->  */}
      	<div className="modal fade" id="proEditCurrentBlock1" tabindex="-1" role="dialog">
      	  <div className="modal-dialog" role="document">
      		<div className="modal-content">
      		  <div className="proModel modal-header">
      			<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true"></i></span></button>
      			<h4 className="modal-title"><i className="fa fa-external-link" aria-hidden="true"> </i> Export Narrative</h4>
      		  </div>
      		  <div className="modal-body">
      			<form>
              <div className="form-group">
      				<label className="control-label">Table Name </label>
      				<input type="text" className="form-control" id="" value={this.state.tableName} onChange={(event) => this.setState({"tableName":event.target.value,"errorMessage":""})}/>
      			  </div>
      			</form>
      		  </div>
      		  <div className="proModel modal-footer clear">
      			<button type="button" className="btn btn-default proBtnCancel" data-dismiss="modal" ref={buttonexit => this.buttonElement = buttonexit}><i className="fa fa-times proUpdate" aria-hidden="true"></i> Cancel</button>
      			<button type="button" className="btn btn-primary proBtnSave" onClick={() => this.exportAllNarrative()}>Save <i className="fa fa-long-arrow-right proUpdate" aria-hidden="true"></i> </button>
      		  </div>
      		</div>
      	  </div>
      	</div>
        {/* <!-- ------------------------------------------------- -->
      	<!-- -Model For Save Version ----Start- -->
      	<!-- ------------------------------------------------- -->  */}
      	<div className="modal fade" id="saveVCModal" tabindex="-1" role="dialog" style={{'paddingTop':'160px'}}>
      	  <div className="modal-dialog" role="document">
      		<div className="modal-content">
      		  <div className="proModel modal-header">
      			<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true"></i></span></button>
      			<h4 className="modal-title"><i className="fa fa-fa-github" aria-hidden="true"> </i> Save version</h4>
      		  </div>
      		  <div className="modal-body">
      			<form>
              <div className="form-group">
      				<label className="control-label">Comment </label>
      				<input type="text" className="form-control" id="" value={this.state.vcName} onChange={(event) => this.setVersionName(event)}/>
              <span id = "versionStateName" className="errorText">This field requires a value</span>
            </div>
      			</form>
      		  </div>
      		  <div className="proModel modal-footer clear">
      			<button type="button" className="btn btn-default proBtnCancel" data-dismiss="modal" ref={buttonexit => this.buttonElement = buttonexit}><i className="fa fa-times proUpdate" aria-hidden="true"></i> Cancel</button>
      			<button type="button" className="btn btn-primary proBtnSave" onClick={() => this.saveCurrentState()}>Save <i className="fa fa-long-arrow-right proUpdate" aria-hidden="true"></i> </button>
      		  </div>
      		</div>
      	  </div>
      	</div>

        {/* Model Error - Personas/Feature not selected */}
        <div className={this.state.infoBoxModal} id="infoBox" tabindex="-1" role="dialog" data-dismiss="modal">
      	  <div className="modal-dialog" role="document">
      		<div className="modal-content">
      		  <div className="proModel modal-header">
      			<button type="button" className="close" data-dismiss="modal" onClick={() => this.closeModal()} aria-label="Close"><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true"></i></span></button>
      			<h4 className="modal-title"><i className="fa fa-info-circle " aria-hidden="true"> </i> Information</h4>
      		  </div>
      		  <div className="modal-body errModel">
      			     <p className="errorMsg"><i className="fa fa-info-circle errIcon" aria-hidden="true"></i>{this.state.messageAlert}</p>

      		  </div>
      		</div>
      	  </div>
      	</div>
          {/* Preloader Block */}

          <div className={this.state.loaderClass}>
            <div className="preloaderBG">
            </div>
            <svg version="1.1"  className="preloaderSVG">
            <rect x="20" y="50" width="4" height="10" fill="#fff">
              <animateTransform attributeType="xml"
              attributeName="transform" type="translate"
              values="0 0; 0 20; 0 0"
              begin="0" dur="0.6s" repeatCount="indefinite" />
            </rect>
            <rect x="30" y="50" width="4" height="10" fill="#fff">
              <animateTransform attributeType="xml"
              attributeName="transform" type="translate"
              values="0 0; 0 20; 0 0"
              begin="0.2s" dur="0.6s" repeatCount="indefinite" />
            </rect>
            <rect x="40" y="50" width="4" height="10" fill="#fff">
              <animateTransform attributeType="xml"
              attributeName="transform" type="translate"
              values="0 0; 0 20; 0 0"
              begin="0.4s" dur="0.6s" repeatCount="indefinite" />
            </rect>
          </svg>

          </div>
          {/* Preloader Block ends*/}

          {/* Version Control Options */}

          <SavedVersion status = {this.props.selections.vcState} />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    selections: state.globalSelection,
    rule: state.rule,
    narrative: state.narrative,
    language : state.language,
    disableContent:state.disableContent,
    campaigns: state.campaigns,
    mapping:state.mapping,
    exportedTables:state.exportedTables,
    uploadData: state.uploadData
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getRule: getRule, modifyRule: modifyRule,modifyExportPersonas:modifyExportPersonas,
                              getNarrative: getNarrative, addRule: addRule ,
                              exportNarrative: exportNarrative,getCustomerData: getCustomerData,
                              modifyLanguage: modifyLanguage, selectFeature: selectFeature,
                              modifyTableName: modifyTableName, exportNarrative: exportNarrative,
                              featureNarrative:featureNarrative, exportedInfo:exportedInfo,
                              submitReview:submitReview, modifyVcState:modifyVcState, getVersionData:getVersionData, modifyVersionName:modifyVersionName, saveVersion:saveVersion,
                               modifyViewName:modifyViewName, uploadData}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(MailContent);
