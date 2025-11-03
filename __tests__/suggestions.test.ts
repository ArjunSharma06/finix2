import { describe, expect, test } from '@jest/globals';
import { computeMonthlySummary, generateSuggestions } from '../lib/suggestion-utils';
import { SmartSuggestion } from '../types/suggestions';

describe('Suggestion Computations', () => {
  const mockTransactions = [
    { amount: 1000, category: 'food', date: '2025-11-01' },
    { amount: 2000, category: 'food', date: '2025-10-15' },
    { amount: 1500, category: 'entertainment', date: '2025-10-01' },
    { amount: 3000, category: 'rent', date: '2025-11-01' },
    { amount: 500, category: 'subscriptions', date: '2025-09-01' }, // Outside 90-day window
  ];

  const mockTravelGoal = {
    name: 'Japan Trip',
    target_amount: 12000,
    current_saved: 0,
    target_date: '2026-11-03',
    destination: 'Tokyo, Japan'
  };

  describe('Monthly Summary Computation', () => {
    test('correctly calculates category monthly averages', () => {
      const { categoryMonthlyAvg, totalMonthlySpend } = computeMonthlySummary(mockTransactions);
      
      // Food average should be (1000 + 2000) / 3 months = 1000
      expect(categoryMonthlyAvg['food']).toBe(1000);
      
      // Entertainment average should be 1500 / 3 = 500
      expect(categoryMonthlyAvg['entertainment']).toBe(500);
      
      // Subscriptions should not be included (outside window)
      expect(categoryMonthlyAvg['subscriptions']).toBeUndefined();
      
      // Total monthly spend should be (1000 + 2000 + 1500 + 3000) / 3 = 2500
      expect(totalMonthlySpend).toBe(2500);
    });

    test('handles empty transaction list', () => {
      const { categoryMonthlyAvg, totalMonthlySpend } = computeMonthlySummary([]);
      expect(Object.keys(categoryMonthlyAvg)).toHaveLength(0);
      expect(totalMonthlySpend).toBe(0);
    });
  });

  describe('Suggestion Generation', () => {
    test('generates category-based suggestions', () => {
      const { categoryMonthlyAvg } = computeMonthlySummary(mockTransactions);
      const suggestions = generateSuggestions(categoryMonthlyAvg, mockTravelGoal);
      
      // Should have suggestions for food and entertainment (20% reduction)
      expect(suggestions.some((s: SmartSuggestion) => s.category === 'food')).toBe(true);
      expect(suggestions.some((s: SmartSuggestion) => s.category === 'entertainment')).toBe(true);
      
      // Should have travel goal suggestion
      expect(suggestions.some((s: SmartSuggestion) => s.category === 'Travel')).toBe(true);
      
      // Food suggestion should recommend 200 savings (20% of 1000)
      const foodSuggestion = suggestions.find((s: SmartSuggestion) => s.category === 'food');
      expect(foodSuggestion?.savings).toBe(200);
    });

    test('includes travel goal suggestion', () => {
      const { categoryMonthlyAvg } = computeMonthlySummary(mockTransactions);
      const suggestions = generateSuggestions(categoryMonthlyAvg, mockTravelGoal);
      
      const travelSuggestion = suggestions.find((s: SmartSuggestion) => s.category === 'Travel');
      expect(travelSuggestion).toBeDefined();
      expect(travelSuggestion?.savings).toBe(1000); // 12000/12
    });

    test('handles missing travel goal', () => {
      const { categoryMonthlyAvg } = computeMonthlySummary(mockTransactions);
      const suggestions = generateSuggestions(categoryMonthlyAvg, null);
      
      expect(suggestions.some((s: SmartSuggestion) => s.category === 'Travel')).toBe(false);
    });
  });
});