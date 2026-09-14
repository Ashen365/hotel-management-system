import api from './api'

// Thin wrappers so pages do not build URLs/axios calls themselves.
export const fetchRooms = (params = {}) => api.get('/api/rooms', { params })
export const fetchRoom = (id) => api.get(`/api/rooms/${id}`)
export const createRoom = (data) => api.post('/api/rooms', data)
export const updateRoom = (id, data) => api.put(`/api/rooms/${id}`, data)
export const deleteRoom = (id) => api.delete(`/api/rooms/${id}`)