import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchRecipe } from './fetchRecipe'

const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const mockRecipe = {
  id: 'sourdough-boule',
  name: 'Classic Sourdough Boule',
  summary: 'A tangy, chewy sourdough loaf with a crisp crust',
  photo_url: 'https://example.com/photos/sourdough-boule.jpg',
  description: 'A traditional sourdough boule.',
  ingredients: [{ quantity: 500, unit: 'g', name: 'strong white bread flour' }],
  instructions: [{ step: 1, description: 'Mix the flour and water.' }],
}

describe('fetchRecipe', () => {
  it('returns a recipe on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRecipe),
    })

    const result = await fetchRecipe('sourdough-boule')

    expect(result).toEqual(mockRecipe)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/recipes/sourdough-boule'))
  })

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 })

    await expect(fetchRecipe('unknown')).rejects.toThrow('fetchRecipe failed: 404')
  })
})
