import { getSupabaseClient } from "./supabase/client"

export interface SessionData {
  id: string
  type: "user" | "organization" | "contributor"
  name: string
  organization?: string
  email: string
  verified: boolean
  verificationImage?: string
  latitude?: number
  longitude?: number
}

export interface Device {
  id: string
  name: string
  type: string
  condition: "excellent" | "good" | "fair"
  description: string
  image_url?: string
  contributor_id: string
  contributor_name: string
  latitude?: number
  longitude?: number
  available: boolean
  created_at: string
  requests?: DeviceRequest[]
}

export interface DeviceRequest {
  id: string
  device_id: string
  user_id: string
  user_name: string
  user_type: "user" | "organization"
  user_organization?: string
  request_description: string
  urgency: "low" | "medium" | "high"
  reason: string
  user_verified: boolean
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export interface Report {
  id: string
  device_id: string
  reporter_id: string
  reason: string
  description?: string
  report_type: "inappropriate" | "damaged" | "fraud" | "other"
  status: "open" | "reviewing" | "resolved"
  created_at: string
}

export const storage = {
  // Session management (localStorage)
  setSession: (session: SessionData) => {
    localStorage.setItem("techbridge_session", JSON.stringify(session))
  },

  getSession: (): SessionData | null => {
    if (typeof window === "undefined") return null
    const item = localStorage.getItem("techbridge_session")
    return item ? JSON.parse(item) : null
  },

  clearSession: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("techbridge_session")
    }
  },

  updateSession: (updates: Partial<SessionData>) => {
    const session = storage.getSession()
    if (session) {
      storage.setSession({ ...session, ...updates })
    }
  },

  // User management
  createUser: async (userData: Partial<SessionData>) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: userData.name,
          email: userData.email,
          user_type: userData.type,
          organization_name: userData.organization,
          verified: false,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  updateUser: async (userId: string, updates: Partial<any>) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

    if (error) throw error
    return data
  },

  getUserById: async (userId: string) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) throw error
    return data
  },

  // Device management
  addDevice: async (device: Partial<Device>) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("devices").insert([device]).select().single()

    if (error) throw error
    return data
  },

  getDevices: async (filters?: {
    latitude?: number
    longitude?: number
    radius?: number
  }) => {
    const supabase = getSupabaseClient()
    const query = supabase.from("devices").select("*").eq("available", true)

    const { data, error } = await query

    if (error) throw error

    // Client-side filtering by location if provided
    if (filters?.latitude && filters?.longitude && filters?.radius) {
      return data.filter((device) => {
        if (!device.latitude || !device.longitude) return true
        const distance = calculateDistance(filters.latitude!, filters.longitude!, device.latitude, device.longitude)
        return distance <= (filters.radius || 50)
      })
    }

    return data
  },

  getDeviceById: async (id: string) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("devices").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  updateDevice: async (id: string, updates: Partial<Device>) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("devices").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  getDevicesByContributor: async (contributorId: string) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("devices").select("*").eq("contributor_id", contributorId)

    if (error) throw error
    return data
  },

  // Request management
  addRequest: async (request: Partial<DeviceRequest>) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("device_requests")
      .insert([
        {
          device_id: request.device_id,
          user_id: request.user_id,
          request_description: request.request_description,
          urgency: request.urgency || "medium",
          reason: request.reason,
          user_name: request.user_name,
          user_type: request.user_type,
          user_organization: request.user_organization,
          user_verified: request.user_verified || false,
          status: "pending",
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  getRequestsByDevice: async (deviceId: string) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("device_requests").select("*").eq("device_id", deviceId)

    if (error) throw error
    return data
  },

  getRequestsByUser: async (userId: string) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("device_requests").select("*").eq("user_id", userId)

    if (error) throw error
    return data
  },

  updateRequest: async (id: string, status: "approved" | "rejected") => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("device_requests").update({ status }).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  // Report management
  createReport: async (report: Partial<Report>) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("reports").insert([report]).select().single()

    if (error) throw error
    return data
  },

  getReportsByDevice: async (deviceId: string) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("reports").select("*").eq("device_id", deviceId)

    if (error) throw error
    return data
  },

  getReports: async () => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("reports").select("*")

    if (error) throw error
    return data
  },

  updateReport: async (id: string, status: string) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("reports").update({ status }).eq("id", id).select().single()

    if (error) throw error
    return data
  },
}

// Utility function to calculate distance between two coordinates (in km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
