-- ====================================================================
-- SILLYCONE SEED DATA: 2024-2026 Silicon Ecosystem
-- ====================================================================

-- 1. FOUNDRY NODES
INSERT INTO foundry_nodes (id, slug, foundry_name, node_name, transistor_architecture, density_mtr_mm2, power_efficiency_delta, status, hvm_target_year)
VALUES
('a0000001-0000-0000-0000-000000000001', 'tsmc-n3e', 'TSMC', 'N3E', 'FinFET (3nm Class)', 215.0, 'Baseline 2nd Gen 3nm', 'production', 2023),
('a0000001-0000-0000-0000-000000000002', 'tsmc-n3p', 'TSMC', 'N3P', 'FinFET (Refined 3nm)', 224.0, '+4% Perf or -9% Power vs N3E', 'production', 2024),
('a0000001-0000-0000-0000-000000000003', 'tsmc-n2', 'TSMC', 'N2', 'GAA Nanosheet (2nm)', 290.0, '+15% Perf or -30% Power vs N3E', 'risk_production', 2025),
('a0000001-0000-0000-0000-000000000004', 'intel-18a', 'Intel Foundry', '18A', 'RibbonFET + PowerVia (BSPDN)', 270.0, 'Sub-2nm Backside Power Era', 'risk_production', 2025),
('a0000001-0000-0000-0000-000000000005', 'tsmc-4np', 'TSMC', '4NP', 'Custom 4nm FinFET', 170.0, 'Optimized Custom Nvidia Node', 'production', 2024);

-- 2. MICROARCHITECTURES
INSERT INTO microarchitectures (id, slug, name, designer, isa, foundry_node_id, ipc_gain_claim, key_innovations)
VALUES
('b0000001-0000-0000-0000-000000000001', 'oryon-gen-2', 'Oryon Gen 2', 'Qualcomm', 'ARMv9.2-A', 'a0000001-0000-0000-0000-000000000002', '+45% Single-core vs SD 8 Gen 3', ARRAY['Custom Nuvia-heritage core', '4.32GHz peak boost', 'No efficiency-only cores']),
('b0000001-0000-0000-0000-000000000002', 'cortex-x925', 'Cortex-X925 ("Blackhawk")', 'ARM', 'ARMv9.2-A', 'a0000001-0000-0000-0000-000000000002', '+36% IPC vs Cortex-X4', ARRAY['10-wide decode', '3MB private L2', 'Up to 3.63GHz']),
('b0000001-0000-0000-0000-000000000003', 'lion-cove', 'Lion Cove', 'Intel', 'x86-64-v4', 'a0000001-0000-0000-0000-000000000001', '+9% IPC vs Redwood Cove', ARRAY['Zero Hyper-Threading', 'Fine-grained power islands', '3MB L2']),
('b0000001-0000-0000-0000-000000000004', 'zen-5', 'Zen 5 ("Nirvana")', 'AMD', 'x86-64-v4', 'a0000001-0000-0000-0000-000000000001', '+16% Avg IPC vs Zen 4', ARRAY['Dual-pipelined 512-bit AVX-512', 'Dual 4-wide decode', 'Full-speed VNNI']),
('b0000001-0000-0000-0000-000000000005', 'zen-6', 'Zen 6 ("Morpheus")', 'AMD', 'x86-64-v4', 'a0000001-0000-0000-0000-000000000003', '+15% IPC Projected', ARRAY['2.5D interconnect refresh', '32-core CCDs planned', 'TSMC 2nm N2 compute']),
('b0000001-0000-0000-0000-000000000006', 'blackwell-arch', 'Blackwell GPU', 'Nvidia', 'CUDA 12.x', 'a0000001-0000-0000-0000-000000000005', '+100% Ray Reconstruction Gen 5', ARRAY['5th Gen Tensor Core', 'Dual-die 10TB/s NV-HBI', 'GDDR7 controller']),
('b0000001-0000-0000-0000-000000000007', 'xiaomi-custom-core', 'Xiaomi Custom CPU Tile (Rumored)', 'Xiaomi', 'ARMv9.2-A', 'a0000001-0000-0000-0000-000000000002', 'Targeting A17 Pro class IPC', ARRAY['In-house ISP integration', 'Custom NPU accelerator', 'Unisoc/Arm partnership']);

-- 3. CHIPS & SOCS
INSERT INTO chips (id, slug, marketing_name, codename, vendor, segment, foundry_node_id, primary_microarch_id, packaging_tech, tdp_target_min_w, tdp_target_max_w, verification_stage, spec_confidence_score, expected_launch_quarter, release_date)
VALUES
('c0000001-0000-0000-0000-000000000001', 'snapdragon-8-elite', 'Snapdragon 8 Elite', 'SM8750 "Sun"', 'Qualcomm', 'mobile_soc', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'InFO-PoP', 4.5, 12.5, 'retail_verified', 100, 'Q4 2024', '2024-10-21'),
('c0000001-0000-0000-0000-000000000002', 'dimensity-9400', 'Dimensity 9400', 'MT6991', 'MediaTek', 'mobile_soc', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002', 'InFO-PoP', 4.0, 11.8, 'retail_verified', 100, 'Q4 2024', '2024-10-09'),
('c0000001-0000-0000-0000-000000000003', 'apple-a18-pro', 'Apple A18 Pro', 'Tahiti T8140', 'Apple', 'mobile_soc', 'a0000001-0000-0000-0000-000000000002', NULL, 'InFO-PoP', 3.8, 10.5, 'retail_verified', 100, 'Q3 2024', '2024-09-09'),
('c0000001-0000-0000-0000-000000000004', 'xiaomi-xring-01', 'Xiaomi XRing 01 (Rumored)', 'Pinecone 2', 'Xiaomi', 'mobile_soc', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000007', 'Monolithic', 4.8, 11.5, 'early_rumor', 65, 'Q2 2025', NULL),
('c0000001-0000-0000-0000-000000000005', 'core-ultra-9-285k', 'Intel Core Ultra 9 285K', 'Arrow Lake-S', 'Intel', 'desktop_cpu', 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000003', 'Foveros 3D Multi-Tile', 125.0, 250.0, 'retail_verified', 100, 'Q4 2024', '2024-10-24'),
('c0000001-0000-0000-0000-000000000006', 'ryzen-9-9950x', 'AMD Ryzen 9 9950X', 'Granite Ridge', 'AMD', 'desktop_cpu', 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000004', 'Dual CCD Chiplet', 170.0, 230.0, 'retail_verified', 100, 'Q3 2024', '2024-08-15'),
('c0000001-0000-0000-0000-000000000007', 'geforce-rtx-5090', 'NVIDIA GeForce RTX 5090', 'Blackwell GB202', 'Nvidia', 'discrete_gpu', 'a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000006', 'Monolithic Custom High-Yield', 450.0, 600.0, 'es_sample_hit', 90, 'Q1 2025', NULL);

-- 4. CHIP TOPOLOGIES
INSERT INTO chip_topologies (chip_id, cluster_type, core_count, microarchitecture_name, base_clock_ghz, boost_clock_ghz, l2_cache_mb, l3_cache_mb, slc_cache_mb)
VALUES
-- Snapdragon 8 Elite: 2 Prime + 6 Performance (All Oryon Gen 2)
('c0000001-0000-0000-0000-000000000001', 'Prime Core Cluster', 2, 'Oryon Gen 2 Phoenix L', 3.53, 4.32, 12.0, 0, 12.0),
('c0000001-0000-0000-0000-000000000001', 'Performance Core Cluster', 6, 'Oryon Gen 2 Phoenix M', 2.80, 3.53, 12.0, 0, 12.0),
-- Dimensity 9400: All Big Core (1 Cortex-X925 + 3 Cortex-X4 + 4 Cortex-A720)
('c0000001-0000-0000-0000-000000000002', 'Ultra Prime Core', 1, 'Cortex-X925', 3.00, 3.63, 2.0, 12.0, 10.0),
('c0000001-0000-0000-0000-000000000002', 'Prime Core Cluster', 3, 'Cortex-X4', 2.60, 3.30, 3.0, 12.0, 10.0),
('c0000001-0000-0000-0000-000000000002', 'Performance Core Cluster', 4, 'Cortex-A720', 2.00, 2.40, 2.0, 12.0, 10.0),
-- Intel Core Ultra 9 285K: 8 Lion Cove (P) + 16 Skymont (E)
('c0000001-0000-0000-0000-000000000005', 'Performance Cores (P-Cores)', 8, 'Lion Cove', 3.70, 5.70, 24.0, 36.0, 0),
('c0000001-0000-0000-0000-000000000005', 'Efficiency Cores (E-Cores)', 16, 'Skymont', 3.20, 4.60, 16.0, 36.0, 0),
-- AMD Ryzen 9 9950X: 16 Zen 5
('c0000001-0000-0000-0000-000000000006', 'High Performance CCDs', 16, 'Zen 5', 4.30, 5.70, 16.0, 64.0, 0);

-- 5. MEMORY SPECS
INSERT INTO chip_memory_specs (chip_id, memory_type, bus_width_bits, bandwidth_gb_s, max_capacity_gb)
VALUES
('c0000001-0000-0000-0000-000000000001', 'LPDDR5X-9600', 128, 153.60, 24),
('c0000001-0000-0000-0000-000000000002', 'LPDDR5X-10667', 128, 170.67, 24),
('c0000001-0000-0000-0000-000000000003', 'LPDDR5X-7500', 128, 120.00, 8),
('c0000001-0000-0000-0000-000000000005', 'DDR5-6400', 128, 102.40, 192),
('c0000001-0000-0000-0000-000000000006', 'DDR5-6000 EXPO', 128, 96.00, 192),
('c0000001-0000-0000-0000-000000000007', 'GDDR7-28Gbps', 512, 1792.00, 32);

-- 6. NORMALIZED BENCHMARKS
INSERT INTO benchmarks (chip_id, category, benchmark_name, single_core_or_primary_score, multi_core_or_secondary_score, measured_package_power_w, sample_type, test_device_name)
VALUES
-- Snapdragon 8 Elite
('c0000001-0000-0000-0000-000000000001', 'cpu_ipc_geekbench6', 'Geekbench 6.3.0', 3240.0, 10520.0, 6.2, 'retail_tested', 'OnePlus 13 Retail'),
('c0000001-0000-0000-0000-000000000001', 'gpu_mobile_wildlife_extreme', '3DMark Wild Life Extreme', 6950.0, 41.5, 9.8, 'retail_tested', 'Realme GT 7 Pro'),
-- Dimensity 9400
('c0000001-0000-0000-0000-000000000002', 'cpu_ipc_geekbench6', 'Geekbench 6.3.0', 2980.0, 9350.0, 5.8, 'retail_tested', 'Vivo X200 Pro'),
('c0000001-0000-0000-0000-000000000002', 'gpu_mobile_wildlife_extreme', '3DMark Wild Life Extreme', 7200.0, 43.1, 10.2, 'retail_tested', 'Vivo X200 Pro'),
-- Apple A18 Pro
('c0000001-0000-0000-0000-000000000003', 'cpu_ipc_geekbench6', 'Geekbench 6.3.0', 3450.0, 8790.0, 4.6, 'retail_tested', 'iPhone 16 Pro Max'),
-- Xiaomi XRing Rumor
('c0000001-0000-0000-0000-000000000004', 'cpu_ipc_geekbench6', 'Geekbench 6.3.0', 3120.0, 9600.0, 5.5, 'early_leak', 'Xiaomi Engineering Validation Board'),
-- Intel Core Ultra 9 285K
('c0000001-0000-0000-0000-000000000005', 'cpu_ipc_geekbench6', 'Geekbench 6.3.0', 3420.0, 23500.0, 125.0, 'retail_tested', 'ASUS ROG Maximus Z890 Hero'),
('c0000001-0000-0000-0000-000000000005', 'cpu_sustained_cinebench_2024', 'Cinebench 2024', 142.0, 2480.0, 245.0, 'retail_tested', 'ASUS ROG Maximus Z890 Hero'),
-- AMD Ryzen 9 9950X
('c0000001-0000-0000-0000-000000000006', 'cpu_ipc_geekbench6', 'Geekbench 6.3.0', 3380.0, 21900.0, 170.0, 'retail_tested', 'MSI MEG X670E ACE'),
('c0000001-0000-0000-0000-000000000006', 'cpu_sustained_cinebench_2024', 'Cinebench 2024', 138.0, 2390.0, 205.0, 'retail_tested', 'MSI MEG X670E ACE'),
-- RTX 5090 Rumor/ES Sample
('c0000001-0000-0000-0000-000000000007', 'gpu_raster_timespy', '3DMark Time Spy Graphics', 48500.0, 0, 575.0, 'engineering_sample', 'Nvidia Testing Board PG144/145');

-- 7. RUMOR-TO-SILICON DELTA RECORDS (Leaker Accountability)
INSERT INTO leak_delta_records (chip_id, source_name, source_channel, predicted_metric, predicted_value, actual_confirmed_value, delta_percentage, confidence_at_time, accuracy_verdict)
VALUES
('c0000001-0000-0000-0000-000000000001', 'Digital Chat Station', 'Weibo', 'Peak Clock Speed', '4.37 GHz', '4.32 GHz', -1.14, 85, 'in_margin'),
('c0000001-0000-0000-0000-000000000001', 'Ice Universe', 'X / Twitter', 'GB6 Single Core', '3200', '3240', 1.25, 90, 'accurate'),
('c0000001-0000-0000-0000-000000000004', 'Digital Chat Station', 'Weibo', 'GB6 Single Core Target', '3200', NULL, NULL, 50, 'pending'),
('c0000001-0000-0000-0000-000000000004', 'Weibo Supply Chain Insider', 'Weibo', 'Foundry Node', 'TSMC N3P', NULL, NULL, 65, 'pending'),
('c0000001-0000-0000-0000-000000000007', 'Kopite7kimi', 'X / Twitter', 'Memory Bus Width', '512-bit GDDR7', '512-bit GDDR7', 0.0, 95, 'accurate'),
('c0000001-0000-0000-0000-000000000007', 'Kopite7kimi', 'X / Twitter', 'TDP Envelope', '600W', '600W (Peak BIOS)', 0.0, 80, 'accurate');
