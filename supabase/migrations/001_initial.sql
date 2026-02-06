-- Agents table
CREATE TABLE agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  description text,
  avatar_url text,
  status text DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy')),
  capabilities jsonb DEFAULT '[]',
  api_key text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid REFERENCES agents(id),
  created_by uuid REFERENCES agents(id),
  due_date timestamptz,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Task comments
CREATE TABLE task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Chat messages
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id),
  content text NOT NULL,
  mentions jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Activity log
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_activities_created ON activities(created_at DESC);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Public read access for now (will tighten later)
CREATE POLICY "Public read access" ON agents FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tasks FOR SELECT USING (true);
CREATE POLICY "Public read access" ON task_comments FOR SELECT USING (true);
CREATE POLICY "Public read access" ON messages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON activities FOR SELECT USING (true);

-- Agents can insert/update via API key
CREATE POLICY "Agent write" ON tasks FOR ALL USING (true);
CREATE POLICY "Agent write" ON task_comments FOR ALL USING (true);
CREATE POLICY "Agent write" ON messages FOR ALL USING (true);
CREATE POLICY "Agent write" ON activities FOR ALL USING (true);
