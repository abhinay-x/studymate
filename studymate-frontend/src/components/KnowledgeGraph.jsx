import { useState, useEffect, useRef } from 'react'
import { Network, Search, Plus, Minus, RotateCcw, Download, Share } from 'lucide-react'

function KnowledgeGraph({ documents, questions = [] }) {
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [zoomLevel, setZoomLevel] = useState(1)
  const canvasRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  // Generate knowledge graph from documents and Q&A
  useEffect(() => {
    const concepts = new Map()
    const relations = []

    // Extract concepts from documents
    documents.forEach(doc => {
      const docConcepts = extractConceptsFromDocument(doc)
      docConcepts.forEach(concept => {
        if (!concepts.has(concept.name)) {
          concepts.set(concept.name, {
            id: concept.name,
            name: concept.name,
            type: 'concept',
            source: doc.name,
            frequency: 1,
            x: Math.random() * 600 + 100,
            y: Math.random() * 400 + 100,
            connections: []
          })
        } else {
          concepts.get(concept.name).frequency++
        }
      })
    })

    // Extract concepts from Q&A
    questions.forEach(q => {
      const questionConcepts = extractConceptsFromText(q.question + ' ' + q.answer)
      questionConcepts.forEach(concept => {
        if (!concepts.has(concept)) {
          concepts.set(concept, {
            id: concept,
            name: concept,
            type: 'learned',
            source: 'Q&A Session',
            frequency: 1,
            x: Math.random() * 600 + 100,
            y: Math.random() * 400 + 100,
            connections: []
          })
        } else {
          concepts.get(concept).frequency++
        }
      })
    })

    // Add sample knowledge graph if no data
    if (concepts.size === 0) {
      const sampleNodes = [
        { id: 'ml', name: 'Machine Learning', type: 'concept', source: 'ML Textbook', frequency: 10, x: 400, y: 200, connections: ['supervised', 'unsupervised', 'reinforcement'] },
        { id: 'supervised', name: 'Supervised Learning', type: 'concept', source: 'ML Textbook', frequency: 8, x: 200, y: 150, connections: ['classification', 'regression'] },
        { id: 'unsupervised', name: 'Unsupervised Learning', type: 'concept', source: 'ML Textbook', frequency: 6, x: 600, y: 150, connections: ['clustering', 'dimensionality'] },
        { id: 'reinforcement', name: 'Reinforcement Learning', type: 'concept', source: 'ML Textbook', frequency: 4, x: 400, y: 350, connections: ['rewards', 'policy'] },
        { id: 'classification', name: 'Classification', type: 'learned', source: 'Q&A Session', frequency: 5, x: 100, y: 100, connections: ['decision-trees', 'svm'] },
        { id: 'regression', name: 'Regression', type: 'learned', source: 'Q&A Session', frequency: 5, x: 300, y: 100, connections: ['linear', 'polynomial'] },
        { id: 'clustering', name: 'Clustering', type: 'concept', source: 'ML Textbook', frequency: 4, x: 500, y: 100, connections: ['kmeans', 'hierarchical'] },
        { id: 'dimensionality', name: 'Dimensionality Reduction', type: 'concept', source: 'ML Textbook', frequency: 3, x: 700, y: 100, connections: ['pca', 'tsne'] },
        { id: 'decision-trees', name: 'Decision Trees', type: 'learned', source: 'Q&A Session', frequency: 3, x: 50, y: 50, connections: [] },
        { id: 'svm', name: 'Support Vector Machines', type: 'learned', source: 'Q&A Session', frequency: 3, x: 150, y: 50, connections: [] },
        { id: 'linear', name: 'Linear Regression', type: 'learned', source: 'Q&A Session', frequency: 4, x: 250, y: 50, connections: [] },
        { id: 'polynomial', name: 'Polynomial Regression', type: 'learned', source: 'Q&A Session', frequency: 2, x: 350, y: 50, connections: [] },
        { id: 'kmeans', name: 'K-Means', type: 'learned', source: 'Q&A Session', frequency: 3, x: 450, y: 50, connections: [] },
        { id: 'hierarchical', name: 'Hierarchical Clustering', type: 'learned', source: 'Q&A Session', frequency: 2, x: 550, y: 50, connections: [] },
        { id: 'pca', name: 'Principal Component Analysis', type: 'learned', source: 'Q&A Session', frequency: 3, x: 650, y: 50, connections: [] },
        { id: 'tsne', name: 't-SNE', type: 'learned', source: 'Q&A Session', frequency: 2, x: 750, y: 50, connections: [] },
        { id: 'rewards', name: 'Reward Systems', type: 'concept', source: 'ML Textbook', frequency: 2, x: 350, y: 400, connections: [] },
        { id: 'policy', name: 'Policy Learning', type: 'concept', source: 'ML Textbook', frequency: 2, x: 450, y: 400, connections: [] }
      ]
      
      sampleNodes.forEach(node => concepts.set(node.id, node))
    }

    setNodes(Array.from(concepts.values()))
    
    // Generate connections
    const nodeConnections = []
    concepts.forEach(node => {
      node.connections.forEach(connectionId => {
        if (concepts.has(connectionId)) {
          nodeConnections.push({
            source: node.id,
            target: connectionId,
            strength: Math.min(node.frequency, concepts.get(connectionId).frequency)
          })
        }
      })
    })
    
    setConnections(nodeConnections)
  }, [documents, questions])

  const extractConceptsFromDocument = (doc) => {
    // Simplified concept extraction - in real app, use NLP
    const concepts = []
    const keywords = ['machine learning', 'neural network', 'algorithm', 'data', 'model', 'training', 'prediction']
    
    keywords.forEach(keyword => {
      if (doc.name.toLowerCase().includes(keyword)) {
        concepts.push({ name: keyword, frequency: 1 })
      }
    })
    
    return concepts
  }

  const extractConceptsFromText = (text) => {
    // Simplified concept extraction
    const concepts = []
    const keywords = ['learning', 'model', 'data', 'algorithm', 'prediction', 'classification', 'regression']
    
    keywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        concepts.push(keyword)
      }
    })
    
    return concepts
  }

  const filteredNodes = nodes.filter(node => 
    node.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getNodeColor = (node) => {
    switch (node.type) {
      case 'concept': return '#1E40AF' // Primary blue
      case 'learned': return '#059669' // Secondary green
      case 'document': return '#F59E0B' // Accent amber
      default: return '#64748B' // Slate
    }
  }

  const getNodeSize = (frequency) => {
    return Math.max(20, Math.min(60, frequency * 5))
  }

  const handleNodeClick = (node) => {
    setSelectedNode(node)
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5))
  }

  const resetView = () => {
    setZoomLevel(1)
    setSelectedNode(null)
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Network className="w-5 h-5 text-primary-600" />
            <span>🧠 Knowledge Network</span>
          </h3>
          <div className="flex space-x-2">
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex space-x-1">
            <button
              onClick={handleZoomOut}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-2 py-2 text-sm text-slate-600 min-w-12 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="relative" style={{ height: '500px' }}>
        <svg
          ref={canvasRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
          className="bg-slate-50"
        >
          {/* Connections */}
          {connections.map((connection, index) => {
            const sourceNode = nodes.find(n => n.id === connection.source)
            const targetNode = nodes.find(n => n.id === connection.target)
            
            if (!sourceNode || !targetNode) return null
            
            return (
              <line
                key={index}
                x1={sourceNode.x * zoomLevel}
                y1={sourceNode.y * zoomLevel}
                x2={targetNode.x * zoomLevel}
                y2={targetNode.y * zoomLevel}
                stroke="#CBD5E1"
                strokeWidth={Math.max(1, connection.strength)}
                opacity={0.6}
              />
            )
          })}

          {/* Nodes */}
          {filteredNodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x * zoomLevel}
                cy={node.y * zoomLevel}
                r={getNodeSize(node.frequency) * zoomLevel}
                fill={getNodeColor(node)}
                stroke={selectedNode?.id === node.id ? '#F59E0B' : 'white'}
                strokeWidth={selectedNode?.id === node.id ? 3 : 2}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleNodeClick(node)}
              />
              <text
                x={node.x * zoomLevel}
                y={node.y * zoomLevel + 5}
                textAnchor="middle"
                className="fill-white text-xs font-medium pointer-events-none"
                style={{ fontSize: `${12 * zoomLevel}px` }}
              >
                {node.name.length > 10 ? node.name.substring(0, 10) + '...' : node.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
          <h4 className="text-sm font-medium text-slate-900 mb-2">Legend</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary-600"></div>
              <span>Concepts from Documents</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-secondary-600"></div>
              <span>Learned from Q&A</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-accent-600"></div>
              <span>Document Sources</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-slate-900">{selectedNode.name}</h4>
              <p className="text-sm text-slate-600 mt-1">Source: {selectedNode.source}</p>
              <p className="text-sm text-slate-600">Frequency: {selectedNode.frequency} mentions</p>
              <p className="text-sm text-slate-600">Type: {selectedNode.type}</p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
          
          {selectedNode.connections && selectedNode.connections.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-slate-700 mb-2">Connected to:</p>
              <div className="flex flex-wrap gap-2">
                {selectedNode.connections.map(connectionId => {
                  const connectedNode = nodes.find(n => n.id === connectionId)
                  return connectedNode ? (
                    <button
                      key={connectionId}
                      onClick={() => handleNodeClick(connectedNode)}
                      className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs hover:bg-primary-200 transition-colors"
                    >
                      {connectedNode.name}
                    </button>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default KnowledgeGraph
