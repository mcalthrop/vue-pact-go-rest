import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchRecipes } from './fetchRecipes'

const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const mockSummary = {
  id: 'sourdough-boule',
  name: 'Classic Sourdough Boule',
  summary: 'A tangy, chewy sourdough loaf with a crisp crust',
  photo_url: 'https://example.com/photos/sourdough-boule.jpg',
}

describe('fetchRecipes', () => {
  it('returns recipe list on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ recipes: [mockSummary] }),
    })

    const result = await fetchRecipes()

    expect(result).toEqual([mockSummary])
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/recipes'))
  })

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 })

    await expect(fetchRecipes()).rejects.toThrow('fetchRecipes failed: 500')
  })
})
