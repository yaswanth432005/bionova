"use client" // Declare as Client Component for DnD and fetching logic

// Import React hooks for state and lifecycle
import { useState, useEffect } from "react"
// Import drag and drop components from hello-pangea/dnd (standard dnd alternative for React 18)
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
// Import Lucide icons for UI elements and job details
import { Plus, GripVertical, Building2, MapPin, DollarSign, ExternalLink } from "lucide-react"
// Import date utility for relative timestamps (e.g., "shared 2 days ago")
import { formatDistanceToNow } from "date-fns"
// Import the modal for adding new job applications
import { AddJobModal } from "./components/AddJobModal"
// Import toast notification system
import { useToast } from "@/components/ToastProvider"

// Define the shape of a job application object
type JobApp = {
  id: string
  company: string
  role: string
  status: string
  salary: string | null
  location: string | null
  link: string | null
  notes: string | null
  deadline: string | null
  reminderDate: string | null
  appliedDate: string
}

// Define the constant stages for the Kanban columns
const STAGES = ["Applied", "Interviewing", "Offer", "Rejected"]

export default function BoardPage() {
  // State for storing the list of job applications
  const [applications, setApplications] = useState<JobApp[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showToast } = useToast()

  // Load applications from the API on mount
  useEffect(() => {
    fetchApps()
  }, [])

  // Helper function to refresh the application data
  const fetchApps = async () => {
    try {
      const res = await fetch("/api/applications")
      if (res.ok) setApplications(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Core logic for handling the end of a drag-and-drop event
  const handleDragEnd = async (result: DropResult) => {
    // If dropped outside a valid droppable area, exit
    if (!result.destination) return

    const { source, destination, draggableId } = result
    
    // If dropped in the exact same spot, exit
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    // Perform an optimistic UI update for instant feedback
    const newStatus = destination.droppableId
    const appIndex = applications.findIndex(a => a.id === draggableId)
    const newApps = [...applications]
    
    if(appIndex > -1){
      const app = newApps[appIndex]
      app.status = newStatus // Update status to the new column's ID
      setApplications(newApps) // Update state for reactive re-render
      
      // Notify user of the change
      showToast(`Updated ${app.company} to ${newStatus}`, 'success')

      // Persist the status change to the backend database
      await fetch(`/api/applications/${draggableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
    }
  }

  // Filter applications based on their current stage for column rendering
  const getAppsByStatus = (status: string) => applications.filter(a => a.status === status)

  // Loading state placeholder with spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    // Main board container with entry animation
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      {/* Header section with page title and Add Job action */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Application Board</h1>
          <p className="text-gray-400">Drag and drop to update statuses.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-6 px-6 py-2 glass rounded-xl border border-white/5 mr-4">
            <div className="text-center">
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Active</div>
              <div className="text-lg font-bold">{applications.filter(a => a.status === 'Applied').length}</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-[10px] text-purple-400 uppercase font-bold tracking-widest">Interviews</div>
              <div className="text-lg font-bold text-purple-300">{applications.filter(a => a.status === 'Interviewing').length}</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-[10px] text-green-400 uppercase font-bold tracking-widest">Offers</div>
              <div className="text-lg font-bold text-green-300">{applications.filter(a => a.status === 'Offer').length}</div>
            </div>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Job
          </button>
        </div>
      </div>

      {/* Modal component for creating new applications */}
      <AddJobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={fetchApps} 
      />

      {/* Horizontal scrolling board container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        {/* Context for Drag and Drop logic */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full min-w-max pb-4">
            {/* Map through each stage to create a column */}
            {STAGES.map(stage => (
              <Droppable key={stage} droppableId={stage}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    // Highlight column when dragging over it
                    className={`w-80 flex flex-col glass rounded-xl border ${
                      snapshot.isDraggingOver ? "border-purple-500/50 bg-white/10" : "border-white/5"
                    } transition-colors`}
                  >
                    {/* Column header with stage name and count */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <h3 className="font-semibold">{stage}</h3>
                      <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                        {getAppsByStatus(stage).length}
                      </span>
                    </div>

                    {/* Draggable items container */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                      {getAppsByStatus(stage).map((app, index) => (
                        <Draggable key={app.id} draggableId={app.id} index={index}>
                          {(provided, snapshot) => (
                            // Individual board card
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              // Styling for active dragging state
                              className={`bg-[#121212] rounded-lg p-4 border ${
                                snapshot.isDragging ? "border-purple-500 shadow-2xl scale-105" : "border-white/10 hover:border-white/20"
                              } transition-all cursor-default group`}
                            >
                              {/* Job Header Info */}
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-purple-300 transition-colors">{app.role}</h4>
                                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                                    <Building2 className="w-3 h-3" />
                                    <span>{app.company}</span>
                                  </div>
                                </div>
                                {/* Drag handle to move the card */}
                                <div {...provided.dragHandleProps} className="text-gray-600 hover:text-white cursor-grab active:cursor-grabbing">
                                  <GripVertical className="w-4 h-4" />
                                </div>
                              </div>

                              {/* Optional Location and Salary Badges */}
                              {(app.location || app.salary || app.deadline) && (
                                <div className="space-y-3 mt-4 mb-3">
                                  <div className="flex items-center gap-3 text-xs text-gray-400">
                                    {app.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-gray-500" />
                                        <span className="truncate max-w-[80px]">{app.location}</span>
                                      </div>
                                    )}
                                    {app.salary && (
                                      <div className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3 text-green-500/70" />
                                        <span className="truncate max-w-[80px] font-medium text-green-100">{app.salary}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {app.deadline && (() => {
                                    const d = new Date(app.deadline);
                                    const now = new Date();
                                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                                    const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                    const isOverdue = d < today;

                                    return (
                                      <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider w-fit shadow-sm transition-all ${
                                        diffDays === 1 || diffDays === 0
                                          ? "bg-red-600 text-white border border-red-400 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
                                          : isOverdue 
                                            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                            : diffDays <= 2
                                              ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                      }`}>
                                        {diffDays === 1 || diffDays === 0
                                          ? "🔥 URGENT: 1 DAY LEFT" 
                                          : `Deadline: ${d.toLocaleDateString()}`}
                                        {isOverdue && " (Overdue)"}
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}

                              {/* Bottom meta info: application date and link */}
                              <div className="flex items-center justify-between mt-4 text-[10px] text-gray-500 border-t border-white/5 pt-3">
                                <span>{formatDistanceToNow(new Date(app.appliedDate), { addSuffix: true })}</span>
                                {app.link && (
                                  <a href={app.link} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {/* Placeholder used by hello-pangea to reserve space during drag */}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
