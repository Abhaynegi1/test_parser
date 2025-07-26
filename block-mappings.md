# Geberit Block Name Mappings

This file contains the special block name mappings used in the AutoCAD DXF processing, extracted from the C# plugin.

## Standard Block Naming Convention

### Normal Pattern
- **Format**: `[Article Number]_G` or `[Article Number]_A`
- **Processing**: Extract first 12 characters as article number
- **Example**: `367.560.16.1_G` → Article: `367.560.16.1`

### Block Suffix Meanings
- **_G**: Standard Geberit component block
- **_A**: Alternative/Additional Geberit component block  
- **_GA**: Special variant requiring additional processing (see Special Rules below)

## Special Block Name Mappings

### Legacy/Non-Standard Block Names
| Block Name | Maps To Article | Description |
|------------|-----------------|-------------|
| 367.611.16.1_G | 367.614.16.2 | Sovent PE-HD d110/110/75 12L/s |
| A$C79FE6463 | 367.471.16.1 | thrdCtor w/screw cap PE-HD d110 H4 |
| 2 WAY SWEPT | 310.102.14.1 | Geberit Silent-db20 double branch fitting 88.5°, swept-entry: d=110mm, d1=110mm |

## Special Processing Rules

### Block Suffix "_GA" Rule
When a block has suffix `_GA` (e.g., `367.560.16.1_GA`):
1. Process normally as reducer block
2. **Additional Action**: Add one extra `361.088.16.1` (bend PE-HD 88.5G d50 L6)
3. **Condition**: Applied specifically to reducer blocks with this suffix

### Reducer Block Special Rule (367.560.16.1)
When processing any `367.560.16.1` block (reducer):
1. **Search Area**: 100-unit radius around block position
2. **Search For**: Polylines with 50mm diameter 
3. **Condition**: If 2+ polylines found
4. **Action**: Add `361.162.16.1` (branch fitting PE-HD 88.5G d50/50)

## Block Detection Criteria

### Layer Requirement
- Blocks must be on layers starting with "GEB*"

### Block Name Validation
The system processes blocks that match:
1. **Standard Format**: Contains "_G" or "_A" suffix
2. **Special Names**: Listed in special mappings table above
3. **Legacy Format**: Non-standard names requiring manual mapping

## Block Processing Logic

### Standard Block Processing
```
1. Check if block name contains "_G" or "_A"
2. Extract first 12 characters as article number
3. Look up source type using SanitaryObjectsCollections
4. Create material entry with quantity = 1
5. Apply any special rules based on article number
```

### Special Block Processing
```
1. Check against special mappings table
2. Use mapped article number instead of extracted number
3. Determine source type (may require manual assignment)
4. Create material entry with quantity = 1
```

## Notes
- Block names are case-sensitive in AutoCAD
- The 12-character limit for article extraction is hardcoded
- Some blocks may trigger additional material calculations (see detection-rules.md)
- Block position coordinates are used for spatial analysis in special rules
- The system maintains backward compatibility with legacy block naming conventions