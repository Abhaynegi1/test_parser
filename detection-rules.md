# Geberit DXF Processing Rules - Sequential Processing Guide

This document outlines the exact sequence for processing Geberit elements from DXF files, reverse-engineered from the C# AutoCAD plugin.

## Processing Sequence Overview

```
1. INITIALIZATION & SETUP
2. LAYER FILTERING 
3. ENTITY DETECTION & CLASSIFICATION
4. PRIMARY PROCESSING (Circles → Blocks → Pipes)
5. GEOMETRIC ANALYSIS (Bends & Intersections)
6. DEPENDENCY PROCESSING 
7. MANDATORY ADDITIONS
8. FINAL CALCULATIONS
```

---

## PHASE 1: INITIALIZATION & SETUP

### Step 1.1: User Input Collection
**Required before processing:**
- **Shaft Number**: User enters shaft identifier (1, 2, etc.) 
- **Pipe Type**: "Sunken" or "Under Slung"
- **Configuration Values**:
  - **Sunken**: WC depth, Washbasin depth, MT depth, Collector depth
  - **Under Slung**: Slab thickness, Bottom of sleeve measurements
- **Floor Height**: For vertical shaft calculations

### Step 1.2: Layer Filtering
**Filter Criterion**: 
- Process ONLY objects on layers starting with "**GEB***"
- All other layers are ignored completely

---

## PHASE 2: ENTITY DETECTION & CLASSIFICATION

### Step 2.1: Entity Type Detection
Loop through all filtered objects and classify by type:
- **Circles**: Drain locations and special fittings
- **Polylines**: Pipe routes with diameter information  
- **Block References**: Predefined Geberit components

### Step 2.2: Diameter-Based Classification
**Polylines** classified by `ConstantWidth` property:
- **50mm**: Wash Basin drainage
- **56mm**: Urinal drainage  
- **63mm**: Bath Tub drainage
- **75mm**: Shower/Floor drain drainage
- **110mm**: Water Closet and main drainage

---

## PHASE 3: PRIMARY PROCESSING (Process in this order)

### Step 3.1: Circle Processing (FIRST)
**Process circles by diameter - immediate article generation:**

#### 50mm Circles → Wash Basin Sleeve
- **Add**: 152.682.00.1 (sleeve EPDM for d50 50IRHD)
- **Quantity**: 1 per circle

#### 52mm Circles → Wash Basin Bends  
- **Add**: 361.045.16.1 (bend PE-HD 45G d50 L4.5)
- **Quantity**: 2 per circle

#### 75mm Circles → Shower Collector
- **Add**: 388.008.00.1 (Geberit collector drain)
- **Quantity**: 1 per circle

#### 77mm Circles → Shower Bends
- **Add**: 365.045.16.1 (bend PE-HD 45G d75 L5) 
- **Quantity**: 2 per circle

#### 110mm Circles → Water Closet Package (3 articles)
- **Add**: 246.188.00.1 (connection bend for WC, with protection cap)
- **Add**: 367.928.16.1 (adapter socket PE-HD d90/110)
- **Add**: 240.942.00.1 (outlet bend 90 degree Kombifix Italy)
- **Quantity**: 1 each per circle

#### 112mm Circles → Water Closet Bends
- **Add**: 367.045.16.1 (bend PE-HD 45G d110 L6)
- **Quantity**: 2 per circle

### Step 3.2: Block Reference Processing (SECOND)
**Process blocks by naming convention:**

#### Standard Blocks (`ArticleNumber_G` or `ArticleNumber_A`)
1. Extract first 12 characters as article number
2. Look up source type in article-sources.md
3. Add article with quantity = 1

#### Special Block Mappings
- **367.611.16.1_G** → **367.614.16.2**
- **A$C79FE6463** → **367.471.16.1** 
- **2 WAY SWEPT** → **310.102.14.1**

### Step 3.3: Pipe Processing (THIRD)
**Process polylines by diameter group:**

#### For Each Diameter Group (50mm, 75mm, 110mm):
1. **Calculate Total Length**: Sum all polyline lengths ÷ 1000 (to meters)
2. **Add Pipe Article**: Based on diameter
   - **50mm**: 361.000.16.0 (pipe PE-HD d50x3 L5000)
   - **75mm**: 365.000.16.0 (pipe PE-HD d75x3 L500)
   - **110mm**: 367.000.16.0 (pipe PE-HD d110x4.3 L500)

3. **Calculate Drop Length**: Based on configuration
   - **Sunken**: Use depth values from user input
   - **Under Slung**: Use slab + sleeve calculations

---

## PHASE 4: GEOMETRIC ANALYSIS

### Step 4.1: Bend Detection (Per Diameter)
**For each polyline, detect 45° bends:**

#### Algorithm:
```
For each polyline:
1. Get vertices
2. Calculate vectors between consecutive vertices  
3. Compute angles using GetAngleTo()
4. Count angles ≈ 45° or ≈ 135° (±1° tolerance)
5. Add bend articles based on count
```

#### Bend Articles by Diameter:
- **50mm**: 361.045.16.1 (bend PE-HD 45G d50 L4.5)
- **75mm**: 365.045.16.1 (bend PE-HD 45G d75 L5)  
- **110mm**: 367.045.16.1 (bend PE-HD 45G d110 L6)

### Step 4.2: Branch Fitting Detection
**Detect pipe intersections for branch fittings:**

#### Y-Branch (50mm only)
- **Condition**: 2+ polylines (50mm) intersecting with 45° angles
- **Add**: 361.112.16.1 (Geberit HDPE Y-branch fitting 45°, dia.50/50)

#### Multi-Diameter Branches  
**For 75mm main pipes:**
- **56mm connections** → 365.115.16.1
- **75mm connections** → 365.125.16.1

**For 110mm main pipes:**
- **56mm connections** → 367.115.16.1
- **63mm connections** → 367.120.16.1  
- **75mm connections** → 367.125.16.1
- **110mm connections** → 367.135.16.1

#### Reducer Detection
- **110mm to 75mm same-angle** → 367.576.16.1

---

## PHASE 5: DEPENDENCY PROCESSING

### Step 5.1: Block-Triggered Dependencies
**Process in this order:**

#### Wash Basin Dependencies
1. **IF** 152.742.11.1 exists → **ADD** 152.796.00.1
2. **IF** 152.682.00.1 OR 152.796.00.1 exist → **ADD** 361.802.92.1 (qty = sum)

#### Special Reducer Block Rules (367.560.16.1)
1. **Search** 100-unit radius around block position
2. **IF** 2+ polylines (50mm) found → **ADD** 361.162.16.1
3. **IF** block suffix "_GA" → **ADD** 361.088.16.1

#### Sleeve Multiplier Rule
- **For every** 152.682.00.1 → **ADD** 361.088.16.1 (qty = sleeve_qty × 2)

---

## PHASE 6: MANDATORY ADDITIONS

### Step 6.1: Per-Shaft Mandatory Items
**Always add these for every shaft:**
- **367.700.16.1**: Expansion socket (qty = 1)
- **367.000.16.0**: Vertical shaft pipe (length = floor_height in meters)

### Step 6.2: Conditional Mandatory Items

#### Water Closet Mandatory (IF 367.941.16.1 OR 246.188.00.1 exist)
- **ADD**: 152.425.46.1 (qty = sum of WC components)
- **ADD**: 367.088.16.1 (qty = same as above)

#### Shower Mandatory (IF 367.560.16.1 OR 388.008.00.1 exist)  
- **ADD**: 367.802.92.1 (qty = sum of components)

---

## PHASE 7: FINAL CALCULATIONS

### Step 7.1: Quantity Consolidation
- **Merge** duplicate articles by summing quantities
- **Validate** all articles against article-descriptions.md
- **Assign** final source types using article-sources.md

### Step 7.2: Export Preparation
- **Format** for Excel export
- **Group** by source type (Wash Basin, Shower, Water Closet, etc.)
- **Calculate** totals per shaft and overall

---

## Processing Parameters & Tolerances

### Geometric Tolerances
- **Bend Angle**: ±1° tolerance for 45° detection
- **Point Touch**: 0.5 units for polyline intersection
- **Search Radius**: 100 units for block-adjacent pipes

### Unit Conversions
- **Length**: Drawing units ÷ 1000 = meters
- **Quantities**: Always whole numbers (pieces or meters)

---

## Reference Files
- **article-descriptions.md**: Complete article number to description mapping
- **article-sources.md**: Article number to source type mapping  
- **block-mappings.md**: Special block name processing rules
- **diameter-mappings.md**: Circle diameter to article mappings
- **component-collections.md**: Predefined component lists by type

## Critical Processing Notes
1. **Order Matters**: Circles BEFORE blocks BEFORE pipes BEFORE dependencies
2. **Layer Filtering**: Absolutely critical - wrong layers = no processing
3. **Shaft Numbers**: Must be validated and formatted (SH-01, SH-02, etc.)
4. **Duplicate Handling**: Always consolidate by article number before final output
5. **Error Handling**: Invalid articles should be flagged but not block processing