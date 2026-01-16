import { describe, it, expect } from 'vitest'
import {
  mockRecipes,
  getRecipesByContext,
  getRandomRecipes,
  getRandomRecipesByContext,
} from '@/lib/mock/recipes'

describe('Mock Recipes', () => {
  describe('mockRecipes data', () => {
    it('should have recipes', () => {
      expect(mockRecipes.length).toBeGreaterThan(0)
    })

    it('should have required fields for each recipe', () => {
      mockRecipes.forEach((recipe) => {
        expect(recipe).toHaveProperty('id')
        expect(recipe).toHaveProperty('title')
        expect(recipe).toHaveProperty('description')
        expect(recipe).toHaveProperty('calories')
        expect(recipe).toHaveProperty('protein')
        expect(recipe).toHaveProperty('cookTime')
        expect(recipe).toHaveProperty('source')
        expect(recipe).toHaveProperty('sourceUrl')
        expect(recipe).toHaveProperty('steps')
        expect(recipe).toHaveProperty('ingredients')
      })
    })

    it('should have valid nutrition values', () => {
      mockRecipes.forEach((recipe) => {
        expect(recipe.calories).toBeGreaterThan(0)
        expect(recipe.protein).toBeGreaterThanOrEqual(0)
        expect(recipe.carbs).toBeGreaterThanOrEqual(0)
        expect(recipe.fat).toBeGreaterThanOrEqual(0)
      })
    })

    it('should have source URL for each recipe (real.md constraint)', () => {
      mockRecipes.forEach((recipe) => {
        expect(recipe.sourceUrl).toBeTruthy()
        expect(recipe.sourceUrl).toMatch(/^https?:\/\//)
      })
    })
  })

  describe('getRecipesByContext', () => {
    it('should return recipes for post-workout context', () => {
      const recipes = getRecipesByContext('post-workout')
      expect(recipes.length).toBeGreaterThan(0)
      recipes.forEach((recipe) => {
        expect(recipe.contexts).toContain('post-workout')
      })
    })

    it('should return recipes for busy context', () => {
      const recipes = getRecipesByContext('busy')
      expect(recipes.length).toBeGreaterThan(0)
      recipes.forEach((recipe) => {
        expect(recipe.contexts).toContain('busy')
      })
    })

    it('should return recipes for have-time context', () => {
      const recipes = getRecipesByContext('have-time')
      expect(recipes.length).toBeGreaterThan(0)
      recipes.forEach((recipe) => {
        expect(recipe.contexts).toContain('have-time')
      })
    })

    it('should return recipes for social context', () => {
      const recipes = getRecipesByContext('social')
      expect(recipes.length).toBeGreaterThan(0)
      recipes.forEach((recipe) => {
        expect(recipe.contexts).toContain('social')
      })
    })
  })

  describe('getRandomRecipes', () => {
    it('should return specified number of recipes', () => {
      const count = 3
      const recipes = getRandomRecipes(count)
      expect(recipes.length).toBeLessThanOrEqual(count)
    })

    it('should exclude specified IDs', () => {
      const excludeIds = [mockRecipes[0].id]
      const recipes = getRandomRecipes(10, excludeIds)

      recipes.forEach((recipe) => {
        expect(excludeIds).not.toContain(recipe.id)
      })
    })
  })

  describe('getRandomRecipesByContext', () => {
    it('should return random recipes matching context', () => {
      const recipes = getRandomRecipesByContext('post-workout', 3)

      recipes.forEach((recipe) => {
        expect(recipe.contexts).toContain('post-workout')
      })
    })

    it('should exclude specified IDs', () => {
      const contextRecipes = getRecipesByContext('busy')
      if (contextRecipes.length > 0) {
        const excludeIds = [contextRecipes[0].id]
        const recipes = getRandomRecipesByContext('busy', 10, excludeIds)

        recipes.forEach((recipe) => {
          expect(excludeIds).not.toContain(recipe.id)
        })
      }
    })
  })
})
