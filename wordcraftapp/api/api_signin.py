from bcrypt import hashpw
from flask import request
from flask_restful import Resource

from wordcraftapp.extentions import mysql
from wordcraftapp.api.mylogging import configure_logger  

logger = configure_logger('default')


# Matching password
def CheckLogin(plain_text_password, hashed_password_from_db):
    plain_text_password = plain_text_password.encode ("utf-8")
    hashed_password_from_db = hashed_password_from_db.encode ("utf-8")
    return hashpw (plain_text_password, hashed_password_from_db) == hashed_password_from_db


class checksignin (Resource):
    def post(self):

        content = request.get_json ()
        email = content['email']
        password = content['password']
        cur = mysql.connect ().cursor ()
        cur.execute ("SELECT COUNT(*) FROM user WHERE email = '" + email + "'")
        ret = cur.fetchall ()
        # print (ret)
        ret = ret[0][0]
        if ret == 1:
            cur.execute ("SELECT password FROM user WHERE email = '" + email + "'")
            hashed = cur.fetchall ()
            hashed = hashed[0][0]
            ret = CheckLogin (plain_text_password=str (password),
                              hashed_password_from_db=str (hashed))
            em = False
            passw = ret

            if (ret):
                logger.info("User %s is successfully logged in",email)

                final = {"success": True}
            else:
                logger.info("User %s is trying to login with wrong password ",email)

                final = {"errors": {"password": True}}
        else:
            ret = False
            em = True
            passw = False
            final = {"errors": {"email": True}}
            logger.info("User %s is not found in database",email)
            

        return final
