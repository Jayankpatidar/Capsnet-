import React, { useState, useEffect } from 'react'
import { Clock, Send, Trash2, Eye, EyeOff } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { createNote, fetchUserNotes, fetchReceivedNotes, markNoteAsRead, deleteNote } from '../features/notes/noteSlice'
import toast from 'react-hot-toast'

const Notes = ({ isOpen, onClose, recipientId = null }) => {
  const dispatch = useDispatch()
  const { notes, receivedNotes, loading } = useSelector(state => state.notes)
  const currentUser = useSelector(state => state.user.value)

  const [activeTab, setActiveTab] = useState('compose') // compose, sent, received
  const [noteContent, setNoteContent] = useState('')
  const [expirationHours, setExpirationHours] = useState(24)
  const [selectedRecipient, setSelectedRecipient] = useState(recipientId || '')

  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'sent') {
        dispatch(fetchUserNotes())
      } else if (activeTab === 'received') {
        dispatch(fetchReceivedNotes())
      }
    }
  }, [isOpen, activeTab, dispatch])

  const handleSendNote = async () => {
    if (!noteContent.trim() || !selectedRecipient) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await dispatch(createNote({
        to_user_id: selectedRecipient,
        content: noteContent,
        expiration_hours: expirationHours
      })).unwrap()

      toast.success('Note sent successfully!')
      setNoteContent('')
      setSelectedRecipient('')
      setActiveTab('sent')
    } catch (error) {
      toast.error(error.message || 'Failed to send note')
    }
  }

  const handleMarkAsRead = async (noteId) => {
    try {
      await dispatch(markNoteAsRead({ note_id: noteId })).unwrap()
      dispatch(fetchReceivedNotes())
    } catch (error) {
      toast.error('Failed to mark note as read')
    }
  }

  const handleDeleteNote = async (noteId) => {
    try {
      await dispatch(deleteNote({ note_id: noteId })).unwrap()
      if (activeTab === 'sent') {
        dispatch(fetchUserNotes())
      } else {
        dispatch(fetchReceivedNotes())
      }
      toast.success('Note deleted')
    } catch (error) {
      toast.error('Failed to delete note')
    }
  }

  const formatTimeLeft = (expiresAt) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffMs = expiry - now

    if (diffMs <= 0) return 'Expired'

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m left`
    } else {
      return `${diffMinutes}m left`
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'compose', label: 'Compose' },
            { id: 'sent', label: 'Sent' },
            { id: 'received', label: 'Received' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {activeTab === 'compose' && (
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Recipient
                </label>
                <input
                  type="text"
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  placeholder="Enter recipient ID or username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write your note here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Expires in
                </label>
                <select
                  value={expirationHours}
                  onChange={(e) => setExpirationHours(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={72}>3 days</option>
                  <option value={168}>1 week</option>
                </select>
              </div>

              <button
                onClick={handleSendNote}
                disabled={!noteContent.trim() || !selectedRecipient}
                className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                Send Note
              </button>
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="space-y-3">
              {loading ? (
                <div className="py-8 text-center">Loading...</div>
              ) : notes.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No sent notes</div>
              ) : (
                notes.map((note) => (
                  <div key={note._id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={14} />
                        <span>{formatTimeLeft(note.expires_at)}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-gray-900">{note.content}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Sent to: {note.to_user_id}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'received' && (
            <div className="space-y-3">
              {loading ? (
                <div className="py-8 text-center">Loading...</div>
              ) : receivedNotes.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No received notes</div>
              ) : (
                receivedNotes.map((note) => (
                  <div key={note._id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${note.is_read ? 'bg-gray-400' : 'bg-blue-500'}`}></div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} />
                          <span>{formatTimeLeft(note.expires_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!note.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(note._id)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Mark as read"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className={`text-gray-900 ${!note.is_read ? 'font-medium' : ''}`}>
                      {note.content}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      From: {note.from_user_id}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notes
