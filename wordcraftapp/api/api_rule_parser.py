# -*- coding: utf-8 -*-
"""
Created on Tue Jun 26 00:01:58 2018

@author: anil
"""

from bs4 import BeautifulSoup
import re
import shlex
from collections import deque


def getIndex(s, sm, em, i):

    d = deque()

    for k in range(i, len(s)):

        if s[k] == em:
            d.popleft()

        elif s[k] == sm:
            d.append(s[i])

        if not d:
            return k

def findIfs(rule):
    allIfs = []
    while '[[if' in rule:
        ifElseBlock = {}

        ifcheck = [m.start () for m in re.finditer ("\[\[if", rule)]
        # print("ifcheck\n\n",ifcheck)
        if len(ifcheck) !=0:
            ifElseBlock['prevText'] = rule.split('[[if(',1)[0]
            closeif = getIndex(rule,'[',']',ifcheck[0])
            # print("closeif\n",closeif)
            ifElseBlock['ifElse'] = rule[ifcheck[0]+2:closeif-1]
            rule = rule[closeif+1:len(rule)]
            ifElseBlock['nextText'] = ''
            if '[[if' not in rule:
                ifElseBlock['nextText'] = rule
            allIfs.append(ifElseBlock)

        else:
            break
    return allIfs

def getCond(cond):
    final = []
    oneCond = {"fun":"","parameter1":"","operator":"","parameter2":"","cond":""}
    condType = ''
    if any(x in cond for x in ["=","==","<",">","!=","in","<=",">="]):
        if all(x not in cond for x in ["(",")","are","is"]):
            allCond = shlex.split(cond, posix = False)
        
            i = 0
            for a in allCond:

                if i == 0:
                    if a.startswith('[['):
                        a = a[2:len(a)-2]
                        b = a.split('(',1)
                        oneCond["fun"] = b[0]
                        oneCond["parameter1"] = b[1].split(')',1)[0]

                    else:
                        oneCond["fun"] = ""
                        oneCond["parameter1"] = a
                elif i ==1:
                    oneCond["operator"] = a
                elif i==2:
                    oneCond["parameter2"] = a
                    if oneCond['operator'] == 'in':
                        oneCond['operator'] = 'contains'
                        oneCond['parameter1'], oneCond['parameter2'] = oneCond['parameter2'], oneCond['parameter1']
                elif i==3:
                    oneCond["cond"] = a
                    final.append(oneCond)
                    oneCond = {"fun":"","parameter1":"","operator":"","parameter2":"","cond":""}

                i = i+1
                if i ==4:
                    i = 0
            final.append(oneCond)
            condType = 'simple'
            condText = ''
        else:
            final.append(oneCond)
            condType = 'complex'
            condText = str(cond)

    else:
        final.append(oneCond)
        condType = 'complex'
        condText = str(cond)

    return final,condType,condText


def getIfElse (ifelse,ifElseId,ifId = None,cond = None):
    rule = ifelse['ifElse']
    final = {"conditionIf":"","text":"","elseIfBlock":[],"elseText":"","prevText":"","nextText":""}
    final["prevText"] = ifelse['prevText']
    final["nextText"] = ifelse['nextText']
    j=0
    k=0
    while len(rule) != 0:
        if rule.startswith('if('):

            if ifId == None:
                final["id"] = str(ifElseId)+'_'+str(cond)+'{}'.format(k)
            else:
                final["id"] = str(ifElseId)+'_'+str(cond)+'{}'.format(ifId)


            condIndex = getIndex(rule,'(',')',2)
            cond = rule[3:condIndex]

            resolvedCond = getCond(cond)

            final["conditionIf"] = resolvedCond[0]
            final["conditionType"] = resolvedCond[1]
            final["conditionText"] = resolvedCond[2]

            valueIndex = getIndex(rule,'{','}',condIndex+1)

            if valueIndex == None:
                final["text"] = rule[condIndex+2:len(rule)]
                rule = ''
            else:
                final["text"] = rule[condIndex+2:valueIndex]
                rule = rule[valueIndex+1:len(rule)]
                rule = rule.lstrip()

            if '[[if' in final["text"]:
                text = final["text"]
                final["text"]= ""
                allTextIfs = findIfs(text)
                b = []
                for j,oneIfSection in enumerate(allTextIfs):
                    nestedIfElse = getIfElse(oneIfSection,final['id'],j,cond = 'ifelse')
                    b.append(nestedIfElse)
                final["ifElseBlock"] = b

            k = k+1

        elif rule.startswith('elseif('):
            elseIfSection = {}
            elseIfSection["prevText"] = ""
            elseIfSection["nextText"] = ""

            elseIfSection["id"] = str(final["id"])+'_elseif{}'.format(j)

            condIndex = getIndex(rule,'(',')',6)
            cond = rule[7:condIndex]

            resolvedCond = getCond(cond)
            elseIfSection["conditionIf"] = resolvedCond[0]
            elseIfSection["conditionType"] = resolvedCond[1]
            elseIfSection["conditionText"] = resolvedCond[2]

            valueIndex = getIndex(rule,'{','}',condIndex+1)

            if valueIndex ==None:
                elseIfSection["elseIfText"] = rule[condIndex+2:len(rule)]
                rule = ''
            else:
                elseIfSection["elseIfText"] = rule[condIndex+2:valueIndex]
                rule = rule[valueIndex+1:len(rule)]
                rule = rule.lstrip()

            if '[[if' in elseIfSection["elseIfText"]:
                text = elseIfSection["elseIfText"]
                elseIfSection["elseIfText"]= ""
                allTextIfs = findIfs(text)
                b = []
                for j,oneIfSection in enumerate(allTextIfs):
                    nestedIfElse = getIfElse(oneIfSection,elseIfSection["id"],j,cond = 'ifelse')
                    b.append(nestedIfElse)
                elseIfSection["ifElseBlock"] = b

            final["elseIfBlock"].append(elseIfSection)

            j = j+1
        elif rule.startswith('else('):
            valueIndex = getIndex(rule,'{','}',6)

            if valueIndex == None:
                final["elseText"] = rule[7:len(rule)]
                rule = ''
            else:
                final["elseText"] = rule[7:valueIndex]
                rule = rule[valueIndex+1:len(rule)]
                rule = rule.lstrip()

            if '[[if' in final["elseText"]:
                text = final["elseText"]
                final["elseText"]= ""
                allTextIfs = findIfs(text)
                b = []
                for j,oneIfSection in enumerate(allTextIfs):
                    nestedIfElse = getIfElse(oneIfSection,final['id'],j,cond = 'else')
                    b.append(nestedIfElse)
                final["elseBlock"] = b
        elif rule[1:].startswith(('if(','elseif(','else(')):
            rule = rule [1:]
        else:
            print("not correctly formated",rule)
            final['elseText'] = 'Not correctly formated : ' + rule
            break
    return final


def simpleText(rule,ifElseId):
    allTextIfs = findIfs(rule)
    # print("allTextIfs",allTextIfs)
    final = []
    for j,oneIfSection in enumerate(allTextIfs):
        # print("oneIfSection",oneIfSection)
        nestedIfElse = getIfElse(oneIfSection,ifElseId,j,cond = 'ifelse')
        final.append(nestedIfElse)

    return final

def makeCond(condData):
    c = ""
    for cond in condData:

        cname = cond['parameter1']
        value = cond['parameter2']

        if cond["fun"] !="":

            cname = '[['+ cond['fun'] + '(' + cond['parameter1'] + ')]]'


        if cond['operator'] == 'contains':

            c = c + value + ' ' + 'in' + ' ' + cname
        else:

            c = c + cname + ' ' + cond['operator'] + ' ' + value

        if cond['cond'] != '':
            c = c  + ' ' + cond['cond'] + ' '

    return c


def makeRule(ifElseData,rule,ifFlag = 0):
    addSpace = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'

    for ifElseBlock in ifElseData:
#        print("ifElseBlock",ifElseBlock)
        # print("rule before",rule)

        if ifFlag == 0:

            rule = rule + '<p>' + ifElseBlock['prevText'] +'[[if('
        else:
            rule = rule + '<p>' + ifElseBlock['prevText'] +addSpace+'[[if('

        if ifElseBlock['conditionType'] == 'complex':
            rule = rule + ifElseBlock['conditionText']
        else:
            rule = rule + makeCond(ifElseBlock['conditionIf'])

        rule = rule + '){' + ifElseBlock["text"]

        if 'ifElseBlock' in ifElseBlock.keys():
            rule = rule + '</p>\n' 
            rule = makeRule(ifElseBlock['ifElseBlock'],rule,ifFlag = 1)
        rule = rule + '}' 

        if 'elseIfBlock' in ifElseBlock.keys():

            for elseifBlock in ifElseBlock['elseIfBlock']:

                if ifFlag == 0:
                    rule = rule+ '</p>\n<p>' +'elseif(' 
                else:
                    rule = rule + '</p>\n<p>' +addSpace +'elseif(' 

                if elseifBlock['conditionType'] =='complex':
                    rule = rule + elseifBlock['conditionText']
                else:
                    rule = rule + makeCond(elseifBlock['conditionIf'])
                # print("elseIfText",elseifBlock["elseIfText"])
                rule = rule + '){' + elseifBlock["elseIfText"] 

                if 'ifElseBlock' in elseifBlock.keys():
                    rule = rule + '</p>\n'
                    rule = makeRule(elseifBlock['ifElseBlock'],rule,ifFlag = 1)

                rule = rule + '}' + elseifBlock['nextText']

        if 'elseBlock' in ifElseBlock.keys():
            if (ifFlag == 0):
                rule = rule+ '</p>\n<p>' +'else(){' + ifElseBlock["elseText"] + '</p>\n'
            else:
                rule = rule+ '</p>\n<p>' + addSpace +'else(){' + ifElseBlock["elseText"] + '</p>\n'

            rule = makeRule(ifElseBlock['elseBlock'], rule, ifFlag = 1)
            rule = rule + '}]]'
        elif ifElseBlock['elseText'] != '':
            if (ifFlag == 0):
                rule = rule+ '</p>\n<p>' +'else(){' + ifElseBlock["elseText"] + '}]]'
            else:
                rule = rule+ '</p>\n<p>' + addSpace +'else(){' + ifElseBlock["elseText"] + '}]]'
        else:
            rule = rule + ']]'
        if (ifFlag == 0):
            rule  = rule + '</p>\n<p>'+ifElseBlock['nextText'] + '</p>\n'
        else:
            if ifElseBlock['nextText'] != '':

                rule  = rule + '</p>\n<p>' + addSpace +ifElseBlock['nextText']

    return rule

def ruleToJson(rule):

    if rule.startswith ("<p>") or "<br />" in rule:
        soup = BeautifulSoup (rule, "html.parser")
        rule = soup.get_text ()
    soup = BeautifulSoup (rule, "html.parser")

    i=0
    finalRule = []
    for tag in soup.find_all ():
        tagStr = tag.string

        sectionRule = {}
        sectionRule["id"] = 'idSection{}'.format(i)
        sectionRule["title"] = tag.name

        if((tagStr == None) or (tagStr == "") or (not tagStr)):
            sectionRule["text"] = ""
        else:
            tagStr = tagStr.replace('\n','')
            tagStr = tagStr.replace('\xa0','')

            if '[[if' not in tagStr:
                sectionRule["text"] = tagStr
            else:
                text = tagStr
                sectionRule["text"] = ''
                ifElseId = sectionRule["id"]
                block = simpleText(text,ifElseId)
                sectionRule["ifElseBlock"] = block
        finalRule.append(sectionRule)
        i = i+1
    if (finalRule == []):
        sectionRule = {"id":'idSection0',"title":"new_section","text":""}
        finalRule.append(sectionRule)

    return finalRule

def jsonToRule(data):

    rule = ''

    for section in data:
        rule = rule + '<p>' +'&lt;' + str(section['title']) + '&gt;' + '</p>\n'
        if 'ifElseBlock' not in section.keys():
            rule = rule + '<p>'+str(section['text'])+'</p>\n'+ '<p>' + '&lt;/' + str(section['title']) + '&gt;'  + '\\n\\n' + '</p>\n'
        else:
            ifElseBlock = section['ifElseBlock']
            text = ''
            text = makeRule(ifElseBlock,text)
            rule = rule + text + '<p>' + '&lt;/' + str(section['title']) + '&gt;' + '\\n\\n' + '</p>\n'

    return rule
