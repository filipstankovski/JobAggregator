-- Create job table
CREATE TABLE IF NOT EXISTS job (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    description VARCHAR(3000),
    source VARCHAR(255),
    url VARCHAR(255) UNIQUE,
    active_until DATE,
    category VARCHAR(255)
);
