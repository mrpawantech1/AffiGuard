import React from 'react'
import { X, AlertTriangle } from 'lucide-react'

const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-card border border-border-strong rounded-2xl w-full max-w-md p-6 animate-scale-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Remove Link</h3>
          <button onClick={onCancel} className="p-2 hover:bg-bg-card2 rounded-lg transition-colors">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <div className="flex items-center gap-4 p-4 bg-red-bg/10 border border-red/25 rounded-xl mb-6">
          <div className="w-10 h-10 bg-red-bg rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red" />
          </div>
          <div>
            <div className="font-semibold text-text-main">Are you sure?</div>
            <div className="text-text-muted text-sm">This link will be removed from monitoring.</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 btn-ghost py-3">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red text-white font-bold py-3 rounded-lg hover:bg-red/80 transition-all active:scale-95">
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
