import type { Ingredient, Measurement } from './types';

const UNITS = [
  'cups?', 'c',
  'tablespoons?', 'tbsps?', 'tbs?', 'T',
  'teaspoons?', 'tsps?', 't',
  'ounces?', 'oz',
  'pounds?', 'lbs?',
  'grams?', 'g',
  'kilograms?', 'kg',
  'milligrams?', 'mg',
  'milliliters?', 'ml',
  'liters?', 'l',
  'quarts?', 'qt',
  'pints?', 'pt',
  'gallons?', 'gal',
  'pinch(?:es)?',
  'dash(?:es)?',
  'cloves?',
  'slices?',
  'pieces?',
  'whole',
  'large',
  'medium',
  'small',
  'cans?',
  'packages?', 'pkgs?',
  'bunche?s?',
  'heads?',
  'stalks?',
];

const UNIT_PATTERN = new RegExp(`^(${UNITS.join('|')})\\b\\.?`, 'i');

// Matches fractions like 1/2, 3/4
const FRACTION_PATTERN = /^(\d+)\/(\d+)/;

// Matches whole numbers or decimals
const NUMBER_PATTERN = /^(\d+(?:\.\d+)?)/;

interface ParsedMeasurement {
  amount: number;
  unit: string;
  isNegative: boolean;
}

function parseFraction(str: string): { value: number; remaining: string } | null {
  // Try mixed number first (e.g., "1 1/2")
  const mixedMatch = str.match(/^(\d+)\s+(\d+)\/(\d+)/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1]!, 10);
    const num = parseInt(mixedMatch[2]!, 10);
    const denom = parseInt(mixedMatch[3]!, 10);
    return {
      value: whole + num / denom,
      remaining: str.slice(mixedMatch[0].length).trim(),
    };
  }

  // Try simple fraction (e.g., "1/2")
  const fractionMatch = str.match(FRACTION_PATTERN);
  if (fractionMatch) {
    const num = parseInt(fractionMatch[1]!, 10);
    const denom = parseInt(fractionMatch[2]!, 10);
    return {
      value: num / denom,
      remaining: str.slice(fractionMatch[0].length).trim(),
    };
  }

  // Try whole/decimal number
  const numberMatch = str.match(NUMBER_PATTERN);
  if (numberMatch) {
    return {
      value: parseFloat(numberMatch[1]!),
      remaining: str.slice(numberMatch[0].length).trim(),
    };
  }

  return null;
}

function parseUnit(str: string): { unit: string; remaining: string } | null {
  const match = str.match(UNIT_PATTERN);
  if (match) {
    return {
      unit: match[1]!.toLowerCase().replace(/\.$/, ''),
      remaining: str.slice(match[0].length).trim(),
    };
  }
  return null;
}

function parseSingleMeasurement(str: string): { measurement: ParsedMeasurement; remaining: string } | null {
  let remaining = str.trim();

  // Check for negative sign
  const isNegative = remaining.startsWith('-');
  if (isNegative) {
    remaining = remaining.slice(1).trim();
  }

  // Check for positive sign
  if (remaining.startsWith('+')) {
    remaining = remaining.slice(1).trim();
  }

  // Parse the number
  const numberResult = parseFraction(remaining);
  if (!numberResult) {
    return null;
  }
  remaining = numberResult.remaining;

  // Parse the unit
  const unitResult = parseUnit(remaining);
  if (!unitResult) {
    return null;
  }

  return {
    measurement: {
      amount: numberResult.value,
      unit: unitResult.unit,
      isNegative,
    },
    remaining: unitResult.remaining,
  };
}

function parseAllMeasurements(str: string): { measurements: Measurement[]; ingredientName: string } {
  const measurements: Measurement[] = [];
  let remaining = str.trim();

  // Keep parsing measurements until we can't find any more
  while (remaining.length > 0) {
    // Skip leading operators for subsequent measurements
    if (measurements.length > 0) {
      const operatorMatch = remaining.match(/^,?\s*([+-]|minus|plus)\s*/i);
      if (operatorMatch) {
        const op = operatorMatch[1]!.toLowerCase();
        const isSubtraction = op === '-' || op === 'minus';
        remaining = remaining.slice(operatorMatch[0].length);

        const result = parseSingleMeasurement(remaining);
        if (result) {
          const amount = isSubtraction ? -result.measurement.amount : result.measurement.amount;
          measurements.push({ amount, unit: result.measurement.unit });
          remaining = result.remaining;
          continue;
        }
      }
      break;
    }

    const result = parseSingleMeasurement(remaining);
    if (result) {
      const amount = result.measurement.isNegative ? -result.measurement.amount : result.measurement.amount;
      measurements.push({ amount, unit: result.measurement.unit });
      remaining = result.remaining;
    } else {
      break;
    }
  }

  // Whatever's left is the ingredient name
  const ingredientName = remaining.trim();

  return { measurements, ingredientName };
}

export function parseIngredient(line: string, id: number): Ingredient {
  const { measurements, ingredientName } = parseAllMeasurements(line);

  // Use the first measurement as the primary amount/unit
  const primaryMeasurement = measurements[0];

  return {
    id,
    name: ingredientName || line.trim(),
    originalMeasurements: measurements,
    amount: primaryMeasurement?.amount ?? null,
    unit: primaryMeasurement?.unit ?? null,
    category: 'Uncategorized',
  };
}

export function parseIngredients(text: string): Ingredient[] {
  return text
    .split('\n')
    .filter((line) => line.trim())
    .map((line, index) => parseIngredient(line.trim(), index + 1));
}
