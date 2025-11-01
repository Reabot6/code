-- Add urgency and reason columns to device_requests
ALTER TABLE device_requests 
ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE device_requests
ADD COLUMN IF NOT EXISTS reason TEXT;

-- Create notifications table for contributors
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contributor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES device_requests(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_contributor" ON notifications
  FOR SELECT USING (auth.uid()::text = contributor_id::text OR contributor_id::text = auth.uid()::text);

CREATE POLICY "notifications_insert_own" ON notifications
  FOR INSERT WITH CHECK (contributor_id::text = auth.uid()::text);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (contributor_id::text = auth.uid()::text);

-- Create user_pairings table for location-based matching
CREATE TABLE IF NOT EXISTS user_pairings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id_1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  distance_km NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_pairings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pairings_select" ON user_pairings
  FOR SELECT USING (user_id_1::text = auth.uid()::text OR user_id_2::text = auth.uid()::text);
