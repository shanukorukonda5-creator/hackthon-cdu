-- ======================================================
-- ASCESS-1-AI DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Production ready schema with UUIDs, Foreign Keys, Indexes,
-- Constraints, Triggers for updated_at, and RLS policies.
-- ======================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up existing tables if re-applying
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS ai_history CASCADE;
DROP TABLE IF EXISTS translations CASCADE;
DROP TABLE IF EXISTS accessibility_reports CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. DOCUMENTS TABLE
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    extracted_text TEXT,
    ocr_status VARCHAR(50) DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. ACCESSIBILITY REPORTS TABLE
CREATE TABLE accessibility_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    target_url TEXT,
    score INT CHECK (score >= 0 AND score <= 100),
    issues_summary JSONB DEFAULT '{}'::jsonb,
    detailed_findings JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. TRANSLATIONS TABLE
CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    source_language VARCHAR(50) NOT NULL,
    target_language VARCHAR(50) NOT NULL,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. AI HISTORY TABLE
CREATE TABLE ai_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID DEFAULT uuid_generate_v4(),
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    model_used VARCHAR(100) DEFAULT 'gpt-5-mini',
    tokens_used INT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. SETTINGS TABLE
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'system')),
    font_size VARCHAR(20) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large', 'xlarge')),
    high_contrast BOOLEAN DEFAULT FALSE,
    screen_reader_friendly BOOLEAN DEFAULT TRUE,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. ACTIVITY LOGS TABLE
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ======================================================
-- INDEXES FOR PERFORMANCE
-- ======================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_accessibility_user_id ON accessibility_reports(user_id);
CREATE INDEX idx_translations_user_id ON translations(user_id);
CREATE INDEX idx_ai_history_user_id ON ai_history(user_id);
CREATE INDEX idx_ai_history_session_id ON ai_history(session_id);
CREATE INDEX idx_settings_user_id ON settings(user_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);

-- ======================================================
-- AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ======================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_accessibility_reports_updated_at BEFORE UPDATE ON accessibility_reports FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON translations FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_ai_history_updated_at BEFORE UPDATE ON ai_history FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

-- ======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES READY
-- ======================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
