-- Run only the statements for columns that do not exist yet in your D1 table.
-- Cloudflare D1/SQLite may fail if you add a column that already exists.

ALTER TABLE portfolio_3d_projects ADD COLUMN categories_json TEXT;
ALTER TABLE portfolio_3d_projects ADD COLUMN tags_json TEXT;
ALTER TABLE portfolio_3d_projects ADD COLUMN published_at TEXT;
