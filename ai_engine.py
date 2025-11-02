"""
AI Engine for FINIX - The Central Brain.
Generates personalized, context-aware savings strategies by analyzing
user transactions and travel goals using Groq API.
"""

import os
import pandas as pd
from datetime import date, datetime
from decimal import Decimal
from typing import List, Dict, Optional
from sqlalchemy.orm import Session

from models import Transaction, TravelGoal
from schemas import SavingsSuggestion, AISuggestionResponse


class AIEngine:
    """
    AI Engine that processes transaction data and generates personalized savings suggestions.
    """

    def __init__(self, mock_mode: bool = False):
        """
        Initialize the Groq API client.
        
        Args:
            mock_mode: If True, skip API initialization and use mock suggestions only
        """
        self.mock_mode = mock_mode
        api_key = os.getenv("GROQ_API_KEY")
        
        if not mock_mode:
            if not api_key:
                raise ValueError("GROQ_API_KEY environment variable is required")
            # Lazy import Groq only when needed (not in mock mode)
            from groq import Groq
            self.client = Groq(api_key=api_key)
        else:
            self.client = None

    def _analyze_transactions(
        self,
        transactions: List[Transaction],
        travel_goal: TravelGoal
    ) -> Dict:
        """
        Analyze transactions using Pandas to extract key metrics.
        
        Args:
            transactions: List of user transactions
            travel_goal: User's travel goal
            
        Returns:
            Dictionary containing analyzed metrics
        """
        if not transactions:
            return {
                "average_monthly_spending": Decimal("0"),
                "non_essential_spending": Decimal("0"),
                "category_breakdown": {},
                "total_spending": Decimal("0"),
                "transaction_count": 0
            }

        # Convert transactions to DataFrame
        df = pd.DataFrame([{
            'amount': float(t.amount),
            'category': t.category,
            'date': t.date,
            'currency': t.currency
        } for t in transactions])

        # Calculate average monthly spending
        df['date'] = pd.to_datetime(df['date'])
        df['year_month'] = df['date'].dt.to_period('M')
        monthly_totals = df.groupby('year_month')['amount'].sum()
        average_monthly_spending = Decimal(str(monthly_totals.mean())) if len(monthly_totals) > 0 else Decimal("0")

        # Identify non-essential categories (commonly discretionary spending)
        essential_categories = {'Food', 'Groceries', 'Utilities', 'Rent', 'Transport', 
                               'Transportation', 'Healthcare', 'Bills', 'Insurance'}
        df['is_non_essential'] = ~df['category'].isin(essential_categories)
        non_essential_spending = Decimal(str(df[df['is_non_essential']]['amount'].sum()))

        # Category breakdown
        category_breakdown = df.groupby('category')['amount'].sum().to_dict()
        category_breakdown = {k: Decimal(str(v)) for k, v in category_breakdown.items()}

        # Total spending
        total_spending = Decimal(str(df['amount'].sum()))

        return {
            "average_monthly_spending": average_monthly_spending,
            "non_essential_spending": non_essential_spending,
            "category_breakdown": category_breakdown,
            "total_spending": total_spending,
            "transaction_count": len(df),
            "monthly_totals": monthly_totals.tolist() if len(monthly_totals) > 0 else []
        }

    def _calculate_savings_metrics(
        self,
        analysis: Dict,
        travel_goal: TravelGoal
    ) -> Dict:
        """
        Calculate savings metrics and timeline projections.
        
        Args:
            analysis: Transaction analysis results
            travel_goal: User's travel goal
            
        Returns:
            Dictionary with savings calculations
        """
        remaining_amount = travel_goal.target_amount - travel_goal.current_saved
        average_monthly_spending = analysis["average_monthly_spending"]
        non_essential_spending = analysis["non_essential_spending"]

        # Calculate months to goal with current spending
        if average_monthly_spending > 0:
            # Assumption: User can save 20% of their spending on average
            current_monthly_savings = average_monthly_spending * Decimal("0.2")
            if current_monthly_savings > 0:
                months_to_goal_current = float(remaining_amount / current_monthly_savings)
            else:
                months_to_goal_current = None
        else:
            months_to_goal_current = None

        # Optimized timeline (if user cuts non-essential spending by 50%)
        if non_essential_spending > 0:
            potential_savings_from_cuts = non_essential_spending * Decimal("0.5")
            optimized_monthly_savings = (average_monthly_spending * Decimal("0.2")) + potential_savings_from_cuts
            if optimized_monthly_savings > 0:
                months_to_goal_optimized = float(remaining_amount / optimized_monthly_savings)
            else:
                months_to_goal_optimized = None
        else:
            months_to_goal_optimized = months_to_goal_current

        return {
            "remaining_amount": remaining_amount,
            "months_to_goal_current": months_to_goal_current,
            "months_to_goal_optimized": months_to_goal_optimized,
            "current_monthly_savings": average_monthly_spending * Decimal("0.2") if average_monthly_spending > 0 else Decimal("0")
        }

    def _generate_llm_prompt(
        self,
        analysis: Dict,
        travel_goal: TravelGoal,
        savings_metrics: Dict
    ) -> str:
        """
        Generate a highly specific prompt for the Groq LLM.
        
        Args:
            analysis: Transaction analysis results
            travel_goal: User's travel goal
            savings_metrics: Calculated savings metrics
            
        Returns:
            Formatted prompt string for the LLM
        """
        category_breakdown_str = "\n".join([
            f"  - {cat}: ${amount:.2f}"
            for cat, amount in sorted(analysis["category_breakdown"].items(), 
                                     key=lambda x: x[1], reverse=True)[:10]
        ])

        prompt = f"""You are a financial advisor helping a user save for their travel goal.

USER'S TRAVEL GOAL:
- Goal Name: {travel_goal.name}
- Destination: {travel_goal.destination or "Not specified"}
- Target Amount: ${travel_goal.target_amount:,.2f}
- Currently Saved: ${travel_goal.current_saved:,.2f}
- Remaining to Save: ${savings_metrics["remaining_amount"]:,.2f}

CURRENT SPENDING PATTERNS:
- Average Monthly Spending: ${analysis["average_monthly_spending"]:,.2f}
- Non-Essential Spending (last period): ${analysis["non_essential_spending"]:,.2f}
- Total Transactions Analyzed: {analysis["transaction_count"]}

TOP SPENDING CATEGORIES:
{category_breakdown_str}

TIMELINE ANALYSIS:
- Current pace: {savings_metrics["months_to_goal_current"]:.1f} months to goal (if saving 20% of income)
- Optimized pace: {savings_metrics["months_to_goal_optimized"]:.1f} months to goal (with spending cuts)

TASK:
Generate 3-5 specific, actionable savings suggestions that directly link current spending patterns to the travel goal. Each suggestion should:
1. Reference a specific spending category or pattern from the data above
2. Calculate the potential monthly savings (be realistic)
3. Explain how this specific change accelerates the travel timeline
4. Be personalized and motivational, connecting the sacrifice to the travel experience

Format your response as a JSON array of objects with this exact structure:
[
  {{
    "title": "Short, catchy title (e.g., 'Cut Coffee Shop Visits')",
    "description": "Detailed explanation (2-3 sentences) linking the expense to the travel goal",
    "potential_savings": 150.00,
    "impact": "Specific timeline impact (e.g., 'Saves 2 months toward your trip')",
    "category": "Category name from spending data"
  }},
  ... (repeat for 3-5 suggestions)
]

Be specific with numbers and make it personal. Reference the destination if provided. Return ONLY valid JSON, no additional text."""

        return prompt

    def generate_suggestions(
        self,
        db: Session,
        user_id: int
    ) -> AISuggestionResponse:
        """
        Main method to generate AI-powered savings suggestions.
        
        Args:
            db: Database session
            user_id: User ID to generate suggestions for
            
        Returns:
            AISuggestionResponse with personalized suggestions
        """
        # Retrieve user's transactions and travel goal
        transactions = db.query(Transaction).filter(
            Transaction.user_id == user_id
        ).order_by(Transaction.date.desc()).all()

        travel_goal = db.query(TravelGoal).filter(
            TravelGoal.user_id == user_id
        ).first()

        if not travel_goal:
            raise ValueError(f"No travel goal found for user {user_id}")

        # Analyze transactions
        analysis = self._analyze_transactions(transactions, travel_goal)

        # Calculate savings metrics
        savings_metrics = self._calculate_savings_metrics(analysis, travel_goal)

        # Generate LLM prompt
        prompt = self._generate_llm_prompt(analysis, travel_goal, savings_metrics)

        # Call Groq API (or use mock if in mock mode)
        if self.mock_mode or self.client is None:
            # Use mock suggestions directly
            suggestions = self._generate_mock_suggestions(analysis, travel_goal, savings_metrics)
        else:
            try:
                response = self.client.chat.completions.create(
                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    model="llama-3.1-70b-versatile",  # Or use other Groq models like "mixtral-8x7b-32768"
                    temperature=0.7
                )
                response_text = response.choices[0].message.content.strip()

                # Parse JSON response (handle markdown code blocks if present)
                if "```json" in response_text:
                    response_text = response_text.split("```json")[1].split("```")[0].strip()
                elif "```" in response_text:
                    response_text = response_text.split("```")[1].split("```")[0].strip()

                import json
                suggestions_data = json.loads(response_text)

                # Convert to SavingsSuggestion objects
                suggestions = [
                    SavingsSuggestion(
                        title=s["title"],
                        description=s["description"],
                        potential_savings=Decimal(str(s["potential_savings"])),
                        impact=s["impact"],
                        category=s.get("category")
                    )
                    for s in suggestions_data
                ]

            except Exception as e:
                # Fallback to mock suggestions if LLM fails
                print(f"LLM API call failed: {str(e)}. Using mock suggestions.")
                suggestions = self._generate_mock_suggestions(analysis, travel_goal, savings_metrics)

        # Build response
        return AISuggestionResponse(
            user_id=user_id,
            travel_goal_name=travel_goal.name,
            target_amount=travel_goal.target_amount,
            current_saved=travel_goal.current_saved,
            remaining_amount=savings_metrics["remaining_amount"],
            average_monthly_spending=analysis["average_monthly_spending"],
            non_essential_spending=analysis["non_essential_spending"],
            months_to_goal_current=savings_metrics["months_to_goal_current"],
            months_to_goal_optimized=savings_metrics["months_to_goal_optimized"],
            suggestions=suggestions,
            generated_at=datetime.now()
        )

    def generate_suggestions_stateless(
        self,
        transactions_data: List[Dict],
        travel_goal_data: Dict
    ) -> AISuggestionResponse:
        """
        Generate AI suggestions from in-memory data (stateless - no database).
        Used for Round 1 Prototype.
        
        Args:
            transactions_data: List of transaction dictionaries with keys: amount, category, currency, date, description
            travel_goal_data: Dictionary with keys: name, target_amount, current_saved, target_date, destination
            
        Returns:
            AISuggestionResponse with personalized suggestions
        """
        from datetime import datetime
        from decimal import Decimal
        
        # Create mock Transaction objects from dictionaries
        class MockTransaction:
            def __init__(self, data):
                self.amount = Decimal(str(data['amount']))
                self.category = data['category']
                self.currency = data.get('currency', 'USD')
                self.date = data['date'] if isinstance(data['date'], date) else date.fromisoformat(str(data['date']))
                self.description = data.get('description')
        
        # Create mock TravelGoal object
        class MockTravelGoal:
            def __init__(self, data):
                self.name = data['name']
                self.target_amount = Decimal(str(data['target_amount']))
                self.current_saved = Decimal(str(data.get('current_saved', 0)))
                self.target_date = data.get('target_date')
                if isinstance(self.target_date, str):
                    self.target_date = date.fromisoformat(self.target_date)
                self.destination = data.get('destination')
        
        mock_transactions = [MockTransaction(t) for t in transactions_data]
        mock_travel_goal = MockTravelGoal(travel_goal_data)
        
        # Use existing analysis methods
        analysis = self._analyze_transactions(mock_transactions, mock_travel_goal)
        savings_metrics = self._calculate_savings_metrics(analysis, mock_travel_goal)
        
        # Generate LLM prompt
        prompt = self._generate_llm_prompt(analysis, mock_travel_goal, savings_metrics)
        
        # Call Groq API (or use mock if in mock mode)
        if self.mock_mode or self.client is None:
            suggestions = self._generate_mock_suggestions(analysis, mock_travel_goal, savings_metrics)
        else:
            try:
                response = self.client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.1-70b-versatile",
                    temperature=0.7
                )
                response_text = response.choices[0].message.content.strip()
                
                # Parse JSON response
                if "```json" in response_text:
                    response_text = response_text.split("```json")[1].split("```")[0].strip()
                elif "```" in response_text:
                    response_text = response_text.split("```")[1].split("```")[0].strip()
                
                import json
                suggestions_data = json.loads(response_text)
                
                suggestions = [
                    SavingsSuggestion(
                        title=s["title"],
                        description=s["description"],
                        potential_savings=Decimal(str(s["potential_savings"])),
                        impact=s["impact"],
                        category=s.get("category")
                    )
                    for s in suggestions_data
                ]
            except Exception as e:
                print(f"LLM API call failed: {str(e)}. Using mock suggestions.")
                suggestions = self._generate_mock_suggestions(analysis, mock_travel_goal, savings_metrics)
        
        # Build response
        user_id = travel_goal_data.get('user_id', 1)
        return AISuggestionResponse(
            user_id=user_id,
            travel_goal_name=mock_travel_goal.name,
            target_amount=mock_travel_goal.target_amount,
            current_saved=mock_travel_goal.current_saved,
            remaining_amount=savings_metrics["remaining_amount"],
            average_monthly_spending=analysis["average_monthly_spending"],
            non_essential_spending=analysis["non_essential_spending"],
            months_to_goal_current=savings_metrics["months_to_goal_current"],
            months_to_goal_optimized=savings_metrics["months_to_goal_optimized"],
            suggestions=suggestions,
            generated_at=datetime.now()
        )

    def _generate_mock_suggestions(
        self,
        analysis: Dict,
        travel_goal: TravelGoal,
        savings_metrics: Dict
    ) -> List[SavingsSuggestion]:
        """
        Generate mock suggestions as fallback when LLM is unavailable.
        Used for Round 1 Demo (MVP without live LLM).
        """
        top_category = max(analysis["category_breakdown"].items(), key=lambda x: x[1])[0] if analysis["category_breakdown"] else "Entertainment"
        
        mock_savings = analysis["non_essential_spending"] * Decimal("0.15")
        
        return [
            SavingsSuggestion(
                title=f"Reduce {top_category} Spending",
                description=f"Based on your spending patterns, reducing {top_category} expenses by 30% could save you ${mock_savings:.2f} per month. This directly accelerates your timeline to {travel_goal.name}.",
                potential_savings=mock_savings,
                impact=f"Saves approximately {savings_metrics['months_to_goal_optimized'] - savings_metrics['months_to_goal_current']:.1f} months toward your trip" if savings_metrics['months_to_goal_optimized'] and savings_metrics['months_to_goal_current'] else "Accelerates your savings timeline",
                category=top_category
            ),
            SavingsSuggestion(
                title="Review Subscriptions",
                description="Identify and cancel unused subscriptions. The average person has $50-100 in forgotten monthly subscriptions that could be redirected toward your travel fund.",
                potential_savings=Decimal("75.00"),
                impact="Every $75 saved monthly brings your trip 1 month closer",
                category="Subscriptions"
            ),
            SavingsSuggestion(
                title="Meal Prep Instead of Dining Out",
                description=f"Cooking at home 2 more times per week can save $100-150 monthly. This savings directly funds more experiences at {travel_goal.destination or 'your destination'}.",
                potential_savings=Decimal("125.00"),
                impact="Accelerates your savings by 15-20%",
                category="Food"
            )
        ]

