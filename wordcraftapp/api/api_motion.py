# from flask import request
# from flask_restful import Resource

# from wordcraftapp.extentions import mysql


# class getmotion(Resource):
#     def post(self):
#         content = request.get_json()
#         username = content['user']
#         segmentname = content['segment']
#         # segmentname=request.args.get('segment')

#         cur = mysql.connect ().cursor ()

#         cur.execute(
#             "SELECT c.motion_name from user u join user_segment_xref us on u.user_id=us.user_user_id join segment a on us.segment_segment_id=a.segment_id join segment_motion_xref b on a.segment_id=b.segment_segment_id join motion c on b.motion_motion_id=c.motion_id where u.email='" + username + "' AND a.segment_name='" + segmentname + "'")

#         rv = cur.fetchall()
#         data = {"motions": [x[0] for x in rv]}
#         return data


# class updatemotion(Resource):
#     def put(self):
#         content = request.get_json()
#         username = content['user']
#         segmentname = content['segment']
#         motionname_old = content['motion']
#         motionname_new = content['updateMotion']
#         cur = mysql.connect ().cursor ()

#         cur.execute(
#             "select d.motion_id from segment a join segment_motion_xref c on s.segment_id=c.segment_segment_id join motion d on c.motion_motion_id=d.motion_id where s.segment_name= '" + segmentname + "' and d.motion_name='" + motionname_old + "'")

#         rv = cur.fetchall()
#         motionid = rv[0]

#         cur.execute("update motion set motion_name=%s where motion_id=%s", (motionname_new, motionid))

#         mysql.connect ().commit ()


# class addmotion(Resource):
#     def post(self):
#         content = request.get_json()
#         segmentname = content['segment']
#         motionname = content['newMotion']
#         motiondescription = "No description added"

#         cur = mysql.connect ().cursor ()
#         cur.execute("insert into motion(motion_name,motion_description,motion_createdate) values(%s,%s,CURDATE())",
#                     (motionname, motiondescription))
#         mysql.connect ().commit ()

#         cur.execute("select segment_id from segment where segment_name='" + segmentname + "'")
#         rv = cur.fetchall()
#         segmentid = rv[0]
#         cur.execute("select motion_id from motion ORDER BY motion_id DESC LIMIT 1")
#         data = cur.fetchall()
#         motionid = data[0]

#         cur.execute("insert into segment_motion_xref(segment_segment_id,motion_motion_id) values(%s,%s)",
#                     (segmentid, motionid))
#         mysql.connect ().commit ()


# class deletemotion(Resource):
#     def delete(self):
#         content = request.get_json()
#         username = content['user']
#         segmentname = content['segment']
#         motionname = content['deleteMotion']
#         cur = mysql.connect ().cursor ()
#         cur.execute(
#             "select c.motion_id from user u join user_segment_xref us on u.user_id=us.user_user_id join segment a on us.segment_segment_id=a.segment_id join segment_motion_xref b on a.segment_id=b.segment_segment_id join motion c on b.motion_motion_id=c.motion_id where u.email='" + username + "' AND motion_name='" + motionname + "' and segment_name='" + segmentname + "'")
#         rv = cur.fetchall()
#         motionids = str(sum(rv, ()))
#         motionids_1 = motionids.replace("L,)", ")")
#         motionids = motionids_1.replace(",)", ")")

#         cur.execute("select persona_persona_id from motion_persona_xref where motion_motion_id in " + str(motionids))
#         rv = cur.fetchall()
#         personaids = str(sum(rv, ()))
#         personaids_1 = personaids.replace("L,", ",").replace("L)", ")")
#         personaids = personaids_1.replace(",)", ")")

#         if personaids == '()':
#             cur.execute("delete from segment_motion_xref where motion_motion_id in " + str(motionids))
#             mysql.connect ().commit ()
#             cur.execute("delete from motion where motion_id in " + str(motionids))
#             mysql.connect ().commit ()
#         else:
#             cur.execute(
#                 "select feature_feature_id from persona_feature_xref where persona_persona_id in " + str(personaids))
#             rv = cur.fetchall()
#             featureids = str(sum(rv, ()))
#             featureids_1 = featureids.replace("L,", ",").replace("L)", ")")
#             featureids = featureids_1.replace(",)", ")")

#             cur.execute(
#                 "SELECT language_language_id from feature_language_xref where feature_feature_id in " + str(featureids))
#             rv = cur.fetchall()
#             languageids = str(sum(rv, ()))
#             languageidsids_1 = languageidsids.replace("L,)", ")")
#             languageids = languageids_1.replace(",)", ")")
#             cur.execute("delete from segment_motion_xref where motion_motion_id in " + str(motionids))
#             mysql.connect ().commit ()
#             cur.execute("delete from motion_persona_xref where motion_motion_id in " + str(motionids))
#             mysql.connect ().commit ()
#             cur.execute("delete from motion where motion_id in " + str(motionids))
#             mysql.connect ().commit ()
#             cur.execute("delete from persona_feature_xref where persona_persona_id in " + str(personaids))
#             mysql.connect ().commit ()
#             cur.execute("delete from persona where persona_id in " + str(personaids))
#             mysql.connect ().commit ()
#             if featureids != '()':
#                 cur.execute("delete from feature_language_xref where feature_feature_id in " + str(featureids))
#                 mysql.connect ().commit ()
#                 cur.execute("delete from feature where feature_id in " + str(featureids))
#                 mysql.connect ().commit ()
#                 cur.execute("delete from language where language_id in " + str(languageids))
#                 mysql.connect ().commit ()
