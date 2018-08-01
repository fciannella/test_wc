import os
basedir = os.path.abspath(os.path.dirname(__file__))

# The configuration objects which provide credentials to runserver.py

# BaseConfig contains the credentials relevant to offshore.
class BaseConfig(object):
    #WTF_CSRF_ENABLED = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = '1234'
    MYSQL_DB = 'cisco'
    DB_ENGINE = 'MYSQL_DB'
    debug_config = True
    DEBUG = True
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    MYSQL_DATABASE_HOST = MYSQL_HOST
    MYSQL_DATABASE_USER = MYSQL_USER
    MYSQL_DATABASE_PASSWORD = MYSQL_PASSWORD
    MYSQL_DATABASE_DB = MYSQL_DB

# ProdConfig contains the credentials relevant to Cisco databases.
class ProdConfig(object):
    MYSQL_HOST = '10.203.48.106'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'Cisco@123'
    # MYSQL_DB = 'wcapiv1'
    #MYSQL_DB = 'wordcraft_jan'
    MYSQL_DB = 'wordcraft_dr'
    # MYSQL_DB = 'wc01102018'
    DB_ENGINE = 'MYSQL_DB'
    debug_config = True
    DEBUG = True
    HIVE_HOST = 'hdprd1-edge-lb01'
    HIVE_USER = 'hdpgcsana'
    HIVE_PASSWORD = 'DSxx1$#@'    #'GCsa2$#@'
    HIVE_DB  = 'gcsana'
    HIVE_PORT = 20000
    HIVE_AUTH = 'LDAP'
    # Google Cloud
    GCP_HOST = '35.227.156.165'
    GCP_PORT = 3306
    GCP_USER = 'admin'  #root
    GCP_PASSWORD = 'Cisco123$'  #CiscoGVS123
    GCP_DB = 'wordcraft'    #'wordcraft_dev'
    MYSQL_DATABASE_HOST = GCP_HOST  #MYSQL_HOST  
    MYSQL_DATABASE_USER = GCP_USER  #MYSQL_USER  
    MYSQL_DATABASE_PASSWORD = GCP_PASSWORD  #MYSQL_PASSWORD  
    MYSQL_DATABASE_DB = GCP_DB    #MYSQL_DB    

# AnuragConfig contains the credentials relevant to Anurag's local system.
class AnuragConfig(object):
    #WTF_CSRF_ENABLED = True
    MYSQL_HOST = 'localhost'
    MYSQL_PORT = 5000
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'root'
    MYSQL_DB = 'cisco_feb'  #'cisco_dec'
    DB_ENGINE = 'MYSQL_DB'
    debug_config = True
    DEBUG = True
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    # Google Cloud
    GCP_HOST = 'localhost'  # '35.227.156.165'
    GCP_PORT = 3306
    GCP_USER = 'admin'  #root
    GCP_PASSWORD = 'Cisco123$'  #CiscoGVS123
    GCP_DB = 'wordcraft_dev'
    MYSQL_DATABASE_HOST = MYSQL_HOST
    MYSQL_DATABASE_PORT = MYSQL_PORT
    MYSQL_DATABASE_USER = MYSQL_USER
    MYSQL_DATABASE_PASSWORD = MYSQL_PASSWORD
    MYSQL_DATABASE_DB = MYSQL_DB

class TestConfig(object):
    #WTF_CSRF_ENABLED = True
    MYSQL_HOST = '10.155.228.66'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'Cisco@123'
    MYSQL_DB = 'wordcraft_dr'
    DB_ENGINE = 'MYSQL_DB'
    debug_config = True
    DEBUG = True
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    MYSQL_DATABASE_HOST = MYSQL_HOST
    MYSQL_DATABASE_USER = MYSQL_USER
    MYSQL_DATABASE_PASSWORD = MYSQL_PASSWORD
    MYSQL_DATABASE_DB = MYSQL_DB