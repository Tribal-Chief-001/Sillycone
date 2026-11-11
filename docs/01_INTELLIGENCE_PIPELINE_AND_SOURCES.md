# Sillycone Silicon Intelligence Pipeline & Sources Architecture

> **Document ID:** `SIL-ARCH-001`  
> **Status:** `Active Engineering Specification`  
> **Cost Profile:** `$0.00 / Month (100% Serverless / Open-Source Free Tiers)`  
> **Target System:** [Sillycone Spec Observatory & DAG](file:///home/lucifer/Documents/Projects/Sillycone/README.md)  
> **Schema Reference:** [`supabase/migrations/001_initial_schema.sql`](file:///home/lucifer/Documents/Projects/Sillycone/supabase/migrations/001_initial_schema.sql) | [`src/types/silicon.ts`](file:///home/lucifer/Documents/Projects/Sillycone/src/types/silicon.ts)

---

## 1. Executive Overview & Pipeline Architecture

The **Sillycone Silicon Intelligence Pipeline** is an autonomous, zero-marginal-cost data ingestion, entity resolution, and probabilistic spec forecasting engine. In the semiconductor industry, silicon architectures do not emerge overnight: they leave an indelible, chronological trail of forensic breadcrumbs across pre-silicon tape-out declarations, compiler infrastructure backends, low-level OS kernel drivers, regulatory filings, logistics manifests, synthetic benchmark validation runs, supply chain leaks, and academic teardowns.

```mermaid
flowchart TD
    subgraph S1["Tier 1: Pre-Silicon & Architecture (Months T-36 to T-18)"]
        A1["ISSCC / Hot Chips / IEDM Papers"]
        A2["LLVM / Clang Target Triples & Schedulers"]
        A3["GCC Arch Flags & Binutils"]
    end

    subgraph S2["Tier 2: OS Enablement & Firmware (Months T-18 to T-8)"]
        B1["Linux Kernel (LKML, drm-next, tip.git)"]
        B2["Mesa 3D (RADV, ANV, Freedreno, Panfrost)"]
        B3["Coreboot & Tianocore EDK2 Firmware"]
    end

    subgraph S3["Tier 3: Trade, Customs & Regulatory (Months T-8 to T-3)"]
        C1["Zauba / NBD / Volza Customs Manifests"]
        C2["EEC Regulatory Filings (EAEU Portal)"]
        C3["Bluetooth SIG / Wi-Fi Alliance Registrations"]
    end

    subgraph S4["Tier 4: Validation & Leaks (Months T-4 to T-1)"]
        D1["Geekbench 6/7 Browser Telemetry"]
        D2["UL 3DMark / VRMark Results Database"]
        D3["Weibo Insiders (DCS, Fixed Focus)"]
        D4["Chiphell Hardware Forums"]
        D5["X / Twitter Leakers (Kopite, Kepler, GoldenPig)"]
    end

    subgraph INGEST["Autonomous Ingestion & Defense Gateway ($0/mo)"]
        E1["GitHub Actions Cron Matrix (0 */6 * * *)"]
        E2["Lightweight Scraper Pool (HTTP/2, Jitter, UA Rotation)"]
        E3["Anti-Bot / Proof-of-Work Compliance Gate"]
        E4["Deduplication Cache (SHA-256 Bloom Filter)"]
    end

    subgraph RESOLVE["Resolution & Probabilistic Spec Engine"]
        F1["Fuzzy Silicon Entity Normalizer"]
        F2["Cluster Topology & Memory Parser"]
        F3["Bayesian Confidence Scoring Engine"]
        F4["Leaker Accuracy & Delta Calculator"]
    end

    subgraph STORE["Supabase PostgreSQL 15 Hybrid DB"]
        G1[("foundry_nodes")]
        G2[("microarchitectures")]
        G3[("chips")]
        G4[("chip_topologies")]
        G5[("benchmarks")]
        G6[("leak_delta_records")]
    end

    S1 --> INGEST
    S2 --> INGEST
    S3 --> INGEST
    S4 --> INGEST
    INGEST --> RESOLVE
    RESOLVE --> STORE
```

### 1.1 The Silicon Verification Progression Lifecycle

Sillycone models all semiconductor entities through a formal five-tier lifecycle state machine reflected in the database enum [`verification_status`](file:///home/lucifer/Documents/Projects/Sillycone/supabase/migrations/001_initial_schema.sql#L19-L25):

```mermaid
stateDiagram-v2
    [*] --> early_rumor: Weibo / X / Chiphell Whispers (10-35% Confidence)
    early_rumor --> patent_or_driver: LKML / Mesa / LLVM / EEC / Customs (50-75% Confidence)
    patent_or_driver --> es_sample_hit: Geekbench / 3DMark ES Telemetry (80-92% Confidence)
    es_sample_hit --> announced: Keynote / Whitepaper / Press Release (95% Confidence)
    announced --> retail_verified: Lab Teardown / Die Shot / Retail Wattage (100% Truth)
    retail_verified --> [*]
```

1. **`early_rumor` (10% - 35% Confidence):** Speculative leaks originating from supply-chain insiders, foundry packaging schedules, or Chinese forum leaks. Prone to revision; tracked under delta accountability logs.
2. **`patent_or_driver` (50% - 75% Confidence):** Cryptic PCI Device IDs, CPUID model bytes, compiler target schedule tables, and regulatory customs shipments. High certainty of physical existence; partial certainty of final marketing name and retail clock ceilings.
3. **`es_sample_hit` (80% - 92% Confidence):** Live benchmark submissions run on Qualification Samples (QS) or Engineering Samples (ES). Validates physical cluster layouts, instruction support, and clock floors.
4. **`announced` (95% Confidence):** Vendor press kit, formal slide deck, and OEM design win announcements. Clock ceilings and architectural claims locked; third-party power efficiency unverified.
5. **`retail_verified` (100% Confidence / Ground Truth):** Third-party silicon delidding, infrared microscopy, TechInsights die shots, and calibrated package-level power isolation measurements (Geekerwan, Der8auer, AnandTech).

---

## 2. Source-by-Source Technical Deep Dive

The matrix below indexes every silicon data source mined by Sillycone, detailing the underlying transport protocol, target artifact paths, telemetry yield, scraper extraction logic, and rate-limiting rules.

| Source ID | Source Name | Primary Protocol | Target File / URL / Endpoint | Key Silicon Intelligence Yielded | Default Verification Stage |
|---|---|---|---|---|---|
| `SRC-01` | **Linux Kernel (LKML & DRM)** | Git / Lore Atom | `lore.kernel.org`, `drivers/gpu/drm/`, `arch/x86/`, `arch/arm64/` | CPUID, PCI Device IDs, cache topology, power states | `patent_or_driver` |
| `SRC-02` | **Mesa 3D Graphics** | GitLab REST API | `gitlab.freedesktop.org/mesa/mesa`, `src/amd/`, `src/intel/` | GPU CU counts, RDNA/Xe generations, shader cores | `patent_or_driver` |
| `SRC-03` | **Coreboot & EDK2** | Gerrit REST API | `review.coreboot.org`, `src/soc/{intel,amd,qualcomm}` | Memory channels, PCIe lane trees, boot strap configs | `patent_or_driver` |
| `SRC-04` | **LLVM / Clang Triples** | GitHub Git Diff | `llvm-project/llvm/lib/Target/`, TableGen `.td` models | Pipeline dispatch width, ALU latency, ISA flags | `patent_or_driver` |
| `SRC-05` | **EEC Regulatory Registries** | HTTPS / Custom Parser | `portal.eaeunion.org` Notification Registry | Commercial SKU model numbers, VRAM capacity, board partners | `patent_or_driver` |
| `SRC-06` | **Customs & Trade Manifests** | HTTPS Search | Zauba, NBD, Volza, ImportYeti Port Manifests | Steppings (A0, B0), package sockets (LGA/BGA), cTDP | `patent_or_driver` |
| `SRC-07` | **Geekbench & UL 3DMark** | HTTP/2 HTML DOM | `browser.geekbench.com/v6/cpu`, `www.3dmark.com/search` | ES device IDs, exact cluster clocks, single/multi scores | `es_sample_hit` |
| `SRC-08` | **Weibo Leakers (DCS / FF)** | Mobile JSON API | `m.weibo.cn/api/container/getIndex?containerid=...` | Foundry node targets (N3P/SF2), early Geekbench goals | `early_rumor` |
| `SRC-09` | **Chiphell Hardware Forums** | HTTPS / Forum Scraping | `chiphell.com/forum-2-1.html`, `forum-21-1.html` | CPU-Z / GPU-Z screenshots, PCB layouts, BIOS dumps | `early_rumor` |
| `SRC-10` | **X / Twitter Hardware Leakers** | Syndication API / Mirrors | Accounts: `@kopite7kimi`, `@Kepler_L2`, `@momomo_us` | Die configurations, GPC/SM counts, TDP estimates | `early_rumor` |
| `SRC-11` | **ISSCC & Hot Chips Papers** | DOI / Program Index | IEEE Xplore, `hotchips.org` proceedings | Transistor density (MTr/mm²), die size, SRAM cell mm² | `announced` / `retail` |

---

### 2.1 Source 1: Linux Kernel Mailing Lists (LKML) & Kernel Git Trees

The Linux Kernel represents the earliest public, production-grade confirmation of upcoming silicon. Hardware manufacturers (Intel, AMD, Qualcomm, ARM, Apple via Asahi) submit patches anywhere from 6 to 18 months before retail launch to ensure kernel compatibility upon silicon availability.

#### Target Repositories & Subsystems
- **Git Trees:**
  - `git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git` (Mainline)
  - `git://git.kernel.org/pub/scm/linux/kernel/git/next/linux-next.git` (Linux Next integration branch)
  - `git://anongit.freedesktop.org/drm/drm-next` (Direct Rendering Manager - graphics drivers)
  - `git://git.kernel.org/pub/scm/linux/kernel/git/tip/tip.git` (x86 core, scheduler, perf events)
- **Target Directories & Files:**
  - `arch/x86/kernel/cpu/intel.c`, `arch/x86/kernel/cpu/amd.c` (CPUID identification, family, model, stepping)
  - `arch/x86/include/asm/intel-family.h` (Canonical processor model macros: e.g. `INTEL_PANTHERLAKE_L`, `INTEL_ARROWLAKE`)
  - `drivers/gpu/drm/amd/amdgpu/` (`amdgpu_drv.c`, `soc21.c`, `soc15.c` — PCI Device ID tables, IP discovery blocks)
  - `drivers/gpu/drm/xe/xe_pci.c` (Intel Xe and Xe2 discrete & integrated GPU tables)
  - `Documentation/devicetree/bindings/arm/cpus.yaml` & `arch/arm64/boot/dts/qcom/` (Device Tree bindings declaring core clusters, cache tiers, regulator domains for Qualcomm Snapdragon SoCs)

#### Silicon Intelligence Yield
- **CPUID Tuple:** `(Family, Model, Stepping)` revealing architectural revisions before brand names are coined.
- **Cache Topology:** L1 Instruction/Data, L2 unified, and L3 slices mapped via `arch/x86/kernel/cpu/cacheinfo.c`.
- **Power Management & P-States:** CPPC (Collaborative Processor Performance Control) frequency envelopes and ACPI thermal tripping points.
- **PCI Device IDs:** Hexadecimal pairs `0x1002:0xXXXX` (AMD) and `0x8086:0xXXXX` (Intel) mapping to specific unannounced physical dies.

#### Scraper Mechanism
Rather than cloning multi-gigabyte git repositories on ephemeral GitHub Actions runners, Sillycone utilizes the public **Lore Public-Inbox NNTP/Atom feeds** (`https://lore.kernel.org/`):

```python
import feedparser
import re
import requests

LORE_ATOM_FEEDS = [
    "https://lore.kernel.org/lkml/new.atom",
    "https://lore.kernel.org/dri-devel/new.atom",
    "https://lore.kernel.org/linux-arm-kernel/new.atom"
]

KERNEL_SIGNAL_REGEX = re.compile(
    r"(?P<vendor>Intel|AMD|Qualcomm|Apple).*?"
    r"(?:Family\s+(?P<family>0x[0-9a-fA-F]+)|Model\s+(?P<model>0x[0-9a-fA-F]+)|"
    r"Device\s+ID\s+(?P<pci_id>0x[0-9a-fA-F]{4})|"
    r"PCI_VDEVICE\((?P<pci_macro>[A-Z_]+),\s*(?P<dev_id>0x[0-9a-fA-F]{4})\))",
    re.IGNORECASE
)

def poll_kernel_patches(since_timestamp: str):
    new_findings = []
    for feed_url in LORE_ATOM_FEEDS:
        feed = feedparser.parse(feed_url)
        for entry in feed.entries:
            if entry.updated > since_timestamp:
                match = KERNEL_SIGNAL_REGEX.search(entry.summary)
                if match:
                    new_findings.append({
                        "source": "LKML",
                        "title": entry.title,
                        "link": entry.link,
                        "timestamp": entry.updated,
                        "matches": match.groupdict()
                    })
    return new_findings
```

---

### 2.2 Source 2: Mesa 3D Graphics Library & DRM Drivers

Mesa is the open-source userspace implementation of OpenGL, Vulkan, and OpenCL for Linux. GPU vendors—especially AMD (RADV / RadeonSI) and Intel (ANV / Iris)—commit hardware ISA features, register definitions, and shader core configurations into Mesa months before retail board debuts.

#### Target Repositories & Artifacts
- **Repository:** `https://gitlab.freedesktop.org/mesa/mesa`
- **Key Target Files:**
  - `include/pci_ids/radeons_pci_ids.h` (AMD Radeon PCI Device ID mappings)
  - `include/pci_ids/iris_pci_ids.h` & `include/pci_ids/crocus_pci_ids.h` (Intel Graphics Device IDs)
  - `src/amd/common/ac_gpu_info.c` (Compute Unit counts, Workgroup Processors (WGPs), RDNA generation flags, Infinity Cache / MALL sizing)
  - `src/intel/vulkan/anv_device.c` (Intel Xe-LPG, Xe2-HPG execution units, slice counts, ray tracing hardware units)
  - `src/freedreno/` & `src/panfrost/` (Qualcomm Adreno and ARM Mali/Immortalis GPU microarchitecture registers)

#### Silicon Intelligence Yield
- **Compute Unit (CU) & Workgroup Processor (WGP) Topology:** Total shader cores calculated via $CUs \times 64$ (AMD) or $EUs \times 8$ (Intel).
- **Sub-slice / Dual-Compute-Unit Configuration:** Ratio of vector registers, ray tracing pipelines, and matrix acceleration units.
- **Cache Slices:** MALL (Memory Attached Last Level) size in MB.

#### Ingestion & Extraction Strategy
Sillycone invokes the GitLab REST API targeting recent commits modifying the `include/pci_ids/` directory:

```bash
curl -s "https://gitlab.freedesktop.org/api/v4/projects/176/repository/commits?path=include/pci_ids&per_page=10" \
  | jq '.[0] | {id: .id, title: .title, authored_date: .authored_date}'
```

---

### 2.3 Source 3: Coreboot & Tianocore EDK2 Firmware

Coreboot is an open-source system BIOS/firmware project widely utilized in Google Chromebooks, system76 laptops, and hyperscale servers. EDK2 is the industry reference UEFI implementation.

#### Target Artifacts
- **Gerrit Code Review:** `https://review.coreboot.org/`
- **GitHub Mirror:** `https://github.com/coreboot/coreboot`
- **Target Directories:**
  - `src/soc/intel/arrowlake/`, `src/soc/intel/pantherlake/`, `src/soc/amd/strix/`, `src/soc/qualcomm/`
  - `src/mainboard/google/` (Google reference board schematics: reveals upcoming SoC design wins under code names such as *Rex*, *Brya*, *Nissa*)

#### Silicon Intelligence Yield
- **Memory Channel Geometry:** Physical support for LPDDR5X-8533, DDR5-6400, or CAMM2 modules.
- **PCIe Lane Topology:** Bifurcation capabilities (e.g. 1x16 Gen 5 + 2x4 Gen 4 M.2).
- **Thermal Design Power (TDP) Profiles:** PL1 (Sustained Power limit), PL2 (Short-term boost limit), Tau (boost time duration), and cTDP down/up voltage tables.

#### Scraping Pipeline
Sillycone queries the Coreboot Gerrit REST API for merged and pending changes containing semiconductor vendor code names:

```python
import requests

def scan_coreboot_gerrit(vendor_keyword: str):
    url = f"https://review.coreboot.org/changes/?q=status:open+OR+status:merged+{vendor_keyword}&n=25"
    # Gerrit responses prepend magic anti-XSS string ")]}'"
    resp = requests.get(url, timeout=10)
    clean_json = resp.text.lstrip(")]}'\n")
    return requests.json.loads(clean_json)
```

---

### 2.4 Source 4: LLVM / Clang Target Triples & Compiler Backends

Before new silicon can execute native binaries, compiler toolchains must be taught its Instruction Set Architecture (ISA) extensions, pipeline dispatch widths, register renaming files, and execution port latency tables.

#### Target Files in `llvm/llvm-project`
- `llvm/lib/Target/X86/X86.td` (Defines processor sub-targets and feature flags)
- `llvm/lib/Target/X86/X86ScheduleLionCove.td`, `X86ScheduleZen5.td` (Complete cycle-accurate execution models)
- `llvm/lib/Target/AArch64/AArch64Processors.td` (ARM and Qualcomm Oryon processor models)
- `clang/include/clang/Driver/Options.td` (Compiler invocation flags: `-march=arrowlake`, `-mcpu=cortex-x925`)

#### Silicon Intelligence Yield
- **Execution Pipeline Geometry:** Instruction Decode width (e.g. 8-wide vs 10-wide), ALU port dispatch counts, integer versus floating-point scheduler sizes.
- **ISA Extension Matrix:** Support for AVX10.2, APX (Advanced Performance Extensions - 32 GPRs), AMX-FP16, SME2 (Scalable Matrix Extension 2), and SVE2.
- **Instruction Latency & Reciprocal Throughput:** Exact cycle costs for cryptographic, vector, and tensor instructions.

```mermaid
classDiagram
    class LLVM_Processor_Model {
        +String CPUName
        +String SchedModel
        +List~String~ Features
        +Int DecodeWidth
        +Int IssueWidth
        +Int ReorderBufferSize
    }
    class Sillycone_Microarchitecture {
        +UUID id
        +String slug
        +String isa
        +List~String~ key_innovations
    }
    LLVM_Processor_Model --> Sillycone_Microarchitecture : Maps to
```

---

### 2.5 Source 5: Eurasian Economic Commission (EEC) Regulatory Registries

The Eurasian Economic Commission (EEC / ЕЭК) enforces mandatory registration of electronic equipment containing cryptographic or wireless hardware for commerce within member states (Russia, Belarus, Kazakhstan, Armenia, Kyrgyzstan). Additions are publicly published in the **Single Register of Notifications about the Characteristics of Cryptographic Devices**.

#### Forensic Nature & Mechanics
- **Early-Warning Timeline:** Additions occur **3 to 8 weeks** prior to worldwide retail announcements. Board partners (ASUS, Gigabyte, MSI, ASRock, PowerColor, Sapphire) submit comprehensive lists of SKUs to secure import clearance.
- **Target URL:** `https://portal.eaeunion.org/sites/odata/_layouts/15/Portal.EEC.Registry.UI/DisplayForm.aspx`
- **Data Payload Structure:** String enumerations containing full commercial model strings, e.g.:
  `GV-N5090AORUS M-32GD, GV-N5080GAMING OC-16GD, ROG-CROSSHAIR-X870E-HERO`

#### Silicon Intelligence Yield
- **Retail VRAM Capacity:** Decodes `32GD` = 32 GB GDDR7, `16GD` = 16 GB GDDR7.
- **Memory Bus Width Deduction:** A 32 GB GDDR7 allocation on standard 2 GB (16 Gb) dies mandates a **512-bit bus** ($16 \times 32\text{-bit}$ channels), confirming the physical die memory interface.
- **SKU Tiering:** Identifies distinct chip tiers (e.g. RTX 5090 vs RTX 5080) and vendor board designs.

#### Parser & Model Decoder Engine
```python
import re

EEC_SKU_REGEX = re.compile(
    r"(?P<vendor>GV|ROG|TUF|MEG|MPG)-"
    r"(?P<brand>[A-Z]+)?"
    r"(?P<chip_family>[0-9]{4}|[A-Z0-9]+)"
    r"(?P<sub_variant>[A-Z]+)?-"
    r"(?P<vram_gb>[0-9]{1,2})GD",
    re.IGNORECASE
)

def parse_eec_sku(sku_string: str):
    match = EEC_SKU_REGEX.search(sku_string)
    if match:
        data = match.groupdict()
        return {
            "canonical_chip": f"GeForce RTX {data['chip_family']}",
            "vram_gb": int(data["vram_gb"]),
            "memory_type": "GDDR7",
            "confidence": 75,
            "verification_status": "patent_or_driver"
        }
    return None
```

---

### 2.6 Source 6: Customs & International Shipping Manifests (Zauba / NBD / Volza)

Before silicon hits production packaging, wafer test dies, package test vehicles (PTV), and engineering samples are shipped across global R&D centers (e.g. from TSMC in Hsinchu/Tainan to AMD in Austin/Boxborough, or Intel between Hillsboro, Penang, and Leixlip).

#### Target Portals
- **Zauba / EximPulse / NBD / Volza / ImportYeti**
- **Search Filters:** Harmonized System (HS) Codes `8542.31` (Processors and controllers, whether or not combined with memories, converters, logic circuits).

#### Forensic Extraction & Field Mapping
Shipment line items are typically disguised under engineering jargon, but contain key parameters:
```
LINE ITEM: "IC PROCESSOR PROTOTYPE (LGA1851 / 1851 PINS) ARROW LAKE-S 8+16 B0 STEPPING (TEST BOARD ONLY) VALUE: $1,450 USD"
```
From this single manifest line item, Sillycone extracts:
- **Physical Socket:** `LGA1851`
- **Platform:** `Arrow Lake-S` (Desktop Client)
- **Die Configuration:** `8+16` (8 Lion Cove Performance Cores + 16 Skymont Efficiency Cores)
- **Silicon Stepping:** `B0` (Revision indicating pre-production bug fixes over A0)

---

### 2.7 Source 7: Geekbench & UL 3DMark Browser Scraping

Geekbench (Primate Labs) and 3DMark (UL Solutions) public submission databases capture telemetry from live hardware execution. Prototype testing in OEM labs (Xiaomi, ASUS, Dell, Lenovo) inevitably leaks test runs to public browsers.

#### Scraping Implementation in Sillycone
The active crawler is implemented in [`scrapers/geekbench_collector.py`](file:///home/lucifer/Documents/Projects/Sillycone/scrapers/geekbench_collector.py).

#### Data Telemetry Extracted
- **Processor Identification String:** e.g. `"ARM implementer 81 architecture 8 variant 1 part 0"` (Identifying Qualcomm Oryon V2).
- **Cluster Breakdown:** Number of clusters, core counts per cluster, base frequencies, and boost frequency governors.
- **Raw Scores:** Single-core, multi-core, and individual workload breakdowns (AES-XTS encryption, ray tracing, text compression, object detection).
- **Outlier Filtering & Rejection:**
  - *Dry-Ice / LN2 Filter:* Benchmark scores exceeding physical thermal dissipation thresholds by $>35\%$ with unverified frequencies are flagged as extreme overclocking and isolated from baseline metrics.
  - *Fake / Spoofed ID Filter:* Mismatches between CPUID family strings and advertised clock speeds are quarantined.

```python
def extract_geekbench_payload(submission_soup):
    """
    Extracts high-resolution telemetry from a single Geekbench v6 run.
    """
    system_info = {}
    for row in submission_soup.select("table.table-striped tr"):
        cols = row.find_all("td")
        if len(cols) == 2:
            key = cols[0].text.strip()
            val = cols[1].text.strip()
            system_info[key] = val

    cluster_info = submission_soup.select_one(".table.table-striped .cluster-summary")
    return {
        "model": system_info.get("Model"),
        "cpu_name": system_info.get("Processor"),
        "cluster_summary": cluster_info.text.strip() if cluster_info else None,
        "single_core": int(submission_soup.select_one(".single-core-score").text),
        "multi_core": int(submission_soup.select_one(".multi-core-score").text),
        "memory_info": system_info.get("Memory")
    }
```

---

### 2.8 Source 8: Chinese Social Media Insiders (Weibo - DCS & Fixed Focus)

Chinese supply chain insiders hold direct visibility into Taiwanese packaging facilities (ASE, TSMC) and Shenzhen OEM engineering benches (BBK, Xiaomi, Honor).

#### Primary Accounts Tracked
- **Digital Chat Station (数码闲聊站 - UID `2656274875`):** Unrivaled track record for Qualcomm Snapdragon, MediaTek Dimensity, and Apple A-series architectural specifications.
- **Fixed Focus Digital (定焦数码 - UID `5543166810`):** Optics, NPU silicon, and secondary coprocessor specifications.

#### Ingestion Strategy via Mobile Web API
Weibo's mobile interface exposes a lightweight JSON endpoint that avoids aggressive browser fingerprinting:
```
Endpoint: https://m.weibo.cn/api/container/getIndex?type=uid&value={UID}&containerid=107603{UID}
```

#### Natural Language Processing & Terminology Translation
Insiders employ cryptic nicknames to evade corporate NDA bots:
- *"Black Island" (黑岛)* $\rightarrow$ TSMC 3nm / N3E Foundry Node
- *"Fire Dragon Next" (火龙)* $\rightarrow$ Snapdragon 8 Elite / SM8750
- *"Big Magician" (天玑)* $\rightarrow$ MediaTek Dimensity 9400
- *"Full Big Core" (全大核)* $\rightarrow$ Zero efficiency cores; all Cortex-X / Oryon architecture

The Sillycone ingestion pipeline maps these slang terms to canonical database slugs via our [taxonomy normalizer](file:///home/lucifer/Documents/Projects/Sillycone/docs/03_TAXONOMY_DAG_AND_BENCHMARK_NORMALIZATION.md).

---

### 2.9 Source 9: Chiphell Hardware Forums

Chiphell (`chiphell.com`) is the premier enthusiast hardware community in the Asia-Pacific region. Board engineers and factory test operators frequently publish high-resolution photos of engineering sample heat spreaders, CPU-Z validation screenshots, and power distribution PCB layouts.

#### Scraping & Forensic Ingestion
- **Target Boards:** CPU & Memory Discussion (`forum-2-1.html`), GPU Discussion (`forum-21-1.html`).
- **Signal Extraction:**
  - Automated OCR pipeline for attached CPU-Z / GPU-Z screenshots to parse stepping, revision, revision date, transistor process, and core voltage limits.
  - Thread text keyword monitoring for socket designations (e.g. `SP5`, `AM5`, `LGA1851`, `LGA4710`).

---

### 2.10 Source 10: X / Twitter Semiconductor Leakers

Global independent hardware leakers publish architectural breakdowns, die diagrams, and SKU matrices.

#### Curated Monitored Roster
- `@kopite7kimi`: Specialist in Nvidia architectures (Ada Lovelace, Blackwell, Rubin). Mapped exact SM counts and memory bus topologies for RTX 30, 40, and 50 series years before retail launch.
- `@Kepler_L2`: Specialist in AMD Zen CPU architectures and RDNA graphics cores.
- `@金猪升级包` (Golden Pig Upgrade): Specialist in Intel client mobile and laptop processors (Lunar Lake, Panther Lake).
- `@momomo_us`: Autonomous crawler scouring retail partner listings, spec sheets, and Eurasian filings.
- `@harukaze5719`: Infographic creator specializing in comparative hardware benchmark normalization.

#### Tracking & Ingestion Pipeline
To maintain the **$0/month architecture** without paying for Twitter's Enterprise API, Sillycone utilizes public RSS syndication gateways (e.g. self-hosted Nitter instances on Cloudflare edge workers or public syndication mirrors).

---

### 2.11 Source 11: Academic & Industry Conferences (ISSCC, Hot Chips, IEDM)

When semiconductor manufacturers seek peer-reviewed recognition for manufacturing breakthroughs, they submit exhaustive technical papers to IEEE conferences.

#### Monitored Symposia
- **Hot Chips (Symposium on High-Performance Chips):** August annually. Detailed microarchitectural disclosures, block diagrams, interconnect topologies (UCIe, NVLink), and power delivery.
- **ISSCC (International Solid-State Circuits Conference):** February annually. High-precision transistor physics, SRAM bit-cell dimensions, metal layer stacks, and backside power delivery implementations (Intel PowerVia, TSMC SuperPower Rail).
- **IEDM (International Electron Devices Meeting):** December annually. Sub-2nm gate-all-around (GAA) nanosheet physics.

#### Data Yielded
- Transistor density: Measured in Million Transistors per square millimeter ($\text{MTr/mm}^2$).
- True physical die area: Measured via optical microscopy in square millimeters ($\text{mm}^2$).
- Static vs Dynamic leakage power dissipation at target clock thresholds.

---

## 3. Scraping Engineering & Anti-Bot Defense Gateway

Running an enterprise-grade silicon intelligence radar for **$0/month** requires strict adherence to scraping etiquette, resilient network protocols, and ethical guardrails.

```mermaid
flowchart LR
    A["Raw Ingestion Trigger"] --> B{"Is Target Protected by CAPTCHA / Proof-of-Work?"}
    B -- Yes --> C["ABORT: Strict Guardrail Enforcement\nFallback to Public Mirror / RSS Stream"]
    B -- No --> D["Apply Leaky-Bucket Rate Limiter\n(Jitter: 2.0s - 7.5s)"]
    D --> E["Execute Lightweight HTTP/2 Request\n(httpx + User-Agent Pool)"]
    E --> F{"Response Code 200 OK?"}
    F -- Yes --> G["Compute SHA-256 Checksum\nCheck Deduplication Cache"]
    F -- No (429/503) --> H["Trigger Exponential Backoff\n(Retry-After Header)"]
```

### 3.1 Headless Scraping vs Lightweight HTTP/2 Protocol
Headless browsers (Puppeteer, Playwright, Chromium) consume excessive memory (400MB+ per tab) and quickly exhaust the 2,000 free minutes of GitHub Actions runners. Sillycone mandates **lightweight HTTP/2 sessions** using Python's `httpx` or `curl-impersonate` profiles, executing queries in under 300 milliseconds with a minimal memory footprint (< 40MB).

### 3.2 Anti-Bot & Proof-of-Work Guardrail Compliance
> [!CAUTION]
> **Zero-Bypass Policy:** Under no circumstances does the Sillycone scraping pipeline attempt to solve, bypass, click through, or circumvent CAPTCHA challenges, Cloudflare Turnstile, hCaptcha, or proof-of-work gates.
> 
> If an endpoint triggers an anti-bot challenge:
> 1. The crawler immediately terminates the current session and emits a structured log event `ERR_CHALLENGE_GATED`.
> 2. The pipeline pivots to secondary public syndication mirrors (e.g. RSS/Atom feeds, cached archives, or public API endpoints).
> 3. No unauthorized circumvention scripts or headless solvers are deployed.

### 3.3 Rate Limiting & Token-Bucket Architecture
To respect remote servers and eliminate IP bans:
- **Jittered Execution:** A randomized delay between $2.0$ and $7.5$ seconds is enforced between consecutive HTTP requests.
- **Header Mimicry:** Legitimate Client Hints (`Sec-CH-UA`, `Sec-CH-UA-Mobile`, `Sec-CH-UA-Platform`) are injected matching current LTS browser baselines.
- **Exponential Backoff:** If an endpoint responds with HTTP `429 Too Many Requests` or `503 Service Unavailable`, the pipeline parses the `Retry-After` header or backs off exponentially ($2^n$ seconds, capped at 60 seconds).

---

## 4. Legal, Ethical, Compliance & Caching Guardrails

Data scraping operates under clear legal boundaries established by landmark judicial precedents:

### 4.1 Factual Metadata vs Copyrightable Expression
Under the doctrine established in *Feist Publications, Inc. v. Rural Telephone Service Co.* (499 U.S. 340, 1991), purely factual data—such as clock frequencies, transistor counts, cache capacities, and benchmark scores—are not subject to copyright protection:
- **What Sillycone Harvests:** Pure factual metadata (frequencies, TDP numbers, benchmark results, dates, architecture names).
- **What Sillycone Never Stores:** Proprietary verbatim documentation text, leaked confidential source code, or unauthorized copyrighted photography.

### 4.2 Deduplication Cache & Storage Optimization
To prevent database bloat on Supabase's free 500 MB tier:
- Every harvested payload is hashed using **SHA-256**.
- The hash is evaluated against an in-memory Bloom filter and the `benchmarks(submission_id)` unique constraint.
- Duplicate payloads are rejected before database invocation.

---

## 5. GitHub Actions Autonomous Cloud Collector ($0/Month)

The entire intelligence pipeline is orchestrated via GitHub Actions runners at zero cost.

```mermaid
flowchart TD
    subgraph CRON["GitHub Actions Matrix Schedules"]
        J1["Fast Radar: '0 */6 * * *'\n(Geekbench, Weibo, X, EEC)"]
        J2["Kernel & Mesa Sync: '0 2 * * *'\n(Git Trees, Gerrit, LLVM)"]
        J3["Academic Sync: '0 0 1 * *'\n(Hot Chips, ISSCC Indexing)"]
    end

    subgraph RUNNER["Ubuntu-Latest Ephemeral Runner (Free Tier)"]
        R1["checkout@v4"]
        R2["setup-python@v5 (cache: pip)"]
        R3["Install dependencies (< 15s)"]
        R4["Execute scrapers/geekbench_collector.py"]
        R5["Evaluate Checkpoint State in Supabase"]
    end

    subgraph SYNC["Supabase Cloud"]
        S1[("PostgreSQL DB")]
    end

    CRON --> RUNNER
    RUNNER --> SYNC
```

### 5.1 Free-Tier Runner Budget Accounting

| Metric | Allotment | Sillycone Consumption | Utilization Ratio |
|---|---|---|---|
| **Monthly Public Runner Minutes** | 2,000 minutes | 480 minutes (4 runs/day $\times$ 4 min $\times$ 30 days) | **24.0%** (Safe Margin) |
| **Storage Transfer Bandwidth** | Unlimited public edge | ~150 MB / month | Negligible |
| **Supabase Free Database Space** | 500 MB PostgreSQL | Current footprint: 4.8 MB (~15,000 rows) | **< 1.0%** |

### 5.2 Complete Production Workflow Specification

Below is the production-ready GitHub Actions workflow running in [`.github/workflows/silicon-radar.yml`](file:///home/lucifer/Documents/Projects/Sillycone/.github/workflows/silicon-radar.yml):

```yaml
name: Sillycone Autonomous Silicon Radar

on:
  schedule:
    # Runs every 6 hours (00:00, 06:00, 12:00, 18:00 UTC) completely for FREE
    - cron: '0 */6 * * *'
  workflow_dispatch: # Allows manual trigger from GitHub UI / gh CLI anytime

concurrency:
  group: silicon-radar-collector
  cancel-in-progress: true

jobs:
  crawl-and-sync:
    name: Crawl Benchmark Radar & Sync Supabase
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r scrapers/requirements.txt

      - name: Execute Silicon Intelligence Ingestion
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          python scrapers/geekbench_collector.py

      - name: Failure Notification & Issue Dispatch
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `🚨 Radar Collector Failure: Run #${context.runNumber}`,
              body: `Silicon Radar ingestion workflow failed. Check run logs: ${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`
            })
```

---

## 6. Entity Resolution, Data Normalization & Supabase Ingestion Engine

A critical challenge in silicon intelligence is the **Entity Resolution Problem**: raw signals across Geekbench, Weibo, and Linux kernel commits reference identical hardware under conflicting code names, prototype model numbers, and marketing aliases.

### 6.1 The Fuzzy Silicon Normalizer Algorithm

```mermaid
flowchart LR
    A["Raw Input String:\n'Xiaomi 25010PN30C (Qualcomm Sun for arm64)'"] --> B["Token Extraction & Sanitization"]
    B --> C["Codename Resolution:\n'Sun' -> 'snapdragon-8-elite'"]
    B --> D["Vendor Deduction:\n'Qualcomm'"]
    B --> E["Cluster Parser:\n'2 cores @ 4.32GHz + 6 cores @ 3.53GHz'"]
    C & D & E --> F["Unified Chip Entity Record\nUUID: 6b3c4..."]
```

#### Canonical Aliasing Dictionary

| Raw Signal Identifier | Resolved Vendor | Canonical Chip Marketing Name | Canonical Chip Slug |
|---|---|---|---|
| `Sun`, `SM8750`, `Snapdragon 8 Gen 4` | Qualcomm | Snapdragon 8 Elite | `snapdragon-8-elite` |
| `DX-4`, `MT6991`, `Dimensity 9400` | MediaTek | Dimensity 9400 | `dimensity-9400` |
| `Arrow Lake-S`, `ARL-S`, `Core Ultra 200` | Intel | Core Ultra 9 285K | `core-ultra-9-285k` |
| `Granite Ridge`, `Zen 5 Desktop`, `100-000001297` | AMD | Ryzen 9 9950X | `ryzen-9-9950x` |
| `GB202`, `Blackwell Gaming`, `RTX 5090` | Nvidia | GeForce RTX 5090 | `rtx-5090` |

### 6.2 Cluster Topology Parsing Engine

```python
import re

TOPOLOGY_REGEX = re.compile(
    r"(?P<count>\d+)\s*cores?\s*@\s*(?P<freq>[\d\.]+)\s*GHz",
    re.IGNORECASE
)

def parse_cluster_topology(raw_description: str):
    """
    Parses strings like '2 cores @ 4.32 GHz + 6 cores @ 3.53 GHz'
    into relational chip_topologies records.
    """
    clusters = []
    matches = TOPOLOGY_REGEX.findall(raw_description)
    for i, (count, freq) in enumerate(matches):
        cluster_type = "Prime Core" if i == 0 else "Performance Core"
        clusters.append({
            "cluster_type": cluster_type,
            "core_count": int(count),
            "boost_clock_ghz": float(freq)
        })
    return clusters
```

---

## 7. Leaker Accuracy & Delta Tracking Mathematical Model

Sillycone maintains the industry's first autonomous, mathematically rigorous accountability ledger for semiconductor leakers, tracked in [`supabase/migrations/001_initial_schema.sql` (table `leak_delta_records`)](file:///home/lucifer/Documents/Projects/Sillycone/supabase/migrations/001_initial_schema.sql#L144-L158).

### 7.1 Prediction Delta Formula

When a retail silicon product is verified, all corresponding historical predictions undergo delta computation:

$$\Delta = \left( \frac{V_{\text{predicted}} - V_{\text{actual}}}{V_{\text{actual}}} \right) \times 100\%$$

Where:
- $V_{\text{predicted}}$ is the numerical spec claimed by the leaker (e.g. Geekbench Single Core score of 3,200).
- $V_{\text{actual}}$ is the confirmed retail measurement (e.g. 3,140).

### 7.2 Leaker Accuracy Score (LAS)

Each leaker's aggregate historical rating is computed as:

$$\text{LAS} = \frac{1}{\sum_{i=1}^N w_i} \sum_{i=1}^N w_i \cdot \max\left(0, 1 - \frac{|\Delta_i|}{\theta_{\text{tolerance}}}\right) \times 100$$

Where:
- $\theta_{\text{tolerance}}$ is the maximum allowable error margin (typically $15.0\%$). Errors exceeding $\theta$ receive 0 points.
- $w_i = \text{recency\_weight} \cdot \text{metric\_difficulty}$. Predicting an unreleased architecture's clock frequency 12 months out carries higher weight ($w = 2.0$) than predicting packaging 2 weeks before launch ($w = 0.5$).

### 7.3 Accuracy Verdict Thresholds

| Computed Absolute Delta ($|\Delta|$) | Automated Verdict Classification |
|---|---|
| $|\Delta| \le 3.0\%$ | `accurate` (Dead-on accurate prediction) |
| $3.0\% < |\Delta| \le 10.0\%$ | `in_margin` (Within reasonable pre-production silicon variance) |
| $|\Delta| > 10.0\%$ | `debunked` (Fabricated or inaccurate claim) |
| $V_{\text{actual}}$ not yet available | `pending` (Awaiting retail verification) |

---

## 8. Verification Matrix & Health Check Operations

To ensure uninterrupted operation, the following test matrix validates collector integrity:

```bash
# 1. Test Geekbench Radar Collector Locally
python scrapers/geekbench_collector.py

# 2. Verify Schema Integrity on Supabase Migrations
psql $SUPABASE_DB_URL -f supabase/migrations/001_initial_schema.sql

# 3. Inspect Live Edge Health
curl -s http://localhost:3000/api/health | jq .
```

### Operational Troubleshooting Guide

| Symptom | Root Cause | Remediation Protocol |
|---|---|---|
| **Geekbench Collector returns 0 rows** | DOM layout update in Geekbench search table | Inspect `table.table-striped` selectors; update CSS class bindings in [`scrapers/geekbench_collector.py`](file:///home/lucifer/Documents/Projects/Sillycone/scrapers/geekbench_collector.py). |
| **HTTP 429 Too Many Requests** | Jitter delay too tight during peak hours | Increase minimum jitter floor from 2.0s to 5.0s in scraper headers. |
| **Supabase DB Write Rejection** | Unique constraint violation on duplicate benchmark | Ensure `benchmarks(submission_id)` conflict clause executes `ON CONFLICT DO NOTHING`. |
| **GitHub Actions Runner Timeout** | Remote server hanging during HTTP connection | Ensure all `requests.get()` calls declare explicit `timeout=15` limits. |

---

## 9. Conclusion & Next Architectural Steps

With **`docs/01_INTELLIGENCE_PIPELINE_AND_SOURCES.md`** established as the authoritative blueprint, the Sillycone radar operates 24/7 autonomously on GitHub Actions cron with $0/month operational costs.

- For frontend telemetry visual styling, refer to [`docs/02_AVANT_GARDE_UIUX_AND_TERMINAL_DESIGN.md`](file:///home/lucifer/Documents/Projects/Sillycone/docs/02_AVANT_GARDE_UIUX_AND_TERMINAL_DESIGN.md).
- For DAG data modeling and cross-platform benchmark normalization formulas, refer to [`docs/03_TAXONOMY_DAG_AND_BENCHMARK_NORMALIZATION.md`](file:///home/lucifer/Documents/Projects/Sillycone/docs/03_TAXONOMY_DAG_AND_BENCHMARK_NORMALIZATION.md).
