# from flask import request
# from flask_restful import Resource

# from wordcraftapp.extentions import mysql

# # To get dataset associated to a campaign 

# class getdataset (Resource):
#     def post(self):
#         content = request.get_json ()
#         username = content['user']
#         campaignname = content['campaign']

#         cur = mysql.connect ().cursor ()
#         cur.execute (
#             "SELECT a.dataset FROM user u JOIN user_campaign_xref us ON u.user_id=us.user_user_id JOIN campaign a ON us.campaign_campaign_id=a.campaign_id WHERE u.email='" + username + "' AND campaign_name='" + campaignname + "'")
#         rv = cur.fetchall ()
#         data = {"dataset": rv[0][0]}

#         print (rv)
#         return data

# # Updating a dataset correspond to a campaign

# class updatedataset (Resource):
#     def put(self):
#         content = request.get_json ()
#         username = content['user']
#         campaignname = content['campaign']
#         datasetname = content['dataset']
#         cur = mysql.connect ().cursor ()

#         cur.execute (
#             "SELECT a.campaign_id FROM user u JOIN user_campaign_xref us ON u.user_id=us.user_user_id JOIN campaign a ON us.campaign_campaign_id=a.campaign_id WHERE u.email='" + username + "' AND campaign_name='" + campaignname + "'")
#         rv = cur.fetchall ()
#         cid = rv[0]

#         cur.execute ("UPDATE campaign SET dataset=%s WHERE campaign_id=%s", (datasetname, cid))

#         mysql.connect ().commit ()
