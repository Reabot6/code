-- Add urgency, reason, user_name, user_type, user_organization, and user_verified columns
ALTER TABLE device_requests 
ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE device_requests
ADD COLUMN IF NOT EXISTS reason TEXT;

ALTER TABLE device_requests
ADD COLUMN IF NOT EXISTS user_name TEXT;

ALTER TABLE device_requests
ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('user', 'organization'));

ALTER TABLE device_requests
ADD COLUMN IF NOT EXISTS user_organization TEXT;

ALTER TABLE device_requests
ADD COLUMN IF NOT EXISTS user_verified BOOLEAN DEFAULT false;
