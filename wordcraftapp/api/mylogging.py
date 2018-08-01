import logging
import logging.config


def configure_logger(name):
    
    config = {
            'version': 1,
            'formatters': {
                'default': {'format': '%(asctime)s - %(levelname)s - %(message)s', 'datefmt': '%Y-%m-%d %H:%M:%S'}
            },
            'handlers': {
                'file': {
                    'level': 'DEBUG',
                    #Rotating file handler has issues with Windows. (https://bugs.python.org/issue25121)
                    'class': 'logging.handlers.RotatingFileHandler',
                    'formatter': 'default',
                    'filename': 'log.txt',
                    'maxBytes': 307200,
                    'backupCount': 3
                }
            },
            'loggers': {
                'default': {
                    'level': 'DEBUG',
                    'handlers': ['file']
                }
            },
            'disable_existing_loggers': False
        }
        
    logging.config.dictConfig(config)
    
    return logging.getLogger(name)