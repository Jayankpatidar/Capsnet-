import React, { useEffect } from 'react'
import { getProfileImageURL } from '../utils/imageUtils';
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminAnalytics } from '../features/admin/adminSlice'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { analytics, loading, error } = useSelector(state => state.admin)
  const currentUser = useSelector(state => state.user.value)

  useEffect(() => {
    console.log('AdminDashboard: Current user:', currentUser)
    if (currentUser && currentUser.role === 'admin') {
      dispatch(fetchAdminAnalytics())
      fetchUsers()
    }
  }, [dispatch, currentUser])

  const fetchUsers = async () => {
    setUserLoading(true)
    try {
      const response = await axios.get('/admin/users')
      setUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setUserLoading(false)
    }
  }

  const promoteToFaculty = async (userId) => {
    try {
      await axios.post('/admin/promote-faculty', { userId })
      fetchUsers()
      toast.success('User promoted to faculty')
    } catch (error) {
      toast.error('Error promoting user')
    }
  }

  const promoteToAdmin = async (userId) => {
    try {
      await axios.post('/admin/promote-admin', { userId })
      fetchUsers()
      toast.success('User promoted to admin')
    } catch (error) {
      toast.error('Error promoting user')
    }
  }

  const demoteUser = async (userId) => {
    try {
      await axios.post('/admin/demote', { userId })
      fetchUsers()
      toast.success('User demoted')
    } catch (error) {
      toast.error('Error demoting user')
    }
  }

  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-6xl p-6 mx-auto">
        <div className="py-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this dashboard.</p>
          <p className="mt-2 text-sm text-gray-500">
            Current user role: {currentUser?.role || 'Not logged in'}
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl p-6 mx-auto">
        <div className="py-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl p-6 mx-auto">
        <div className="py-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Error Loading Analytics</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="max-w-6xl p-6 mx-auto">
        <div className="py-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">No analytics data available. Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  const departmentData = {
    labels: analytics.departmentStats?.map(stat => stat._id) || [],
    datasets: [
      {
        label: 'Users by Department',
        data: analytics.departmentStats?.map(stat => stat.count) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Distribution by Department',
      },
    },
  }

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Analytics and insights for Capsnet Social Media</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalUsers || 0}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Total Posts</h3>
          <p className="text-3xl font-bold text-green-600">{analytics.totalPosts || 0}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Total Chats</h3>
          <p className="text-3xl font-bold text-purple-600">{analytics.totalChats || 0}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Total Collaborations</h3>
          <p className="text-3xl font-bold text-orange-600">{analytics.totalCollaborations || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Department Distribution</h2>
        <Bar data={departmentData} options={options} />
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-semibold">Role Distribution</h3>
          <div className="space-y-2">
            {analytics.roleStats?.map((role, index) => (
              <div key={index} className="flex justify-between">
                <span className="capitalize">{role._id || 'Student'}</span>
                <span className="font-semibold">{role.count}</span>
              </div>
            )) || <p>No role data available</p>}
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-semibold">Recent Users</h3>
          <div className="space-y-2">
            {analytics.recentUsers?.map((user, index) => (
              <div key={index} className="flex items-center space-x-3">
                <img src={getProfileImageURL(user.profile_picture)} alt={user.full_name} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-sm font-medium">{user.full_name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )) || <p>No recent users</p>}
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="p-6 mt-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold">User Management</h2>
        {userLoading ? (
          <div className="text-center">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Verified</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-4 py-2">{user.full_name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">{user.isVerified ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2 space-x-2">
                      {user.role === 'student' && (
                        <button
                          onClick={() => promoteToFaculty(user._id)}
                          className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                          Promote to Faculty
                        </button>
                      )}
                      {user.role === 'faculty' && (
                        <button
                          onClick={() => promoteToAdmin(user._id)}
                          className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          Promote to Admin
                        </button>
                      )}
                      {(user.role === 'faculty' || user.role === 'admin') && (
                        <button
                          onClick={() => demoteUser(user._id)}
                          className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                        >
                          Demote
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
