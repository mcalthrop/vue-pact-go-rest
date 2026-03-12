import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchRecipes, fetchRecipe } from '../client'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

afterEach(() => {
  vi.unstubAllGlobals()
  vi.stubGlobal('fetch', mockFetch)
  mockFetch.mockReset()
})

const mockSummary = {
  id: 'sourdough-boule',
  name: 'Classic Sourdough Boule',
  summary: 'A tangy, chewy sourdough loaf with a crisp crust',
  photo_url: 'https://example.com/photos/sourdough-boule.jpg',
}

const mockRecipe = {
  ...mockSummary,
  description: 'A traditional sourdough boule.',
  ingredients: [{ quantity: 500, unit: 'g', name: 'strong white bread flour' }],
  instructions: [{ step: 1, description: 'Mix the flour and water.' }],
}

describe('fetchRecipes', () => {
  it('returns recipe list on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ recipes: [mockSummary] }),
    })

    const result = await fetchRecipes()

    expect(result).toEqual([mockSummary])
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/recipes')
  })

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 })

    await expect(fetchRecipes()).rejects.toThrow('fetchRecipes failed: 500')
  })
})

describe('fetchRecipe', () => {
  it('returns a recipe on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRecipe),
    })

    const result = await fetchRecipe('sourdough-boule')

    expect(result).toEqual(mockRecipe)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/recipes/sourdough-boule')
  })

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 })

    await expect(fetchRecipe('unknown')).rejects.toThrow('fetchRecipe failed: 404')
  })
})
