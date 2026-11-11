-- ====================================================================
-- SILLYCONE: Living Silicon Knowledge Graph & Spec Observatory Schema
-- PostgreSQL / Supabase Compatible Schema
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS FOR STRICT TAXONOMY
CREATE TYPE platform_segment AS ENUM (
    'mobile_soc',
    'handheld_apu',
    'laptop_client',
    'desktop_cpu',
    'discrete_gpu',
    'datacenter_ai'
);

CREATE TYPE verification_status AS ENUM (
    'early_rumor',      -- Supply-chain whispers / Weibo / X leakers (Low confidence)
    'patent_or_driver', -- Linux kernel commit, LLVM, Mesa, EEC filings (Moderate-high confidence)
    'es_sample_hit',    -- Geekbench/3DMark browser benchmark submission (High confidence)
    'announced',        -- Official manufacturer press release / whitepaper
    'retail_verified'   -- Third-party independent lab tested (Ground truth)
);

CREATE TYPE benchmark_category AS ENUM (
    'cpu_ipc_geekbench6',
    'cpu_ipc_geekbench7',
    'cpu_sustained_cinebench_r23',
    'cpu_sustained_cinebench_2024',
    'gpu_raster_timespy',
    'gpu_raster_steel_nomad',
    'gpu_mobile_wildlife_extreme',
    'npu_ai_tops',
    'npu_geekbench_ai'
);

-- 2. FOUNDRY & PROCESS NODES (e.g. TSMC N3E, N3P, N2, Intel 18A, Samsung 3GAP)
CREATE TABLE IF NOT EXISTS foundry_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    foundry_name VARCHAR(64) NOT NULL,              -- e.g. 'TSMC', 'Intel Foundry', 'Samsung Foundry'
    node_name VARCHAR(64) NOT NULL,                 -- e.g. 'N3P', '18A', 'SF2'
    transistor_architecture VARCHAR(64) NOT NULL,   -- e.g. 'FinFET', 'RibbonFET / GAA', 'Nanosheet'
    density_mtr_mm2 NUMERIC(8, 2),                  -- Million Transistors per mm²
    power_efficiency_delta VARCHAR(64),             -- e.g. '+10% Perf / -16% Power vs N3E'
    status VARCHAR(32) DEFAULT 'production',        -- 'rd', 'risk_production', 'production'
    hvm_target_year INT,                            -- High Volume Manufacturing year (e.g. 2025)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MICROARCHITECTURE FAMILIES (e.g. Zen 5, Zen 6, Lion Cove, Oryon V2, Cortex-X925, Blackwell, RDNA 4)
CREATE TABLE IF NOT EXISTS microarchitectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(96) NOT NULL,                      -- e.g. 'Zen 6 "Morpheus"', 'Lion Cove', 'Oryon Gen 2'
    designer VARCHAR(64) NOT NULL,                  -- 'AMD', 'Intel', 'Qualcomm', 'Apple', 'ARM', 'Nvidia'
    isa VARCHAR(32) NOT NULL,                       -- 'x86-64-v4', 'ARMv9.2-A', 'ARMv9.3-A', 'RISC-V'
    foundry_node_id UUID REFERENCES foundry_nodes(id) ON DELETE SET NULL,
    ipc_gain_claim VARCHAR(64),                     -- e.g. '+14% vs Zen 5', '+25% vs Oryon v1'
    key_innovations TEXT[],                         -- e.g. ARRAY['Bfloat16 NPU', 'Backside Power Delivery (PowerVia)', '12-wide decode']
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CHIPS & SOCS (The Central Universal Entity)
CREATE TABLE IF NOT EXISTS chips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(128) UNIQUE NOT NULL,
    marketing_name VARCHAR(128) NOT NULL,           -- e.g. 'Snapdragon 8 Elite', 'Ryzen 9 9950X', 'RTX 5090'
    codename VARCHAR(96),                           -- e.g. 'Sun', 'Granite Ridge', 'Blackwell GB202'
    vendor VARCHAR(64) NOT NULL,                    -- 'Qualcomm', 'AMD', 'Intel', 'Apple', 'MediaTek', 'Nvidia', 'Xiaomi'
    segment platform_segment NOT NULL,
    foundry_node_id UUID REFERENCES foundry_nodes(id) ON DELETE SET NULL,
    primary_microarch_id UUID REFERENCES microarchitectures(id) ON DELETE SET NULL,
    
    -- Packaging & Interconnect
    packaging_tech VARCHAR(96) DEFAULT 'Monolithic',-- 'CoWoS-S', 'EMIB', 'Foveros 3D', 'InFO-PoP', 'Monolithic'
    die_size_mm2 NUMERIC(7, 2),
    transistor_count_billions NUMERIC(7, 2),
    
    -- Thermal & Target Power
    tdp_target_min_w NUMERIC(6, 1),                 -- e.g. 5.0 (Smartphone sustained)
    tdp_target_max_w NUMERIC(6, 1),                 -- e.g. 12.0 (Smartphone peak) or 450 (Desktop dGPU)
    
    -- Verification & Probability
    verification_stage verification_status NOT NULL DEFAULT 'early_rumor',
    spec_confidence_score INT DEFAULT 50 CHECK (spec_confidence_score BETWEEN 0 AND 100),
    expected_launch_quarter VARCHAR(16),            -- e.g. 'Q4 2025'
    release_date DATE,
    
    -- Metadata & Media
    die_shot_url TEXT,
    block_diagram_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CHIP CLUSTER TOPOLOGY (P/E cores, GPU CUs/SMs, Memory, NPU)
CREATE TABLE IF NOT EXISTS chip_topologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chip_id UUID NOT NULL REFERENCES chips(id) ON DELETE CASCADE,
    cluster_type VARCHAR(48) NOT NULL,              -- 'Prime Core', 'Performance Core', 'Efficiency Core', 'GPU Compute Cluster', 'NPU Tile'
    core_count INT NOT NULL,
    microarchitecture_name VARCHAR(96),             -- e.g. 'Oryon Phoenix L', 'Cortex-X925', 'Skymont'
    base_clock_ghz NUMERIC(4, 2),
    boost_clock_ghz NUMERIC(4, 2),
    l2_cache_mb NUMERIC(6, 2),
    l3_cache_mb NUMERIC(6, 2),
    slc_cache_mb NUMERIC(6, 2),                     -- System Level Cache
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MEMORY SUBSYSTEM
CREATE TABLE IF NOT EXISTS chip_memory_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chip_id UUID UNIQUE NOT NULL REFERENCES chips(id) ON DELETE CASCADE,
    memory_type VARCHAR(32) NOT NULL,               -- 'LPDDR5X-9600', 'GDDR7', 'DDR5-6000', 'HBM3e'
    bus_width_bits INT NOT NULL,                    -- 128-bit, 256-bit, 384-bit, 512-bit
    bandwidth_gb_s NUMERIC(7, 2) NOT NULL,          -- e.g. 153.6 GB/s, 1792.0 GB/s
    max_capacity_gb INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NORMALIZED BENCHMARK MATRIX
CREATE TABLE IF NOT EXISTS benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chip_id UUID NOT NULL REFERENCES chips(id) ON DELETE CASCADE,
    category benchmark_category NOT NULL,
    benchmark_name VARCHAR(64) NOT NULL,            -- 'Geekbench 6.3', 'Geekbench 7 preview', 'Time Spy Graphics'
    single_core_or_primary_score NUMERIC(10, 2),
    multi_core_or_secondary_score NUMERIC(10, 2),
    measured_package_power_w NUMERIC(6, 2),         -- Power at wall/package for efficiency curves
    source_url TEXT,
    sample_type VARCHAR(32) DEFAULT 'retail',       -- 'early_leak', 'engineering_sample', 'retail_tested'
    test_device_name VARCHAR(128),                  -- e.g. 'Xiaomi 15 Pro Engineering Board'
    submission_id VARCHAR(64),                      -- e.g. Geekbench browser submission ID
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. THE RUMOR-TO-SILICON DELTA & LEAKER ACCURACY TRACKER
CREATE TABLE IF NOT EXISTS leak_delta_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chip_id UUID NOT NULL REFERENCES chips(id) ON DELETE CASCADE,
    source_name VARCHAR(96) NOT NULL,               -- e.g. 'Digital Chat Station', 'Kopite7kimi', 'Weibo Leaker X'
    source_channel VARCHAR(64),                     -- 'Weibo', 'X / Twitter', 'Chiphell', 'EEC Manifest'
    source_url TEXT,
    predicted_metric VARCHAR(64) NOT NULL,          -- 'GB6 Single Core', 'Process Node', 'Die Size', 'cTDP'
    predicted_value VARCHAR(64) NOT NULL,           -- '3200', 'TSMC N3P', '140mm²', '5.5W'
    actual_confirmed_value VARCHAR(64),             -- Filled upon retail validation: '3140', 'TSMC N3E', etc.
    delta_percentage NUMERIC(6, 2),                 -- e.g. -1.8% or +4.2%
    confidence_at_time INT DEFAULT 50,
    recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    verified_at DATE,
    accuracy_verdict VARCHAR(32) DEFAULT 'pending'  -- 'accurate', 'in_margin', 'debunked', 'pending'
);

-- 9. INDEXES FOR LIGHTNING FAST EDGE QUERIES
CREATE INDEX IF NOT EXISTS idx_chips_segment ON chips(segment);
CREATE INDEX IF NOT EXISTS idx_chips_vendor ON chips(vendor);
CREATE INDEX IF NOT EXISTS idx_chips_node ON chips(foundry_node_id);
CREATE INDEX IF NOT EXISTS idx_benchmarks_chip_category ON benchmarks(chip_id, category);
CREATE INDEX IF NOT EXISTS idx_leak_delta_chip ON leak_delta_records(chip_id);

-- 10. RECURSIVE DEPENDENCY GRAPH VIEW (Foundry -> Microarch -> Chip Products)
CREATE OR REPLACE VIEW v_silicon_dependency_graph AS
SELECT 
    fn.id AS node_id,
    fn.slug AS node_slug,
    fn.foundry_name || ' ' || fn.node_name AS node_title,
    fn.transistor_architecture,
    ma.id AS microarch_id,
    ma.name AS microarch_name,
    ma.designer AS microarch_designer,
    c.id AS chip_id,
    c.marketing_name AS chip_name,
    c.vendor AS chip_vendor,
    c.segment AS chip_segment,
    c.verification_stage,
    c.spec_confidence_score
FROM foundry_nodes fn
LEFT JOIN microarchitectures ma ON ma.foundry_node_id = fn.id
LEFT JOIN chips c ON c.primary_microarch_id = ma.id OR c.foundry_node_id = fn.id;
