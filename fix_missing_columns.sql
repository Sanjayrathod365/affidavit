-- Add missing columns
ALTER TABLE Patient ADD COLUMN "endDate" DATETIME;

-- Create _prisma_migrations table if not exists 
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);

-- Insert migration records
INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
VALUES 
('89733dd2-dab4-46cb-9e1d-7f73750b7836', 'cac9a96f4a5a039f24b8bf3998f6dce871db83ec955d24a09f12bf73a5e46ee4', strftime('%s%f', 'now') * 1000, '20250410220319_y', strftime('%s%f', 'now') * 1000, 1),
('b5b74276-3d0c-4bf1-811a-8c03346f3288', '658486597307a4ea527d0f98a7973f83385b0da022a5e00a56803565c265a6d5', strftime('%s%f', 'now') * 1000, '20250410204107_add_verification_code', strftime('%s%f', 'now') * 1000, 1),
('723915f8-b091-48c9-b837-938f0201f64f', '48c328bb0e47823abc2a53cab56e72850ab2454e26388f4ae59f71335f153dac', strftime('%s%f', 'now') * 1000, '20250409091601_add_provider_fields', strftime('%s%f', 'now') * 1000, 1),
('e8cc4f39-535a-42a8-8221-7220844f7263', '529ab252564348bd5128c4fa53e5a07bd59007ca9f98844952e80dc7d2eb07be', strftime('%s%f', 'now') * 1000, '20250410154145_add_end_date_to_patient', strftime('%s%f', 'now') * 1000, 1),
('6b727096-1348-4dcb-b6e5-eae65f3e4f0e', '203fecb713c705ba308258f5991c47dc2d0032a63f1d280ebe4a1d19ecf60256', strftime('%s%f', 'now') * 1000, '20250409075537_init', strftime('%s%f', 'now') * 1000, 1); 