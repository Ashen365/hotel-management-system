import api from './api'

export const fetchTasks = (params = {}) => api.get('/api/housekeeping', { params })
export const createTask = (data) => api.post('/api/housekeeping', data)
export const updateTask = (id, data) => api.patch(`/api/housekeeping/${id}`, data)
export const deleteTask = (id) => api.delete(`/api/housekeeping/${id}`)
export const fetchToClean = () => api.get('/api/rooms/to-clean')
export const fetchUsers = (params = {}) => api.get('/api/users', { params })