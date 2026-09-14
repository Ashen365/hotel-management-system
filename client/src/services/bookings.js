import api from './api'

export const fetchBookings = (params = {}) => api.get('/api/bookings', { params })
export const fetchBooking = (id) => api.get(`/api/bookings/${id}`)
export const createBooking = (data) => api.post('/api/bookings', data)
export const updateBookingStatus = (id, status) =>
  api.patch(`/api/bookings/${id}/status`, { status })