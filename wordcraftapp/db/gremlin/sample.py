from gremlin_python import statics
from gremlin_python.structure.graph import Graph
from gremlin_python.process.graph_traversal import __
from gremlin_python.process.strategies import *
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection

graph = Graph()
g = graph.traversal().withRemote(DriverRemoteConnection('ws://hdprd1-r01-edge-01:8182/gremlin','g'))
#g.addV("John")
g.addV('person').property('name', 'me').next()
#print(g.V().toList())
#g.addV('person').property('name', 'you').next()
#print(g.V().toList())

#print(g.V().toList())