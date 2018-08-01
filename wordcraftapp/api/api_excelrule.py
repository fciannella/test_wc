from flask import request
from flask_restful import Resource
from csv import reader

from wordcraftapp.api.mylogging import configure_logger
from wordcraftapp.api.api_rule_parser import ruleToJson

logger = configure_logger('default')


# -*- coding: utf-8 -*-
"""
Created on Wed Jul 18 01:31:32 2018

@author: anil
"""

import pandas as pd
#import re


# file = pd.read_excel("SNTC_Copy_Draft v4.0.xlsx", 'Copy')

# file.set_index('Tag', inplace = True)

#text = '''You have <ChassisTotal> <ChassisTotal + CardsTotal> - <ChassisUncovered + CardsUncovered>  devices that have service coverage, and <ChassisUncovered + CardsUncovered> uncovered items. We recommend that you get coverage for all relevant devices. Don't miss out on 24-hour access to technical assistance (TAC), critical software upgrades, and important online resources.'''
#columns = ['LastUploadDate','ChassisTotal','CardsTotal','CollectorVersion','ChassisUncovered','CardsUncovered','DevicesExpiringinNext90Days','Past_LDoS','LDoS_12','DeviceswithPSIRT']

def replaceColumns(text):
    text = text.replace('<','[[')
    text = text.replace('>',']]')
#    for cname in columns: 
#            text = re.sub('<'+str(cname), '[['+str(cname), str(text), flags=re.IGNORECASE)
#            text = re.sub(str(cname)+'>', str(cname)+']]', str(text), flags=re.IGNORECASE)
         
    return text

def resolveCond(cond):
    cond  = cond.lstrip()
    cond = cond.rstrip()
    return cond  

def makeExcelRule(file):
    all_tags_rule = []
    for tag,row in file.iterrows():
        print("tag",tag)
        print("type",type(tag))
        if (pd.isnull(tag)):
            pass
        elif tag is None:
            pass
        else:

            # print("tag\t",tag,"\nrow\n",row)
            rule = ''
            rule = rule + '&lt;' + str(tag) + '&gt;'
            ifFlag=0
            flag = ''
            for cname,value in row.items():
                if (pd.isnull(value)):
                    pass
                elif (pd.isnull(cname)):
                    pass
                elif cname.startswith(('Condition','condition')):
        #            print("cname\t",cname)
                    if value == 'STATIC' or value == 'VARIABLE' or value == 'STATIC / VARIABLE':
                        print("came in static")
                        pass
                    
                    elif value.startswith(('if','If')):
        #                print("came in if")
                        flag = 'ifText'
                        if ifFlag ==0:
                            rule = rule + '[[if(' + resolveCond(value[2:]) + '){'
                            ifFlag = 1
                        else:
                            rule = rule + 'elseif(' + resolveCond(value[2:]) + '){'
                    elif value.startswith(('ELSE()','ELSE','else','Else')):
                        flag = 'elseText'
                        rule = rule + 'else(){'
                    
                elif cname.startswith(('Text','text')):
        #            print("came in text")
                    rule = rule + replaceColumns(value)
                    
                    if flag == 'ifText':
                        rule = rule + '}'
                    elif flag == 'elseText':
                        rule = rule + '}]]'
                        ifFlag = 0
                    flag = ''
            print("ifFlag",ifFlag)
            if ifFlag == 1:
                rule = rule + ']]'
                
            rule = rule + '&lt;/' + str(tag) + '&gt;' + '\\n\\n'
            
            all_tags_rule.append(rule)
                        
    finalRule = ''
    for one_rule in all_tags_rule:
        finalRule = finalRule + '<p>' + one_rule + '</p>'
        
    return finalRule


class importExcel (Resource):
    def post(self):
        try:

            content = request.get_json()
            # print(content)

            # username = content['user']
            # campaignname = content['campaign'][0]
            # personaname = content['previewPersona'][0]
            # featurename = content['previewFeature'][0]
            # language = content['language']
            fileData = content['file']

            updatedData = {}

            for a in fileData:
                updatedData.update(a)

            emptyKeys = []

            for key,value in updatedData.items():
                checkData = [value]
                for line in reader(checkData):
                    splitData = [None if x=='' else x for x in line]
                # print("splitData",splitData)
                if (len(splitData) == 1) or splitData== []:
                    emptyKeys.append(key)
                else:
                    updatedData[key] = splitData
                    # print("lengh of data",len(splitData), "key \t",key)

            # print("emptyKeys",emptyKeys)
            # print("updatedData b",updatedData)

            for key in emptyKeys:
                updatedData.pop(key)
            # print("updatedData",len(updatedData))
            updatedData = {int(k):v for k,v in updatedData.items()}
            # print("updatedData",updatedData)


            excelFile = pd.DataFrame(updatedData)
            excelFile = excelFile.transpose()
            excelFile.set_index(0,inplace = True)
            excelFile.columns = excelFile.iloc[0]
            excelFile = excelFile.drop(excelFile.index[0])
            
            
            print("\n\n\nexcelFile",excelFile)

            textRule = makeExcelRule(excelFile)
            jsonRule = ruleToJson(textRule)


            data = {"rule":[textRule],"jsonRule":jsonRule,"narrative":[''],"header":[],"values":[], "html":"", "csvStatus":"success"}
            # data = {"narrative": [narrative], "header": header, "values": finalval, "rule": [template_no_fr] , "html" : '',"jsonRule":jsonRule}
            # print("data",data)
        except:
            data = {"rule":"","jsonRule":{"id":'idSection0',"title":"new_section","text":""},"narrative":[''],"header":[],"values":[], "html":"", "csvStatus":"fail"}

        return data

        





