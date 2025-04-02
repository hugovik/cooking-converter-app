"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConversionData {
  [key: string]: {
    [key: string]: number | { [key: string]: number };
  };
}

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
    'compressed fresh baker\'s yeast': {
      cup: 2,
      'tablespoon-s': 32,
      'teaspoon-s': 96,
      grams: 272
    }
  },
  'instant yeast': {
    cup: 1.5,
    'tablespoon-s': 16,
    'teaspoon-s': 48,
    grams: 100,
    'active dry yeast': 1.5
  },
  'compressed fresh baker\'s yeast': {
    cup: 1,
    'tablespoon-s': 3,
    'teaspoon-s': 9,
    grams: 100,
    'active dry yeast': {
      cup: 1/2,
      'tablespoon-s': 1/8,
      'teaspoon-s': 6,
      grams: 17
    }
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

// Utility function to format number as a nice fraction where appropriate
const formatResult = (value: number): string => {
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
    
    if (product.includes('yeast')) {
      // Special handling for yeast to include nested conversion units
      return Object.keys(CONVERSION_DATA[product]).filter(key => 
        typeof CONVERSION_DATA[product][key] === 'number' || 
        (typeof CONVERSION_DATA[product][key] === 'object' && key !== 'grams')
      );
    }
    
    return Object.keys(CONVERSION_DATA[product]).filter(key => 
      key !== 'block' && (typeof CONVERSION_DATA[product][key] === 'number')
    );
  }, [product]);
  
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
      if (yeastTypes.length > 1) {
        setToType(yeastTypes.find(t => t !== product) || '');
      }
    } else {
      setFromType('');
      setToType('');
    }
    
    // Reset result when product changes
    setResult(null);
  }, [product, availableUnits, yeastTypes]);

  // FIX: Properly parse fractions and mixed numbers
  const parseFraction = (input: string): number | null => {
    if (!input || input.trim() === '') return null;
    
    // Clean input
    const cleanInput = input.trim();
    
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

// Replace the existing convertMeasurement function with this improved version
const convertMeasurement = useCallback(() => {
  // First, properly parse the input value using our improved parseFraction
  const parsedInput = parseFraction(inputValue);
  
  // Debug log to verify parsing
  console.log("Parsed input:", inputValue, "→", parsedInput);
  
  if (parsedInput === null || !fromUnit || !toUnit) return null;

  // Check if this is a standard conversion (not yeast type conversion)
  if (!product.includes('yeast') || fromType === toType) {
    // Direct conversion
    const baseEntry = CONVERSION_DATA[product];
    const fromValueRaw = baseEntry[fromUnit];
    const toValueRaw = baseEntry[toUnit];
    
    // Ensure we're working with numbers
    const fromValue = typeof fromValueRaw === 'number' ? fromValueRaw : 0;
    const toValue = typeof toValueRaw === 'number' ? toValueRaw : 0;
    
    if (fromValue <= 0) return null;
    
    // Scale the conversion: (input * toValue) / fromValue
    const result = (parsedInput * toValue) / fromValue;
    console.log(`Converting ${parsedInput} ${fromUnit} to ${toUnit}:`, result);
    return result;
  }

  // Yeast conversion
  if (product.includes('yeast') && fromType && toType) {
    // Existing yeast conversion logic can stay the same
    const sourceConversions = CONVERSION_DATA[fromType];
    
    // Check if conversion exists in nested structure
    if (typeof sourceConversions[toType] === 'object') {
      // Use nested conversion
      const nestedConversion = sourceConversions[toType] as {[key: string]: number};
      
      // Convert fromUnit to base unit first, then to target unit
      const baseUnitValue = parsedInput; // We now have the correctly parsed value
      const toValue = nestedConversion[toUnit];
      
      if (typeof toValue === 'number') {
        return baseUnitValue * toValue;
      }
    } else if (typeof sourceConversions[toType] === 'number') {
      // Direct type conversion, then handle units
      const typeConversionFactor = sourceConversions[toType] as number;
      const targetTypeData = CONVERSION_DATA[toType];
      
      // Convert to base unit of the target type, then to desired unit
      const baseUnitValue = parsedInput * typeConversionFactor;
      const targetUnitValue = targetTypeData[toUnit];
      
      if (typeof targetUnitValue === 'number') {
        return baseUnitValue * targetUnitValue;
      }
    }
  }

  return null;
}, [inputValue, fromUnit, toUnit, product, fromType, toType]);

  const handleConvert = (): void => {
    const convertedValue = convertMeasurement();
    if (convertedValue === null) {
      setResult('Invalid conversion');
    } else {
      setResult(formatResult(convertedValue));
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
        <CardTitle>Ingredient Measurement Converter</CardTitle>
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
                    {yeastTypes.filter(t => t !== fromType).map(type => (
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
      </CardContent>
    </Card>
  );
};

export default MultiIngredientConverter;