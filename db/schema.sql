CREATE TABLE IF NOT EXISTS project_submissions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT,
  category TEXT NOT NULL,
  technologies TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  visibility TEXT NOT NULL DEFAULT 'private',
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  approved_at TEXT,
  rejected_at TEXT,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_project_submissions_moderation_status
  ON project_submissions(moderation_status);

CREATE INDEX IF NOT EXISTS idx_project_submissions_visibility
  ON project_submissions(visibility);

CREATE INDEX IF NOT EXISTS idx_project_submissions_created_at
  ON project_submissions(created_at);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL,
  reviewed_at TEXT,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status
  ON contact_messages(status);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON contact_messages(created_at);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  created_at TEXT NOT NULL,
  metadata TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_target
  ON audit_logs(target_type, target_id);

CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_3d_projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  date TEXT,
  year TEXT,
  category TEXT,
  role TEXT,
  thumbnail_url TEXT,
  hero_image_url TEXT,
  images_json TEXT,
  tools_json TEXT,
  techniques_json TEXT,
  external_links_json TEXT,
  breakdown TEXT,
  technical_notes TEXT,
  engine TEXT,
  asset_type TEXT,
  polycount TEXT,
  texture_resolution TEXT,
  texel_density TEXT,
  target_platform TEXT,
  time_spent TEXT,
  software_used_json TEXT,
  materials_json TEXT,
  shader_notes TEXT,
  optimization_notes TEXT,
  texture_workflow TEXT,
  substance_painter_notes TEXT,
  substance_designer_notes TEXT,
  texture_maps_json TEXT,
  content_blocks_json TEXT,
  published INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_portfolio_3d_projects_published
  ON portfolio_3d_projects(published);

CREATE INDEX IF NOT EXISTS idx_portfolio_3d_projects_featured
  ON portfolio_3d_projects(featured);

CREATE INDEX IF NOT EXISTS idx_portfolio_3d_projects_sort
  ON portfolio_3d_projects(sort_order, created_at);
