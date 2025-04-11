"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SocialLinks from '@/components/SocialLinks'

interface ConversionData {
  [key: string]: {
    [key: string]: number | { [key: string]: number };
  };
}

// Define proper types for our yeast conversion chart
interface UnitConversion {
  [toUnit: string]: number;
}

interface FromUnitConversion {
  [fromUnit: string]: UnitConversion;
}

interface ToTypeConversion {
  [toType: string]: FromUnitConversion;
}

interface YeastConversionChart {
  [fromType: string]: ToTypeConversion;
}

// Hardcoded yeast conversion chart with proper typing
const YEAST_CONVERSION_CHART: YeastConversionChart = {
  'active dry yeast': {
    'instant yeast': {
      'cup': {
        'cup': 2 / 3,
        'tablespoon-s': 10 + 2 / 3,
        'teaspoon-s': 32,
        'grams': 100
      },
      'tablespoon-s': {
        'cup': 0.04,
        'tablespoon-s': 2 / 3,
        'teaspoon-s': 2,
        'grams': 6.3
      },
      'teaspoon-s': {
        'cup': 0.01,
        'tablespoon-s': 0.25,
        'teaspoon-s': 2 / 3,
        'grams': 2.1
      },
      'grams': {
        'grams': 1
      }
    },
    'compressed fresh baker\'s yeast': {
      'cup': {
        'cup': 2,
        'tablespoon-s': 32,
        'teaspoon-s': 96,
        'grams': 272
      },
      'tablespoon-s': {
        'cup': 0.125,
        'tablespoon-s': 2,
        'teaspoon-s': 6,
        'grams': 17
      },
      'teaspoon-s': {
        'cup': 0.04,
        'tablespoon-s': 2 / 3,
        'teaspoon-s': 2,
        'grams': 5.7
      }
    }
  },
  'instant yeast': {
    'active dry yeast': {
      'cup': {
        'cup': 1.5,
        'tablespoon-s': 24,
        'teaspoon-s': 72,
        'grams': 204
      },
      'tablespoon-s': {
        'cup': 0.1,
        'tablespoon-s': 1.5,
        'teaspoon-s': 4.5,
        'grams': 13
      },
      'teaspoon-s': {
        'cup': 0.03,
        'tablespoon-s': 0.5,
        'teaspoon-s': 1.5,
        'grams': 4.25
      }
    },
    'compressed fresh baker\'s yeast': {
      'cup': {
        'cup': 3,
        'tablespoon-s': 48,
        'teaspoon-s': 144,
        'grams': 408
      },
      'tablespoon-s': {
        'cup': 0.2,
        'tablespoon-s': 3,
        'teaspoon-s': 9,
        'grams': 25.5
      },
      'teaspoon-s': {
        'cup': 0.06,
        'tablespoon-s': 1,
        'teaspoon-s': 3,
        'grams': 8.5
      }
    }
  },
  'compressed fresh baker\'s yeast': {
    'active dry yeast': {
      'cup': {
        'cup': 0.5,
        'tablespoon-s': 8,
        'teaspoon-s': 24,
        'grams': 68
      },
      'tablespoon-s': {
        'cup': 0.03,
        'tablespoon-s': 0.5,
        'teaspoon-s': 1.5,
        'grams': 4.3
      },
      'teaspoon-s': {
        'cup': 0.01,
        'tablespoon-s': 0.2,
        'teaspoon-s': 0.5,
        'grams': 1.4
      }
    },
    'instant yeast': {
      'cup': {
        'cup': 0.33,
        'tablespoon-s': 5.33,
        'teaspoon-s': 16,
        'grams': 50.4
      },
      'tablespoon-s': {
        'cup': 0.02,
        'tablespoon-s': 0.33,
        'teaspoon-s': 1,
        'grams': 3.2
      },
      'teaspoon-s': {
        'cup': 0.007,
        'tablespoon-s': 0.11,
        'teaspoon-s': 0.33,
        'grams': 1.1
      }
    }
  }
};


// Comprehensive Conversion Data for Multiple Products
const CONVERSION_DATA: ConversionData = {
  butter: {
    block: 1,
    sticks: 4,
    cups: 2,
    tbsp: 32,
    grams: 454,
    oz: 16,
    lbs: 1,
    ml: 500
  },
  margarine: {
    block: 1,
    sticks: 4,
    cups: 2,
    tbsp: 32,
    grams: 454,
    oz: 16,
    lbs: 1,
    ml: 500
  },
  'active dry yeast': {
    cup: 1,
    'tablespoon-s': 10 + 2/3,
    'teaspoon-s': 32,
    grams: 100,
    'instant yeast': 2/3,
    'compressed fresh baker\'s yeast': 2
  },
  'instant yeast': {
    cup: 1,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 150,
    'active dry yeast': 1.5
  },
  'compressed fresh baker\'s yeast': {
    cup: 1,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 272,
    'active dry yeast': 0.5,
    'instant yeast': 0.33
  },
  // Added flour conversions
  'all-purpose flour': {
    cup: 1,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 125,
    oz: 4.4,
    lbs: 0.27,
    kg: 0.125
  },
  'bread flour': {
    cup: 1,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 127,
    oz: 4.5,
    lbs: 0.28,
    kg: 0.127
  },
  'whole wheat flour': {
    cup: 1,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 120,
    oz: 4.2,
    lbs: 0.26,
    kg: 0.12
  },
  'rye flour': {
    cup: 1,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 102,
    oz: 3.6,
    lbs: 0.22,
    kg: 0.102
  },
  // Added sugar conversions
  'granulated sugar': {
    cup: 1,
    'tablespoon-s': 14,
    'teaspoon-s': 48,
    grams: 200,
    oz: 7.1,
    lbs: 0.4,
    kg: 0.2
  },
  'powdered sugar': {
    cup: 1,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 125,
    oz: 4.4,
    lbs: 0.27,
    kg: 0.125
  },
  'raw sugar': {
    cup: 1,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 250,
    oz: 8.8,
    lbs: 0.55,
    kg: 0.25
  },
  'caster sugar': {
    cup: 1,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 225,
    oz: 7.9,
    lbs: 0.5,
    kg: 0.225
  },
  'brown sugar': {
    cup: 1,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 200,
    oz: 7.05,
    lbs: 0.44,
    kg: 0.2
  },
  // Added honey conversions
  'honey': {
    cup: 1,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 340,
    oz: 12,
    lbs: 0.75,
    kg: 0.34,
    ml: 340
  }
};

// Common fraction representations for user-friendly display
const FRACTIONS: { [key: string]: { decimal: number, display: string } } = {
  "0.25": { decimal: 0.25, display: "1/4" },
  "0.33": { decimal: 0.333, display: "1/3" },
  "0.5": { decimal: 0.5, display: "1/2" },
  "0.67": { decimal: 0.667, display: "2/3" },
  "0.75": { decimal: 0.75, display: "3/4" },
  "0.125": { decimal: 0.125, display: "1/8" },
  "0.375": { decimal: 0.375, display: "3/8" },
  "0.625": { decimal: 0.625, display: "5/8" },
  "0.875": { decimal: 0.875, display: "7/8" }
};

// Replace the existing parseFraction function with this improved version
const parseFraction = (input: string | number): number | null => {
  // Handle empty input
  if (input === "" || input === null || input === undefined) return null;
  
  // If input is already a number, just return it
  if (typeof input === 'number') return input;
  
  // Clean input (trim but preserve internal spaces)
  const cleanInput = String(input).trim();
  
  // Check if it's a simple number
  if (!isNaN(Number(cleanInput))) {
    return Number(cleanInput);
  }
  
  // Handle mixed numbers like "1 1/2"
  if (cleanInput.includes(' ')) {
    const parts = cleanInput.split(' ');
    if (parts.length === 2) {
      const whole = Number(parts[0]);
      // Handle fraction part
      if (parts[1].includes('/')) {
        const [num, denom] = parts[1].split('/').map(Number);
        if (!isNaN(whole) && !isNaN(num) && !isNaN(denom) && denom !== 0) {
          return whole + (num / denom);
        }
      }
    }
    return null;
  }
  
  // Handle simple fractions like "1/3"
  if (cleanInput.includes('/')) {
    const [num, denom] = cleanInput.split('/').map(Number);
    if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
      return num / denom;
    }
  }
  
  return null;
};

// Helper function to convert any unit to cups within the same yeast type
const convertToCups = (value: number, unit: string, yeastType: string): number | null => {
  if (unit === 'cup') return value;
  
  const yeastData = CONVERSION_DATA[yeastType];
  const unitValue = yeastData[unit];
  
  if (typeof unitValue !== 'number' || unitValue <= 0) return null;
  
  return value / unitValue;
};

// Utility function to format number as a nice fraction where appropriate
const formatResult = (value: number, toUnit: string): string => {
  // Units that should always show decimal values rather than fractions
  const decimalUnits = ['grams', 'oz', 'lbs', 'kg', 'ml'];
  
  // For weight-based measurements, use decimal representation
  if (decimalUnits.includes(toUnit)) {
    return value.toFixed(1); // Show one decimal place for precision
  }
  
  // For volume measurements, continue using fractions where appropriate
  const wholeNumber = Math.floor(value);
  const decimal = value - wholeNumber;
  
  // Check if we can display a nice fraction
  const roundedDecimal = Math.round(decimal * 1000) / 1000;
  const closestFraction = Object.entries(FRACTIONS).find(([, frac]) => 
    Math.abs(frac.decimal - roundedDecimal) < 0.01
  );
  
  if (closestFraction && wholeNumber > 0) {
    return `${wholeNumber} ${closestFraction[1].display}`;
  } else if (closestFraction && wholeNumber === 0) {
    return closestFraction[1].display;
  } else if (decimal === 0) {
    return wholeNumber.toString();
  }
  
  // Default to decimal representation
  return value.toFixed(2);
};

const MultiIngredientConverter: React.FC = () => {
  // List of products with conversion data
  const productList = useMemo(() => Object.keys(CONVERSION_DATA), []);
  
  // Categorize products for better organization
  const productCategories = useMemo(() => ({
    'Fats': ['butter', 'margarine'],
    'Yeast': ['active dry yeast', 'instant yeast', 'compressed fresh baker\'s yeast'],
    'Flour': ['all-purpose flour', 'bread flour', 'whole wheat flour', 'rye flour'],
    'Sugar': ['granulated sugar', 'powdered sugar', 'raw sugar', 'caster sugar', 'brown sugar'],
    'Sweeteners': ['honey']
  }), []);

  const [product, setProduct] = useState<string>('butter');
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  // Get types for yeast products
  const yeastTypes = useMemo(() => {
    return productList.filter(p => p.includes('yeast'));
  }, [productList]);

  // Get units for the selected product
  const availableUnits = useMemo(() => {
    if (!product || !CONVERSION_DATA[product]) return [];
    
    // For all products including yeast, return all available units except 'block'
    // and any properties that are objects rather than simple number values
    return Object.keys(CONVERSION_DATA[product]).filter(key => 
      key !== 'block' && typeof CONVERSION_DATA[product][key] === 'number' &&
      !yeastTypes.includes(key) // Exclude yeast types from the units list
    );
  }, [product, yeastTypes]);
  
  // Initialize from/to units based on available units
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [fromType, setFromType] = useState<string>('');
  const [toType, setToType] = useState<string>('');
  
  // Initialize defaults when product or availableUnits change
  useEffect(() => {
    if (availableUnits.length > 0) {
      setFromUnit(availableUnits[0]);
      setToUnit(availableUnits.length > 1 ? availableUnits[1] : availableUnits[0]);
    }
    
    // Reset type fields for yeast
    if (product.includes('yeast')) {
      setFromType(product);
      // Find an alternative yeast type different from the current one
      const alternativeYeast = yeastTypes.find(t => t !== product);
      setToType(alternativeYeast || yeastTypes[0]);
    } else {
      // For non-yeast products, clear these fields
      setFromType('');
      setToType('');
    }
    
    // Reset result when product changes
    setResult(null);
  }, [product, availableUnits, yeastTypes]);

  const convertMeasurement = useCallback(() => {
    // Parse the input value 
    const parsedInput = parseFraction(inputValue);
    
    if (parsedInput === null || !fromUnit || !toUnit) return null;

    // If we're dealing with yeast conversion between different types
    if (product.includes('yeast') && fromType && toType && fromType !== toType) {
      // Check if we have a direct hardcoded conversion
      if (
        YEAST_CONVERSION_CHART[fromType] && 
        YEAST_CONVERSION_CHART[fromType][toType] && 
        YEAST_CONVERSION_CHART[fromType][toType][fromUnit] && 
        YEAST_CONVERSION_CHART[fromType][toType][fromUnit][toUnit] !== undefined
      ) {
        // Use the hardcoded conversion factor
        const conversionFactor = YEAST_CONVERSION_CHART[fromType][toType][fromUnit][toUnit];
        return parsedInput * conversionFactor;
      }
      
      // Handle grams to non-grams and vice versa with special care
      if (fromUnit === 'grams' && toUnit !== 'grams') {
        // Convert grams of fromType to cups of fromType
        const fromTypeData = CONVERSION_DATA[fromType];
        const fromTypeGramsPerCup = typeof fromTypeData.grams === 'number' ? fromTypeData.grams : 0;
        if (fromTypeGramsPerCup <= 0) return null;
        
        const fromTypeCups = parsedInput / fromTypeGramsPerCup;
        
        // Use our chart to convert cups of fromType to toUnit of toType
        if (
          YEAST_CONVERSION_CHART[fromType]?.[toType]?.['cup']?.[toUnit] !== undefined
        ) {
          const conversionFactor = YEAST_CONVERSION_CHART[fromType][toType]['cup'][toUnit];
          return fromTypeCups * conversionFactor;
        }
      }
      
      if (fromUnit !== 'grams' && toUnit === 'grams') {
        // Convert fromUnit of fromType to cups of fromType
        const fromTypeData = CONVERSION_DATA[fromType];
        const fromUnitValue = fromTypeData[fromUnit];
        if (typeof fromUnitValue !== 'number' || fromUnitValue <= 0) return null;
        
        const fromTypeCups = parsedInput / fromUnitValue;
        
        // Convert cups of fromType to grams of fromType
        const fromTypeGramsPerCup = typeof fromTypeData.grams === 'number' ? fromTypeData.grams : 0;
        if (fromTypeGramsPerCup <= 0) return null;
        
        const fromTypeGrams = fromTypeCups * fromTypeGramsPerCup;
        
        // Convert grams of fromType to grams of toType
        if (
          YEAST_CONVERSION_CHART[fromType]?.[toType]?.['grams']?.['grams'] !== undefined
        ) {
          const gramConversionFactor = YEAST_CONVERSION_CHART[fromType][toType]['grams']['grams'];
          return fromTypeGrams * gramConversionFactor;
        }
      }
      
      // If we're here, we don't have a direct conversion, so we'll use cups as an intermediate
      // First convert to cups in the source yeast type
      const fromTypeCups = convertToCups(parsedInput, fromUnit, fromType);
      if (fromTypeCups === null) return null;
      
      // Then use our hardcoded chart to convert cups to the target unit
      if (
        YEAST_CONVERSION_CHART[fromType]?.[toType]?.['cup']?.[toUnit] !== undefined
      ) {
        const conversionFactor = YEAST_CONVERSION_CHART[fromType][toType]['cup'][toUnit];
        return fromTypeCups * conversionFactor;
      }
    }
    
    // For same yeast type or non-yeast ingredients, use the original conversion logic
    const baseEntry = CONVERSION_DATA[product];
    const fromValueRaw = baseEntry[fromUnit];
    const toValueRaw = baseEntry[toUnit];
    
    const fromValue = typeof fromValueRaw === 'number' ? fromValueRaw : 0;
    const toValue = typeof toValueRaw === 'number' ? toValueRaw : 0;
    
    if (fromValue <= 0) return null;
    
    const result = (parsedInput * toValue) / fromValue;
    return result;
  }, [inputValue, fromUnit, toUnit, product, fromType, toType]);

  // Update the handleConvert function to pass the toUnit to formatResult
  const handleConvert = (): void => {
    const convertedValue = convertMeasurement();
    if (convertedValue === null) {
      setResult('Invalid conversion');
    } else {
      setResult(formatResult(convertedValue, toUnit));
    }
  };

  // Handle product change
  const handleProductChange = (newProduct: string): void => {
    setProduct(newProduct);
    setInputValue('');
    setResult(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="p-4">Ingredient Measurement Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Product Selection */}
          <div>
            <Label>Product</Label>
            <Select value={product} onValueChange={handleProductChange}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(productCategories).map(([category, products]) => (
                  <React.Fragment key={category}>
                    <SelectItem value={category} disabled>{category}</SelectItem>
                    {products.map(p => (
                      <SelectItem key={p} value={p} className="pl-6">{p}</SelectItem>
                    ))}
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input Value */}
          <div>
            <Label>Input Value</Label>
            <Input 
              type="text" 
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              placeholder="Enter amount (e.g., 1 1/2, 2/3)"
              className="mt-2"
            />
          </div>

          {/* Yeast-specific Type Selection */}
          {product.includes('yeast') && (
            <div className="flex space-x-2">
              <div className="w-1/2">
                <Label>From Type</Label>
                <Select value={fromType} onValueChange={setFromType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="From Yeast Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {yeastTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/2">
                <Label>To Type</Label>
                <Select value={toType} onValueChange={setToType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="To Yeast Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {yeastTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Unit Conversion */}
          <div className="flex space-x-2">
            <div className="w-1/2">
              <Label>From Unit</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="From Unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label>To Unit</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="To Unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Convert Button */}
          <button 
            onClick={handleConvert}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Convert
          </button>

          {/* Result Display */}
          {result !== null && (
            <div className="mt-4 text-center">
              <p className="text-xl font-bold">
                {inputValue} {product.includes('yeast') ? `${fromType} ` : ''}{fromUnit} 
                = {result} {product.includes('yeast') ? `${toType} ` : ''}{toUnit}
              </p>
            </div>
          )}
        </div>
        <SocialLinks />
      </CardContent>
    </Card>
  );
};

export default MultiIngredientConverter;