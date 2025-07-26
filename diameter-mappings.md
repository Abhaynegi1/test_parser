# Geberit Circle Diameter to Article Mappings

This file contains the mappings of circle diameters to specific Geberit articles, extracted from the C# AutoCAD plugin.

## Circle Diameter Processing Rules

### 50mm Diameter Circles
- **Article**: 152.682.00.1
- **Description**: sleeve EPDM for d50 50IRHD
- **Quantity**: 1 per circle
- **Source Type**: Wash Basin
- **Processing Logic**: Direct mapping from circle detection

### 52mm Diameter Circles
- **Article**: 361.045.16.1
- **Description**: bend PE-HD 45G d50 L4.5
- **Quantity**: 2 per circle
- **Source Type**: Wash Basin
- **Processing Logic**: Each 52mm circle triggers 2 bend fittings

### 75mm Diameter Circles
- **Article**: 388.008.00.1
- **Description**: Geberit collector drain
- **Quantity**: 1 per circle
- **Source Type**: Shower
- **Processing Logic**: Floor drain detection for showers

### 77mm Diameter Circles
- **Article**: 365.045.16.1
- **Description**: bend PE-HD 45G d75 L5
- **Quantity**: 2 per circle
- **Source Type**: Shower
- **Processing Logic**: Each 77mm circle triggers 2 bend fittings for shower drainage

### 110mm Diameter Circles
**Multiple articles generated per circle:**

#### Primary Connection
- **Article**: 246.188.00.1
- **Description**: connection bend for WC, with protection cap: H=22.5cm
- **Quantity**: 1 per circle
- **Source Type**: Water Closet

#### Adapter Socket
- **Article**: 367.928.16.1
- **Description**: adapter socket PE-HD d90/110
- **Quantity**: 1 per circle
- **Source Type**: Water Closet

#### Outlet Bend
- **Article**: 240.942.00.1
- **Description**: outlet bend 90 degree Kombifix Italy
- **Quantity**: 1 per circle
- **Source Type**: Water Closet

### 112mm Diameter Circles
- **Article**: 367.045.16.1
- **Description**: bend PE-HD 45G d110 L6
- **Quantity**: 2 per circle
- **Source Type**: Water Closet
- **Processing Logic**: Each 112mm circle triggers 2 bend fittings for WC drainage

## Pipe Diameter Classifications

### Polyline Diameter Mappings
| Diameter (mm) | Source Type | Primary Use |
|---------------|-------------|-------------|
| 50 | Wash Basin | Basin drainage connections |
| 56 | Urinal | Urinal drainage connections |
| 63 | Bath Tub | Bathtub drainage connections |
| 75 | Shower | Shower and floor drain connections |
| 110 | Water Closet | Toilet and main drainage connections |

## Processing Logic

### Circle Detection Algorithm
```
1. Identify circle entity in DXF
2. Calculate diameter using circle.Diameter property
3. Match diameter against mapping table
4. Generate corresponding article(s) with specified quantities
5. Assign source type for material categorization
6. Apply any additional processing rules
```

### Diameter Tolerance
- **Exact Match Required**: The system uses exact diameter matching
- **No Tolerance**: Unlike angle detection, diameter matching has no tolerance range
- **Precision**: Uses floating-point comparison with AutoCAD precision

## Special Processing Notes

### 110mm Circles - Multiple Articles
110mm circles are unique in generating multiple articles simultaneously:
- All three articles are required for proper WC installation
- Quantities are always 1 each per circle
- All articles share the same source type (Water Closet)

### Bend Quantities
Circles that generate bends (52mm, 77mm, 112mm) always create exactly 2 bend fittings:
- This reflects standard plumbing practice for proper drainage flow
- Quantity is fixed regardless of other factors

### Layer Requirement
- All circles must be on layers starting with "GEB*"
- Circles on other layers are ignored during processing

## Integration with Other Systems

### Pipe Length Calculations
Circle diameters are used to:
- Validate pipe diameter consistency
- Calculate drop lengths for sunken/underslung configurations
- Determine branch fitting requirements

### Branch Fitting Detection
Circle positions are used as reference points for:
- Spatial analysis of connecting pipes
- Branch fitting requirement calculations
- Intersection detection algorithms