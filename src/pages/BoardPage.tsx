import { useCallback, useMemo, useRef, useState, type DragEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeChangeset,
  type NodeChangeset,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  ArrowRight,
  Check,
  ExternalLink,
  Layers,
  Maximize2,
  Menu,
  Network,
  RotateCcw,
  Trash2,
  X,
  ZoomIn,
  LayoutGrid,
  ZoomOut,
} from 'lucide-react'
import { DossierNode } from '@/components/board/DossierNode'
import { BoardTray, BOARD_DRAG_TYPE } from '@/components/board/BoardTray'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useCaseStore, type DossierNode as DossierNodeType } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { EVIDENCE_BY_ID } from '@/data/evidence'
import { SUSPECTS_BY_ID } from '@/data/suspects'
import { RELATIONSHIP_META, type RelationshipKey } from '@/utils/format'
import { cn } from '@/utils/cn'

const NODE_TYPES = { dossier: DossierNode } as unknown as NodeTypes

function markerFor(relationship: RelationshipKey) {
  const meta = RELATIONSHIP_META[relationship]
  return { type: MarkerType.ArrowClosed, color: meta.color, width: 14, height: 14 }
}

function edgeStyleFor(relationship: RelationshipKey) {
  const meta = RELATIONSHIP_META[relationship]
  return {
    stroke: meta.color,
    strokeWidth: 1.4,
    strokeDasharray: meta.dashed ? '5 4' : undefined,
  }
}

function decorateEdge(edge: Edge, relationship: RelationshipKey): Edge {
  const meta = RELATIONSHIP_META[relationship]
  return {
    ...edge,
    label: meta.label,
    data: { ...edge.data, relationship },
    style: edgeStyleFor(relationship),
    markerEnd: markerFor(relationship),
  }
}

function BoardWorkspace() {
  const nodes = useCaseStore((state) => state.boardNodes)
  const edges = useCaseStore((state) => state.boardEdges)
  const setBoardNodes = useCaseStore((state) => state.setBoardNodes)
  const setBoardEdges = useCaseStore((state) => state.setBoardEdges)
  const addEvidenceToBoard = useCaseStore((state) => state.addEvidenceToBoard)
  const addSuspectToBoard = useCaseStore((state) => state.addSuspectToBoard)
  const removeBoardNode = useCaseStore((state) => state.removeBoardNode)
  const seedBoard = useCaseStore((state) => state.seedBoard)
  const resetBoard = useCaseStore((state) => state.resetBoard)
  const pushToast = useUiStore((state) => state.pushToast)

  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [trayOpen, setTrayOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  const onNodesChange = useCallback(
    (changes: NodeChangeset<DossierNodeType>) => {
      setBoardNodes(changes.applyTo(nodes) as DossierNodeType[])
    },
    [nodes, setBoardNodes],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChangeset<Edge>) => {
      setBoardEdges(changes.applyTo(edges) as Edge[])
    },
    [edges, setBoardEdges],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return
      const duplicate = edges.some(
        (edge) => edge.source === connection.source && edge.target === connection.target,
      )
      if (duplicate) {
        pushToast('Connection already exists', 'Select the existing line to change its relationship.', 'warning')
        return
      }
      const id = `edge-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      const edge: Edge = decorateEdge(
        {
          ...connection,
          id,
          type: 'smoothstep',
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 0,
          labelBgStyle: { fill: '#0b0c0f', fillOpacity: 0.9 },
          labelStyle: {
            fill: '#C9C6BD',
            fontSize: 9,
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.1em',
          },
        },
        'connected',
      )
      setBoardEdges(addEdge(edge, edges))
      setSelectedEdgeId(id)
      setSelectedNodeId(null)
      pushToast('Connection established', 'Select the line to label the relationship.', 'success')
    },
    [edges, setBoardEdges, pushToast],
  )

  const autoArrange = useCallback(() => {
    const wrapper = wrapperRef.current
    const centerX = wrapper ? wrapper.clientWidth / 2 : 720
    const centerY = wrapper ? Math.max(wrapper.clientHeight / 2, 160) + 60 : 300
    const arranged = nodes.map((node, index) => ({
      ...node,
      position: {
        x: centerX - 336 + (index % 6) * 160,
        y: centerY - 110 + Math.floor(index / 6) * 90,
      },
    }))
    setBoardNodes(arranged)
    pushToast('Board arranged', 'Suspects form the top row; evidence fans out beneath them.')
    window.setTimeout(() => fitView({ padding: 0.24, duration: 420 }), 80)
  }, [nodes, setBoardNodes, pushToast, fitView])

  const addNodeAtCenter = useCallback(
    (kind: 'evidence' | 'suspect', id: string) => {
      const nodeId = `${kind}-${id}`
      if (nodes.some((node) => node.id === nodeId)) {
        pushToast('Already on the board', 'This record is already pinned to the canvas.', 'warning')
        return
      }
      const rect = wrapperRef.current?.getBoundingClientRect()
      const center = rect
        ? screenToFlowPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          })
        : { x: 300, y: 200 }
      const offset = (nodes.length % 6) * 18
      const position = { x: center.x - 118 + offset, y: center.y - 56 + offset }
      if (kind === 'evidence') addEvidenceToBoard(id, position)
      else addSuspectToBoard(id, position)
      setSelectedNodeId(nodeId)
      setSelectedEdgeId(null)
      setTrayOpen(false)
      window.setTimeout(() => fitView({ padding: 0.25, duration: 350 }), 80)
    },
    [nodes, screenToFlowPosition, addEvidenceToBoard, addSuspectToBoard, pushToast, fitView],
  )

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const raw = event.dataTransfer.getData(BOARD_DRAG_TYPE)
      if (!raw) return
      try {
        const payload = JSON.parse(raw) as { kind: 'evidence' | 'suspect'; id: string }
        const nodeId = `${payload.kind}-${payload.id}`
        if (nodes.some((node) => node.id === nodeId)) {
          pushToast('Already on the board', 'This record is already pinned to the canvas.', 'warning')
          return
        }
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
        const target = { x: position.x - 118, y: position.y - 56 }
        if (payload.kind === 'evidence') addEvidenceToBoard(payload.id, target)
        else addSuspectToBoard(payload.id, target)
        setSelectedNodeId(nodeId)
        setSelectedEdgeId(null)
        pushToast('Record pinned', 'Drag from the right handle to connect it.', 'success')
      } catch {
        // ignore malformed drag payloads
      }
    },
    [nodes, screenToFlowPosition, addEvidenceToBoard, addSuspectToBoard, pushToast],
  )

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId) ?? null
  const selectedEdgeRelationship =
    (selectedEdge?.data?.relationship as RelationshipKey | undefined) ?? 'connected'

  const nodeConnections = useMemo(() => {
    if (!selectedNode) return []
    return edges
      .filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
      .map((edge) => {
        const otherId = edge.source === selectedNode.id ? edge.target : edge.source
        const other = nodes.find((node) => node.id === otherId)
        return {
          id: edge.id,
          label: RELATIONSHIP_META[(edge.data?.relationship as RelationshipKey) ?? 'connected'].label,
          title: other?.data.title ?? 'Unknown record',
          direction: edge.source === selectedNode.id ? 'outgoing' : 'incoming',
        }
      })
  }, [edges, nodes, selectedNode])

  const updateEdgeRelationship = (relationship: RelationshipKey) => {
    if (!selectedEdge) return
    setBoardEdges(
      edges.map((edge) => (edge.id === selectedEdge.id ? decorateEdge(edge, relationship) : edge)),
    )
  }

  const removeSelectedNode = () => {
    if (!selectedNode) return
    removeBoardNode(selectedNode.id)
    setSelectedNodeId(null)
    pushToast('Node removed', `${selectedNode.data.title} detached from the board.`)
  }

  const removeSelectedEdge = () => {
    if (!selectedEdge) return
    setBoardEdges(edges.filter((edge) => edge.id !== selectedEdge.id))
    setSelectedEdgeId(null)
    pushToast('Connection removed', 'The relationship was deleted from the canvas.')
  }

  const nodeLink = selectedNode
    ? selectedNode.data.kind === 'evidence'
      ? `/app/evidence/${selectedNode.data.refId}`
      : `/app/suspects/${selectedNode.data.refId}`
    : '#'

  const evidenceSummary =
    selectedNode?.data.kind === 'evidence'
      ? EVIDENCE_BY_ID[selectedNode.data.refId]?.summary
      : selectedNode?.data.kind === 'suspect'
        ? SUSPECTS_BY_ID[selectedNode.data.refId]?.relationship
        : undefined

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTrayOpen((open) => !open)}
            className="grid h-8 w-8 place-items-center border border-white/10 text-ash hover:text-bone lg:hidden"
            aria-label="Toggle case tray"
          >
            <Menu size={15} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Network size={12} className="text-brass" />
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-brass">
                Investigation board
              </span>
            </div>
            <h1 className="mt-0.5 font-serif text-xl leading-none sm:text-2xl">Theory canvas</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden items-center gap-3 border border-white/[0.08] px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-ash/55 sm:flex">
            <span>{nodes.length} nodes</span>
            <span className="h-2.5 w-px bg-white/10" />
            <span>{edges.length} links</span>
            <span className="h-2.5 w-px bg-white/10" />
            <span className="flex items-center gap-1.5 text-[#9DB8A4]/80">
              <span className="h-[4px] w-[4px] rounded-full bg-[#5F7D68]" />
              Saved
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={<Layers size={12} />}
            onClick={() => {
              seedBoard()
              pushToast('Key exhibits pinned', 'The eight core exhibits were added to the canvas.', 'success')
              window.setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 100)
            }}
          >
            <span className="hidden sm:inline">Seed exhibits</span>
            <span className="sm:hidden">Seed</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<LayoutGrid size={12} />}
            onClick={autoArrange}
          >
            <span className="hidden sm:inline">Auto-arrange</span>
            <span className="sm:hidden">Arrange</span>
          </Button>
          <Button
            variant="quiet"
            size="sm"
            icon={<RotateCcw size={12} />}
            onClick={() => setResetOpen(true)}
          >
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Link to="/app/verdict" className="btn btn-primary btn-sm">
            Verdict
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="relative min-h-0 flex-1"
        onDrop={onDrop}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = 'move'
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={() => {
            fitView({ padding: 0.22, duration: 320 })
          }}
          onNodeClick={(_event, node) => {
            setSelectedNodeId(node.id)
            setSelectedEdgeId(null)
            setTrayOpen(false)
          }}
          onEdgeClick={(_event, edge) => {
            setSelectedEdgeId(edge.id)
            setSelectedNodeId(null)
          }}
          onPaneClick={() => {
            setSelectedNodeId(null)
            setSelectedEdgeId(null)
          }}
          fitView
          fitViewOptions={{ padding: 0.22 }}
          minZoom={0.2}
          maxZoom={1.8}
          deleteKeyCode={null}
          connectionLineStyle={{ stroke: '#C69A55', strokeWidth: 1.4 }}
          connectionRadius={32}
          proOptions={{ hideAttribution: true }}
          className="bg-ink-950"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={26}
            size={1.1}
            color="rgba(255,255,255,0.14)"
          />
          <Controls
            showInteractive={false}
            position="bottom-right"
            className="!m-3 !border-white/10"
          />
        </ReactFlow>

        <div className="pointer-events-none absolute inset-0 scanlines opacity-[0.18]" />

        {/* Desktop tray */}
        <div className="absolute bottom-3 left-3 top-3 z-20 hidden w-[264px] lg:block">
          <BoardTray
            onAddEvidence={(id) => addNodeAtCenter('evidence', id)}
            onAddSuspect={(id) => addNodeAtCenter('suspect', id)}
          />
        </div>

        {/* Mobile tray */}
        {trayOpen && (
          <div className="absolute bottom-3 left-3 top-3 z-30 w-[270px] max-w-[82vw] lg:hidden">
            <BoardTray
              onAddEvidence={(id) => addNodeAtCenter('evidence', id)}
              onAddSuspect={(id) => addNodeAtCenter('suspect', id)}
              onClose={() => setTrayOpen(false)}
            />
          </div>
        )}

        {/* Zoom toolbar */}
        <div className="absolute right-3 top-3 z-20 flex flex-col border border-white/[0.1] bg-ink-900/90 backdrop-blur">
          <button
            onClick={() => zoomIn({ duration: 200 })}
            className="grid h-8 w-8 place-items-center border-b border-white/[0.08] text-ash hover:text-bone"
            aria-label="Zoom in"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => zoomOut({ duration: 200 })}
            className="grid h-8 w-8 place-items-center border-b border-white/[0.08] text-ash hover:text-bone"
            aria-label="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => fitView({ padding: 0.22, duration: 350 })}
            className="grid h-8 w-8 place-items-center text-ash hover:text-bone"
            aria-label="Fit board"
          >
            <Maximize2 size={13} />
          </button>
        </div>

        {edges.length === 0 && (
          <div className="pointer-events-none absolute bottom-16 left-1/2 z-10 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 border border-brass/25 bg-ink-950/90 px-3 py-2 text-center backdrop-blur">
            <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.08em] text-ash">
              Drag from a node’s right handle onto another node to draw a connection
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-4 border border-white/[0.08] bg-ink-950/80 px-3 py-1.5 backdrop-blur md:flex">
          {[
            ['Suspect', '#B83232'],
            ['Document', '#C69A55'],
            ['Digital', '#9AA1AA'],
            ['Physical', '#E7E2D6'],
            ['CCTV', '#7C93A8'],
          ].map(([label, color]) => (
            <span key={label} className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.1em] text-ash/50">
              <span className="h-[5px] w-[5px]" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>

        {/* Node detail panel */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 z-30 max-h-[42vh] overflow-y-auto border border-white/[0.12] bg-ink-900/95 shadow-panel backdrop-blur md:bottom-3 md:left-auto md:right-3 md:top-14 md:max-h-none md:w-[300px]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
              <span className="label text-brass">Selected node</span>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-ash/50 hover:text-bone"
                aria-label="Close node panel"
              >
                <X size={13} />
              </button>
            </div>
            <div className="p-4">
              <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash/50">
                {selectedNode.data.code} · {selectedNode.data.kind}
              </div>
              <h3 className="mt-1.5 font-serif text-xl leading-tight">{selectedNode.data.title}</h3>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.08em] text-ash/55">
                {selectedNode.data.subtitle}
              </p>
              {evidenceSummary && (
                <p className="mt-3 line-clamp-4 text-[11px] leading-relaxed text-ash">{evidenceSummary}</p>
              )}

              <div className="mt-4 border-t border-white/[0.07] pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/45">
                    Relationships
                  </span>
                  <span className="font-mono text-[8px] text-ash/40">{nodeConnections.length}</span>
                </div>
                {nodeConnections.length === 0 ? (
                  <p className="mt-2 text-[10.5px] leading-relaxed text-ash/45">
                    No connections yet. Drag from this node’s right handle.
                  </p>
                ) : (
                  <div className="mt-2 space-y-1.5">
                    {nodeConnections.map((connection) => (
                      <div
                        key={connection.id}
                        className="flex items-center gap-2 border-l border-brass/30 pl-2"
                      >
                        <span className="font-mono text-[7px] uppercase tracking-[0.08em] text-brass/70">
                          {connection.label}
                        </span>
                        <span className="truncate text-[10.5px] text-ash/70">{connection.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to={nodeLink}
                  className="btn btn-ghost btn-sm w-full"
                  onClick={() => setSelectedNodeId(null)}
                >
                  <ExternalLink size={12} />
                  Open full record
                </Link>
                <button
                  onClick={removeSelectedNode}
                  className="btn btn-quiet btn-sm w-full text-[#D97878] hover:bg-blood/[0.08] hover:text-[#E08A8A]"
                >
                  <Trash2 size={12} />
                  Remove from board
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edge editor */}
        {selectedEdge && !selectedNode && (
          <div className="absolute bottom-14 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 border border-white/[0.12] bg-ink-900/95 p-3.5 shadow-panel backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="label text-brass">Relationship</div>
                <div className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.06em] text-ash">
                  {nodes.find((node) => node.id === selectedEdge.source)?.data.title ?? '—'}
                  <span className="mx-2 text-brass">→</span>
                  {nodes.find((node) => node.id === selectedEdge.target)?.data.title ?? '—'}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={removeSelectedEdge}
                  className="p-1 text-ash/50 hover:text-[#D97878]"
                  aria-label="Delete connection"
                >
                  <Trash2 size={13} />
                </button>
                <button
                  onClick={() => setSelectedEdgeId(null)}
                  className="p-1 text-ash/50 hover:text-bone"
                  aria-label="Close edge editor"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(Object.keys(RELATIONSHIP_META) as RelationshipKey[]).map((relationship) => {
                const meta = RELATIONSHIP_META[relationship]
                const active = selectedEdgeRelationship === relationship
                return (
                  <button
                    key={relationship}
                    onClick={() => updateEdgeRelationship(relationship)}
                    className={cn(
                      'flex items-center gap-1.5 border px-2 py-1.5 font-mono text-[7.5px] uppercase tracking-[0.08em] transition-colors',
                      active ? 'text-ink-950' : 'text-ash hover:text-bone',
                    )}
                    style={
                      active
                        ? { backgroundColor: meta.color, borderColor: meta.color }
                        : { borderColor: 'rgba(255,255,255,0.1)' }
                    }
                  >
                    {active && <Check size={9} />}
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset investigation board?"
        eyebrow="Destructive action"
        maxWidth="max-w-md"
      >
        <p className="text-sm leading-relaxed text-ash">
          This clears every node and connection you have placed on the board and restores the four
          suspect nodes. Your evidence notes and review status are not affected.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setResetOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              resetBoard()
              setSelectedNodeId(null)
              setSelectedEdgeId(null)
              setResetOpen(false)
              pushToast('Board reset', 'The canvas was restored to its starting layout.', 'warning')
            }}
          >
            Reset board
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export function BoardPage() {
  return (
    <ReactFlowProvider>
      <BoardWorkspace />
    </ReactFlowProvider>
  )
}
