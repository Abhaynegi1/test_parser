# Geberit Article Descriptions Mapping

This file contains the complete mapping of Geberit article numbers to their descriptions, extracted from the C# AutoCAD plugin.

## Article Number to Description Dictionary

### Wash Basin Components
| Article Number | Description |
|----------------|-------------|
| 152.682.00.1 | sleeve EPDM for d50 50IRHD |
| 152.796.00.1 | sleeve EPDM for d50 60IRHD |
| 152.742.11.1 | drain assembly for cast iron 1 1/2''x40 |
| 361.802.92.1 | protective cap for pipe end PE-HD d50 |
| 361.000.16.0 | pipe PE-HD d50x3 L5000 |
| 361.045.16.1 | bend PE-HD 45G d50 L4.5 |
| 361.088.16.1 | bend PE-HD 88.5G d50 L6 |
| 361.112.16.1 | Geberit HDPE Y-branch fitting 45°, dia.50/50 |
| 361.162.16.1 | branch fitting PE-HD 88.5G d50/50 |
| 367.560.16.1 | reducer PE-HD d110/50 concentric |
| 361.771.16.1 | electrofusion sleeve coupling PE-HD d50 |

### Urinal Components
| Article Number | Description |
|----------------|-------------|
| 152.689.00.1 | sleeve EPDM for d56 50IRHD |
| 363.000.16.0 | pipe PE-HD d56x3 L500 |
| 363.045.16.1 | bend PE-HD 45G d56 L4.5 |
| 363.088.16.1 | bend PE-HD 88.5G d56 L6.5 |
| 363.115.16.1 | branch fitting PE-HD 45G d56/56 |
| 363.165.16.1 | branch fitting PE-HD 88.5G d56/56 |
| 363.771.16.1 | electrofusion sleeve coupling PE-HD d56 |

### Shower/Floor Drain Components
| Article Number | Description |
|----------------|-------------|
| 388.008.00.1 | Geberit collector drain |
| 367.802.92.1 | protective cap for pipe end PE-HD d110 |
| 367.000.16.0 | pipe PE-HD d110x4.3 L500 |
| 365.000.16.0 | pipe PE-HD d75x3 L500 |
| 365.045.16.1 | bend PE-HD 45G d75 L5 |
| 365.088.16.1 | bend PE-HD 88.5G d75 L7.5 |
| 365.115.16.1 | branch fitting PE-HD 45G d75/56 |
| 365.125.16.1 | branch fitting PE-HD 45G d75/75 |
| 365.771.16.1 | electrofusion sleeve coupling PE-HD d75 |

### Bath Tub Components
| Article Number | Description |
|----------------|-------------|
| 152.693.00.1 | sleeve EPDM for d63 50IRHD |
| 364.000.16.0 | pipe PE-HD d63x3 L500 |
| 364.730.16.1 | tubular trap PE-HD d63 |
| 364.779.16.3 | Geberit HDPE ring seal socket with lip seal: d=63mm |
| 364.045.16.1 | bend PE-HD 45G d63 L5 |
| 365.571.16.1 | reducer PE-HD d75/63 L8 eccentric |
| 365.120.16.1 | branch fitting PE-HD 45G d75/63 |
| 364.771.16.1 | electrofusion sleeve coupling PE-HD d63 |

### Water Closet Components
| Article Number | Description |
|----------------|-------------|
| 367.045.16.1 | bend PE-HD 45G d110 L6 |
| 367.088.16.1 | bend PE-HD 88.5G d110 L9.5 |
| 367.576.16.1 | reducer PE-HD d110/75 L8 eccentric |
| 367.115.16.1 | branch fitting PE-HD 45G d110/56 |
| 367.120.16.1 | branch fitting PE-HD 45G d110/63 |
| 367.125.16.1 | Geberit HDPE Y-branch fitting 45°, dia.110/75 |
| 367.135.16.1 | branch fitting PE-HD 45G d110/110 |
| 367.941.16.1 | ction ring seal sokt PE-HD d110/90 L4 |
| 240.942.00.1 | outlet bend 90 degree Kombifix Italy |
| 367.928.16.1 | adapter socket PE-HD d90/110 |
| 152.425.46.1 | Geberit straight connector with sleeve and cover caps: d=90mm, matt chrome-plated |
| 367.771.16.1 | electrofusion sleeve coupling PE-HD d110 |

### Vertical Shaft Components
| Article Number | Description |
|----------------|-------------|
| 367.614.16.2 | Sovent PE-HD d110/110/75 12L/s |
| 367.162.16.1 | branch fitting PE-HD 88.5G d110/50 |
| 367.175.16.1 | branch fitting PE-HD 88.5G d110/75 |
| 367.163.16.1 | brnFtg swept entry PE-HD 88.5G d110/110 |
| 310.102.14.1 | Geberit Silent-db20 double branch fitting 88.5°, swept-entry: d=110mm, d1=110mm |
| 310.083.14.1 | Geberit Silent-db20 corner branch fitting 88.5°, swept-entry: d=110mm, d1=110mm |
| 367.700.16.1 | expn-sokt w/double flange PE-HD d110 |
| 367.750.16.1 | thrdCtor w/screw cap PE-HD d110 H7.8 |
| 367.471.16.1 | thrdCtor w/screw cap PE-HD d110 H4 |
| 365.750.16.1 | thrdCtor w/screw cap PE-HD d75 H9.6 |

### Vent Components
| Article Number | Description |
|----------------|-------------|
| 364.088.16.1 | bend PE-HD 88.5G d63 L7 |
| 364.165.16.1 | branch fitting PE-HD 88.5G d63/56 |
| 364.120.16.1 | branch fitting PE-HD 45G d63/63 |
| 365.175.16.1 | branch fitting PE-HD 88.5G d75/75 |
| 367.170.16.1 | branch fitting PE-HD 88.5G d110/63 |

## Notes
- This mapping is extracted from the C# `SanitaryObjectsCollections.GetDescriptionByArticleNumber()` method
- Total of 63 unique article numbers with descriptions
- Some articles appear in multiple categories (e.g., 367.000.16.0 appears in both Shower and Water Closet)
- Descriptions include technical specifications like diameter, length, and angle measurements