# Geberit Article to Source Type Mapping

This file contains the mapping of Geberit article numbers to their source types (sanitary fixture categories), extracted from the C# AutoCAD plugin.

## Article Number to Source Type Dictionary

### Wash Basin Articles
| Article Number | Source Type |
|----------------|-------------|
| 152.682.00.1 | Wash Basin |
| 152.796.00.1 | Wash Basin |
| 152.742.11.1 | Wash Basin |
| 361.000.16.0 | Wash Basin |
| 361.045.16.1 | Wash Basin |
| 361.088.16.1 | Wash Basin |
| 361.112.16.1 | Wash Basin |
| 361.162.16.1 | Wash Basin |
| 367.560.16.1 | Wash Basin |
| 361.771.16.1 | Wash Basin |

### Urinal Articles
| Article Number | Source Type |
|----------------|-------------|
| 152.689.00.1 | Urinal |
| 363.000.16.0 | Urinal |
| 363.045.16.1 | Urinal |
| 363.088.16.1 | Urinal |
| 363.115.16.1 | Urinal |
| 363.165.16.1 | Urinal |
| 363.771.16.1 | Urinal |

### Shower Articles
| Article Number | Source Type |
|----------------|-------------|
| 388.008.00.1 | Shower |
| 367.000.16.0 | Shower |
| 365.000.16.0 | Shower |
| 365.045.16.1 | Shower |
| 365.088.16.1 | Shower |
| 365.115.16.1 | Shower |
| 365.125.16.1 | Shower |
| 365.771.16.1 | Shower |

### Bath Tub Articles
| Article Number | Source Type |
|----------------|-------------|
| 152.693.00.1 | Bath Tub |
| 364.000.16.0 | Bath Tub |
| 364.730.16.1 | Bath Tub |
| 364.779.16.3 | Bath Tub |
| 364.045.16.1 | Bath Tub |
| 365.571.16.1 | Bath Tub |
| 365.120.16.1 | Bath Tub |
| 364.771.16.1 | Bath Tub |

### Water Closet Articles
| Article Number | Source Type |
|----------------|-------------|
| 367.045.16.1 | Water Closet |
| 367.088.16.1 | Water Closet |
| 367.576.16.1 | Water Closet |
| 367.115.16.1 | Water Closet |
| 367.120.16.1 | Water Closet |
| 367.125.16.1 | Water Closet |
| 367.135.16.1 | Water Closet |
| 367.941.16.1 | Water Closet |
| 240.942.00.1 | Water Closet |
| 367.928.16.1 | Water Closet |
| 152.425.46.1 | Water Closet |
| 367.771.16.1 | Water Closet |

### Vertical Shaft Articles
| Article Number | Source Type |
|----------------|-------------|
| 367.614.16.2 | Vertical Shaft |
| 367.162.16.1 | Vertical Shaft |
| 367.175.16.1 | Vertical Shaft |
| 367.163.16.1 | Vertical Shaft |
| 310.102.14.1 | Vertical Shaft |
| 310.083.14.1 | Vertical Shaft |
| 367.700.16.1 | Vertical Shaft |
| 367.750.16.1 | Vertical Shaft |
| 365.750.16.1 | Vertical Shaft |

### Vent Articles
| Article Number | Source Type |
|----------------|-------------|
| 364.088.16.1 | Vent |
| 364.165.16.1 | Vent |
| 364.120.16.1 | Vent |
| 365.175.16.1 | Vent |
| 367.170.16.1 | Vent |

## Source Type Categories
The system recognizes these main source types:
- **Wash Basin**: Bathroom sink drainage components
- **Urinal**: Urinal drainage components  
- **Shower**: Shower and floor drain components
- **Bath Tub**: Bathtub drainage components
- **Water Closet**: Toilet drainage components
- **Vertical Shaft**: Main drainage shaft components
- **Vent**: Ventilation system components

## Notes
- This mapping is extracted from the C# `SanitaryObjectsCollections.GetSanitaryTypeByArticleNumber()` method
- Some articles may be shared between categories but have primary source type assignments
- The source type determines processing logic and material quantity calculations
- Total of 57 unique article numbers mapped to source types