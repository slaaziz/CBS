import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { FilterSidebar } from './FilterSidebar';
import { FilterSelectionPage } from './FilterSelectionPage';
import { mockArticles } from '../data/mockData';
import { filterArticles, parseFiltersFromURL } from '../utils/filterUtils';

interface Node {
  id: string;
  x: number;
  y: number;
  type: 'cbs' | 'media';
  title: string;
  source?: string;
}

interface Edge {
  source: string;
  target: string;
  confidence: number;
}

export function NetworkGraphPage() {
  const [searchParams] = useSearchParams();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Check if filter panel should be shown
  const showFilterPanel = searchParams.get('showFilters') === 'true';
  
  // Parse filters from URL
  const filters = parseFiltersFromURL(searchParams);
  
  // Apply filters to articles
  const filteredArticles = useMemo(() => {
    return filterArticles(mockArticles, filters);
  }, [filters]);

  // Generate network data from filtered articles
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    const width = 900;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Filter articles that have CBS matches (vertrouwensscore > 0) or related articles
    const articlesWithRelations = filteredArticles.filter(
      article => article.vertrouwensscore > 0 || (article.relatedArticles && article.relatedArticles.length > 0)
    );
    
    // Take first 5 articles with relations as CBS nodes
    const cbsArticles = articlesWithRelations.slice(0, 5);
    
    // If no articles with relations, show a subset anyway for visualization
    const displayArticles = cbsArticles.length > 0 ? cbsArticles : filteredArticles.slice(0, 5);
    
    displayArticles.forEach((article, index) => {
      const angle = (index / displayArticles.length) * 2 * Math.PI;
      const radius = 120;
      
      // CBS node in the center area - use index to ensure uniqueness
      const cbsNodeId = `cbs-${article.id}-${index}`;
      nodes.push({
        id: cbsNodeId,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        type: 'cbs',
        title: article.title.substring(0, 40) + '...',
        source: article.source,
      });
      
      // Create media outlet nodes based on related articles or generate sample connections
      const hasRelations = article.relatedArticles && article.relatedArticles.length > 0;
      const mediaCount = hasRelations ? Math.min(article.relatedArticles!.length, 3) : 2;
      
      for (let i = 0; i < mediaCount; i++) {
        const mediaAngle = angle + (i - mediaCount / 2) * 0.3;
        const mediaRadius = 250;
        
        const mediaId = `media-${article.id}-${index}-${i}`;
        nodes.push({
          id: mediaId,
          x: centerX + Math.cos(mediaAngle) * mediaRadius,
          y: centerY + Math.sin(mediaAngle) * mediaRadius,
          type: 'media',
          title: `Media: ${article.title.substring(0, 30)}...`,
          source: ['NOS', 'NU.nl', 'Telegraaf', 'AD', 'Volkskrant'][i % 5],
        });
        
        // Create edge with confidence based on vertrouwensscore or random
        const confidence = article.vertrouwensscore > 0 
          ? article.vertrouwensscore 
          : 65 + Math.floor(Math.random() * 25);
        edges.push({
          source: cbsNodeId,
          target: mediaId,
          confidence,
        });
      }
    });
    
    return { nodes, edges };
  }, [filteredArticles]);

  const getEdgeThickness = (confidence: number) => {
    if (confidence >= 80) return 3;
    if (confidence >= 70) return 2;
    return 1;
  };

  const getEdgeColor = (confidence: number) => {
    if (confidence >= 80) return '#10B981'; // Green
    if (confidence >= 70) return '#F59E0B'; // Orange
    return '#EAB308'; // Yellow
  };

  const getEdgeOpacity = (confidence: number) => {
    if (confidence >= 80) return 0.8;
    if (confidence >= 70) return 0.6;
    return 0.4;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 mx-auto px-20 py-12 w-full max-w-screen-2xl">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-[#1C3664] mb-2">Netwerk Visualisatie</h1>
              <p className="text-gray-600">
                Visualiseer de matches tussen CBS artikelen en online media
                {filteredArticles.length < mockArticles.length && (
                  <span className="ml-2 text-[#0097DB]">
                    ({filteredArticles.length} van {mockArticles.length} artikelen)
                  </span>
                )}
              </p>
            </div>
            
            {/* Network Graph */}
            <div className="bg-white rounded-lg shadow-sm p-8 relative">
              {nodes.length > 0 ? (
                <>
                  <svg 
                    width="100%" 
                    height="600" 
                    viewBox="0 0 900 600"
                    className="border border-gray-100 rounded"
                  >
                    {/* Draw edges first (behind nodes) */}
                    <g className="edges">
                      {edges.map((edge, index) => {
                        const sourceNode = nodes.find(n => n.id === edge.source);
                        const targetNode = nodes.find(n => n.id === edge.target);
                        
                        if (!sourceNode || !targetNode) return null;
                        
                        const isHighlighted = hoveredNode === edge.source || hoveredNode === edge.target;
                        
                        return (
                          <line
                            key={`edge-${index}`}
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke={getEdgeColor(edge.confidence)}
                            strokeWidth={getEdgeThickness(edge.confidence)}
                            opacity={isHighlighted ? 1 : getEdgeOpacity(edge.confidence)}
                            className="transition-opacity duration-200"
                          />
                        );
                      })}
                    </g>
                    
                    {/* Draw nodes */}
                    <g className="nodes">
                      {nodes.map((node) => {
                        const isHovered = hoveredNode === node.id;
                        const isSelected = selectedNode === node.id;
                        const isConnected = hoveredNode && edges.some(
                          e => (e.source === hoveredNode && e.target === node.id) ||
                               (e.target === hoveredNode && e.source === node.id)
                        );
                        
                        const nodeColor = node.type === 'cbs' ? '#0097DB' : '#F97316';
                        const nodeRadius = isHovered || isSelected ? 14 : 10;
                        const opacity = hoveredNode && !isHovered && !isConnected ? 0.3 : 1;
                        
                        return (
                          <g key={node.id}>
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={nodeRadius}
                              fill={nodeColor}
                              opacity={opacity}
                              className="transition-all duration-200 cursor-pointer"
                              onMouseEnter={() => setHoveredNode(node.id)}
                              onMouseLeave={() => setHoveredNode(null)}
                              onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                              style={{
                                filter: isHovered || isSelected ? 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none'
                              }}
                            />
                            {(isHovered || isSelected) && (
                              <g>
                                <rect
                                  x={node.x + 15}
                                  y={node.y - 25}
                                  width={200}
                                  height={45}
                                  fill="white"
                                  stroke="#E5E7EB"
                                  strokeWidth="1"
                                  rx="4"
                                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                                />
                                <text
                                  x={node.x + 20}
                                  y={node.y - 10}
                                  fontSize="11"
                                  fill="#1C3664"
                                  fontWeight="600"
                                >
                                  {node.title.substring(0, 25)}
                                </text>
                                <text
                                  x={node.x + 20}
                                  y={node.y + 5}
                                  fontSize="9"
                                  fill="#6B7280"
                                >
                                  {node.source}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute bottom-12 left-12 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-[#1C3664] mb-3">Legenda</h3>
                    
                    {/* Node Types */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#0097DB]"></div>
                        <span className="text-xs text-gray-700">CBS Artikel</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                        <span className="text-xs text-gray-700">Media Artikel</span>
                      </div>
                    </div>
                    
                    {/* Confidence Scores */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-xs font-semibold text-[#1C3664] mb-2">Confidence Score:</div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-[#10B981]" style={{ height: '3px' }}></div>
                          <span className="text-xs text-gray-700">Hoog (80%+)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-[#F59E0B]" style={{ height: '2px' }}></div>
                          <span className="text-xs text-gray-700">Gemiddeld (70-79%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-[#EAB308]" style={{ height: '1px' }}></div>
                          <span className="text-xs text-gray-700">Laag (&lt;70%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[600px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">Geen data beschikbaar</p>
                    <p className="text-sm">Pas uw filters aan om netwerkdata te zien</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Info Panel */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-[#1C3664]">
                <strong>Interactie:</strong> Beweeg over nodes voor details, klik om te selecteren. 
                Lijnen tonen de confidence score tussen CBS artikelen en gerelateerde media artikelen.
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <FilterSidebar />
        </div>
      </main>

      <Footer />
      
      {/* Filter Panel Overlay */}
      {showFilterPanel && <FilterSelectionPage />}
    </div>
  );
}