from flask import request
from flask_restful import Resource

from wordcraftapp.extentions import mysql

from wordcraftapp.api.mylogging import configure_logger

logger = configure_logger('default')

def updateUser(username,updateusername,campaignname,new_role):

    conn = mysql.connect ()
    cur = conn.cursor ()

    cur.execute(
            "SELECT c.role from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where c.campaign_name ='"+campaignname+"' and u.email = '"+updateusername+"'")
    rv = cur.fetchall()
    old_role = rv[0][0]
    print("here is old_role",old_role)

    # Checking if new role and old role is same

    if old_role != new_role:

        # Getting user id and campaign id for user with old role
        cur.execute(
            "SELECT u.user_id, c.campaign_id FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id WHERE u.email = '"+updateusername+"' AND c.campaign_name = '"+campaignname+"' AND c.role = '"+old_role+"'")
        ids = cur.fetchall ()
        uid = ids[0][0]
        cid = ids[0][1]

        # Deleting old access for user
        cur.execute (
            "DELETE FROM user_campaign_xref WHERE user_user_id = %s AND campaign_campaign_id = %s ",(uid,cid))
        conn.commit ()


        if old_role == 'Reviewer':

            # Deleting review role from campaign table
            cur.execute (
                "DELETE FROM campaign WHERE campaign_id = %s ",cid)
            conn.commit ()

            # Getting campaign id to give editor access
            cur.execute(
                "SELECT c.campaign_id from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where c.campaign_name ='"+campaignname+"' and u.email = '"+username+"'")
            access_cid = cur.fetchall ()

            cur.execute (
                "INSERT INTO `user_campaign_xref` VALUES(%s,%s)",(uid,access_cid))
            conn.commit ()

        elif old_role == 'Editor':


            cur.execute (
                "INSERT INTO campaign(campaign_name,role) VALUES(%s,%s) ",(campaignname,new_role))
            conn.commit ()

            cur.execute (
                "SELECT campaign_id FROM campaign ORDER BY campaign_id DESC LIMIT 1")
            cid = cur.fetchall ()

            cur.execute (
                "INSERT INTO `user_campaign_xref` VALUES (%s,%s) ",(uid,cid))
            conn.commit ()
    message = {"message":"User role is successfully updated "}
    return message


class campaigninfo (Resource):
    def post(self):
        content=request.get_json()
        username=content['user']

        cur = mysql.connect ().cursor ()

        #Getting campaign name ,user role and discription for user
        cur.execute(
              "SELECT c.campaign_name, c.role, c.campaign_description from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where u.email = '"+username+"' ")
        rv = cur.fetchall ()

        # Get right campaign id (can not select directly because reviewer role campaign id is different)
        campaign_data = {}
        for campaign in rv:
            cur.execute("SELECT c.campaign_id FROM campaign c WHERE c.campaign_name = '"+campaign[0]+"' AND c.role = 'Editor'")
            cid = cur.fetchall ()
            campaign_data[cid[0][0]] = campaign
        

        data = {"campaign":[x[0] for x in campaign_data.values()], "role":[x[1] for x in campaign_data.values()],
                "description":[x[2] for x in campaign_data.values()],"campaign_ids":[k for k in campaign_data.keys()]}


        return data

class settinginfo (Resource):
    def post(self):
        content=request.get_json()
        username=content['user']
        campaignname=content['campaign'][0]

        cur = mysql.connect ().cursor ()

        # Getting user access for selected campaign by joining user and campiagn table
        cur.execute(
            "SELECT u.email,c.role from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where c.campaign_name ='"+campaignname+"' and u.email != '"+username+"' order by u.email asc")
        rv = cur.fetchall ()

        data = {"email":[x[0] for x in rv], "role":[x[1] for x in rv]}
        print("data",data)

        return data

class userinfo (Resource):
    def post(self):
        content=request.get_json()
        username=content['user']
        campaignname=content['campaign'][0]

        cur = mysql.connect ().cursor ()

        cur.execute(
            "SELECT email FROM user WHERE email != '"+username+"'")
        ulist = cur.fetchall ()
        print("from user",ulist)

        # Getting list of all users
        cur.execute(
            "SELECT DISTINCT u.email from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where u.email != '"+username+"' and c.campaign_name = '"+campaignname+"'")
        rv = cur.fetchall ()

        sameuser = [x[0] for x in rv]

        cur.execute(
            "SELECT DISTINCT u.email from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where u.email != '"+username+"' and c.campaign_name != '"+campaignname+"'")
        unames = cur.fetchall ()

        unames = [x[0] for x in unames]

        users = []

        for a in unames:
            if a not in sameuser:
                users.append(a)

        for a in ulist :
            if a[0] not in sameuser:
                if a[0] not in unames:
                    users.append(a[0])

        return {"users": users}

class adduser (Resource):
    def post(self):
        content=request.get_json()
        username = content['user']
        newuser = content['addUser']
        campaignname = content['campaign'][0]
        new_role = content['role']
        conn = mysql.connect ()
        cur = conn.cursor ()

        # Checking if user is registered or not
        cur.execute (
            "SELECT user_id FROM user WHERE email ='"+newuser+"'")
        uid = cur.fetchall ()

        if uid == ():
            message = {"message":"User is not registered"}

        else:

            # Getting campaign id for new role
            cur.execute (
                "SELECT campaign_id FROM campaign WHERE campaign_name = '"+campaignname+"' AND role = '"+new_role+"'")
            cid = cur.fetchall ()

            # if there is no role for that campaign then adding the role first
            if cid == ():
                # if this condition true means new role is reviewer and there is no entry for reviewer campaign
                # Getting description for Editor campaign
                cur.execute (
                    "SELECT c.campaign_description FROM campaign c WHERE c.campaign_name = '"+campaignname+"'  AND c.role = 'Editor' ")
                c_des = cur.fetchall ()


                cur.execute (
                    "INSERT INTO campaign(campaign_name,campaign_description,campaign_createdate,is_active,role) VALUES(%s,%s,CURDATE(),0,%s) ",(campaignname,c_des[0],new_role))
                conn.commit ()


                cur.execute (
                    "SELECT campaign_id FROM campaign ORDER BY campaign_id DESC LIMIT 1")
                cid = cur.fetchall ()

            # Checking if there is role already assigned to user

            cur.execute(
                "SELECT c.role,c.campaign_id from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where c.campaign_name ='"+campaignname+"' and u.email = '"+newuser+"'")
            rv = cur.fetchall ()

            if rv == ():

                # If user has no access yet and
                # If new role given to user is 'Editor' then give access to campaigns else give only Review access

                cur.execute (
                    "INSERT INTO `user_campaign_xref` VALUES(%s,%s)",(uid,cid))
                conn.commit ()
                message = {"message":"User is successfully added"}

            elif (rv[0][0] != new_role):
                print("here is old id",rv[0][1])

                cur.execute (
                    "UPDATE user_campaign_xref SET campaign_campaign_id = '"+ str(cid[0][0]) +"' WHERE user_user_id = '"+ str (uid[0][0]) +"' AND campaign_campaign_id = '"+ str (rv[0][1]) +"'")
                conn.commit ()

                message = {"message": "User Role is successfully updated"}

            elif (rv[0][0] == new_role):

                message = {"message":"This Role is already assigned to user"}

        print("message",message)

        return message

class deleterole (Resource):
    def delete(self):
        content=request.get_json()
        username = content['updateUser']
        campaignname = content['campaign'][0]
        print(content)
        conn = mysql.connect ()
        cur = conn.cursor ()


        cur.execute(
            "SELECT u.user_id,c.campaign_id FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id WHERE u.email = '"+username+"' AND c.campaign_name = '"+campaignname+"'")
        ids = cur.fetchall ()

        for a in ids :
            uid = a[0]
            cid = a[1]

            cur.execute (
                "DELETE FROM user_campaign_xref WHERE user_user_id = %s AND campaign_campaign_id = %s ",(uid,cid))
            conn.commit ()
