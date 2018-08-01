from wordcraftapp.api.mylogging import configure_logger
import os
logger = configure_logger('default')
import getpass

import sys

from flask import Flask, logging
from flask_cors import CORS
from flask_restful import Api

from wordcraftapp.api.api_feature import addfeature, deletefeature
from wordcraftapp.api.api_narrative import getnarrative, exportallnarrative, featurenarrative ,getHtml ,filterNarrative , get_columns_names
from wordcraftapp.api.api_rule import getrule, addrule
from wordcraftapp.api.api_segment import selectcampaign, updatecampaign
from wordcraftapp.api.api_signin import checksignin
from wordcraftapp.api.api_signup import checksignup
from wordcraftapp.api.api_util import allcontent, exportedInfo, deleteInfo, sso, checkuser, submitreview, getreviewinfo, addcomment, approveProfile ,getnotification,getVersionData,revertState,deleteState, saveState, uploadHtmlTemplate
from wordcraftapp.api.api_campaignhome import campaigninfo, settinginfo, userinfo, adduser, deleterole
from wordcraftapp.api.api_mapping import getmapping, removemapping, createmapping
from wordcraftapp.api.api_excelrule import importExcel
from wordcraftapp.blueprints import api, error, web
from wordcraftapp.config import ProdConfig, AnuragConfig, BaseConfig
from wordcraftapp.extentions import mysql

# Create a flask application using a config object containing the credentials.
# Look into config.py for the object details which contain the connection credentials.
def create_app(config_object):
    app = Flask (__name__, static_url_path='')
    # CORS is cross-origin resource sharing and is disabled by default.
    # It was enabled here to allow connection to node zserver earlier but is non-essential now.
    CORS (app)
    app.config.from_object(config_object)
    # Register the blueprints from blueprints folder.
    app.register_blueprint(api.api, url_prefix="/api/v1")
    app.register_blueprint (error.error, url_prefix="/api/v1")
    app.register_blueprint (web.web, url_prefix="/")
    app.register_blueprint (web.dist, url_prefix="/dist")
    app.register_blueprint (web.static, url_prefix="/static")
    # Using mysql instance from extensions to avoid circular reference between runserver and blueprints.
    mysql.init_app (app)
    return app

logger.info("Creating APP")
try:
    # Pick right config based on who is running or where is it running
    if "OPENSHIFT_APP_UUID" in os.environ:
        app = create_app (ProdConfig)
    elif getpass.getuser () == 'aaenugu':
        app = create_app (AnuragConfig)
    elif getpass.getuser () == 'vagrant':
        app = create_app (ProdConfig)
    elif getpass.getuser () == 'cloud-user':
        app = create_app (ProdConfig)
    else:
        app = create_app (BaseConfig)
except Exception as e:
    logger.error (e.__str__ ())

# TODO: Use flask blueprint. This is not scalable
api = Api (app)
database = app.config['MYSQL_DB']

api.add_resource(allcontent, '/allcontent')
api.add_resource(updatecampaign, '/updatecampaign')
api.add_resource(getmapping, '/getmapping')
api.add_resource(removemapping, '/removemapping')
api.add_resource(createmapping, '/createmapping')
api.add_resource(selectcampaign, '/selectcampaign')
api.add_resource(getrule, '/getrule')
api.add_resource(getnarrative, '/getnarrative')
api.add_resource(featurenarrative, '/featurenarrative')
api.add_resource(addrule, '/addrule')
api.add_resource(addfeature, '/addfeature')
api.add_resource(deletefeature, '/deletefeature')
api.add_resource(checksignin, '/checksignin')
api.add_resource(checksignup, '/checksignup')
api.add_resource(campaigninfo, '/campaigninfo')
api.add_resource(deleterole, '/deleterole')
api.add_resource(userinfo, '/userinfo')
api.add_resource(settinginfo, '/settinginfo')
api.add_resource(exportedInfo, '/exportedInfo')
api.add_resource(deleteInfo, '/deleteInfo')
api.add_resource(adduser, '/adduser')
api.add_resource(submitreview, '/submitreview')
api.add_resource(getnotification, '/getnotification')
api.add_resource(addcomment, '/addcomment')
api.add_resource(getreviewinfo, '/getreviewinfo')
api.add_resource(approveProfile, '/approveprofile')
api.add_resource(sso, '/sso')
api.add_resource(checkuser, '/checkuser')
api.add_resource(exportallnarrative, '/exportallnarrative')
api.add_resource(saveState, '/saveInfo')
api.add_resource(getVersionData, '/getVersionData')
api.add_resource(revertState, '/revertState')
api.add_resource(deleteState, '/deleteState')
api.add_resource(getHtml, '/getHtml')
api.add_resource(filterNarrative, '/filterNarrative')
api.add_resource(uploadHtmlTemplate, '/uploadHtmlTemplate')
api.add_resource(get_columns_names, '/get_columns_names')
api.add_resource(importExcel, '/uploadData')


# The main method is only called when python .\runserver is specifically executed. Relevant to local host.
# Server doesn't use the main method.
if __name__ == '__main__':
    port = 5001
    if len (sys.argv) > 1:
        port = int (sys.argv[1])
    app.run (host='0.0.0.0', debug=True, port=port, threaded=True)
