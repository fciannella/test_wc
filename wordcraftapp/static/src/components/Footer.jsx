import React, { Component } from 'react';

class Footer extends Component {

  render(){
    return(
    <footer className="footer col-xs-12 pad0 clearAll">
      <div className="container" style={{"background":"#8e929d","width":"100%"}}>
      <p style={{"max-width": "1000px","width":"95%"}}>Powered by <a href="https://cisco.jiveon.com/projects/digital-science/pages/overview" target="_blank" className="tlogo">DataScienceX</a></p>
      </div>
    </footer>

    );
  }
}

export default Footer;
