import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Disclaimer } from '@/components/disclaimer'
import {
  EmptyState,
  NoRecommendationsEmpty,
  NoInventoryEmpty,
  NoWorkoutsEmpty,
  NoShoppingItemsEmpty,
  NetworkErrorEmpty,
  LoadingErrorEmpty,
} from '@/components/empty-state'
import { Button } from '@/components/ui/button'

describe('Components', () => {
  describe('Disclaimer', () => {
    it('should render disclaimer text', () => {
      render(<Disclaimer />)

      expect(screen.getByText(/免责声明/)).toBeInTheDocument()
      expect(screen.getByText(/饮食建议仅供参考/)).toBeInTheDocument()
      expect(screen.getByText(/咨询专业医师或营养师/)).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(<Disclaimer className="custom-class" />)

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('EmptyState', () => {
    it('should render title and description', () => {
      render(
        <EmptyState
          title="Test Title"
          description="Test description"
          icon="🎉"
        />
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
      expect(screen.getByText('🎉')).toBeInTheDocument()
    })

    it('should render action button when provided', () => {
      const handleClick = vi.fn()

      render(
        <EmptyState
          title="Test"
          action={{ label: 'Click Me', onClick: handleClick }}
        />
      )

      const button = screen.getByText('Click Me')
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should render secondary action when provided', () => {
      const handlePrimary = vi.fn()
      const handleSecondary = vi.fn()

      render(
        <EmptyState
          title="Test"
          action={{ label: 'Primary', onClick: handlePrimary }}
          secondaryAction={{ label: 'Secondary', onClick: handleSecondary }}
        />
      )

      fireEvent.click(screen.getByText('Secondary'))
      expect(handleSecondary).toHaveBeenCalledTimes(1)
    })
  })

  describe('NoRecommendationsEmpty', () => {
    it('should render with refresh button', () => {
      const handleRefresh = vi.fn()

      render(<NoRecommendationsEmpty onRefresh={handleRefresh} />)

      expect(screen.getByText('暂无匹配的推荐')).toBeInTheDocument()
      expect(screen.getByText('换一批推荐')).toBeInTheDocument()

      fireEvent.click(screen.getByText('换一批推荐'))
      expect(handleRefresh).toHaveBeenCalledTimes(1)
    })
  })

  describe('NoInventoryEmpty', () => {
    it('should render with add button', () => {
      const handleAdd = vi.fn()

      render(<NoInventoryEmpty onAdd={handleAdd} />)

      expect(screen.getByText('冰箱空空如也')).toBeInTheDocument()
      expect(screen.getByText('添加预制菜')).toBeInTheDocument()

      fireEvent.click(screen.getByText('添加预制菜'))
      expect(handleAdd).toHaveBeenCalledTimes(1)
    })
  })

  describe('NoWorkoutsEmpty', () => {
    it('should render with add button', () => {
      const handleAdd = vi.fn()

      render(<NoWorkoutsEmpty onAdd={handleAdd} />)

      expect(screen.getByText('还没有运动记录')).toBeInTheDocument()
      expect(screen.getByText('记录运动')).toBeInTheDocument()

      fireEvent.click(screen.getByText('记录运动'))
      expect(handleAdd).toHaveBeenCalledTimes(1)
    })
  })

  describe('NoShoppingItemsEmpty', () => {
    it('should render without action button', () => {
      render(<NoShoppingItemsEmpty />)

      expect(screen.getByText('购物清单为空')).toBeInTheDocument()
      expect(screen.getByText('浏览食谱并添加食材到购物清单')).toBeInTheDocument()
    })
  })

  describe('NetworkErrorEmpty', () => {
    it('should render with retry button', () => {
      const handleRetry = vi.fn()

      render(<NetworkErrorEmpty onRetry={handleRetry} />)

      expect(screen.getByText('网络连接失败')).toBeInTheDocument()
      expect(screen.getByText('重试')).toBeInTheDocument()

      fireEvent.click(screen.getByText('重试'))
      expect(handleRetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('LoadingErrorEmpty', () => {
    it('should render with retry button', () => {
      const handleRetry = vi.fn()

      render(<LoadingErrorEmpty onRetry={handleRetry} />)

      expect(screen.getByText('加载失败')).toBeInTheDocument()
      expect(screen.getByText('重试')).toBeInTheDocument()

      fireEvent.click(screen.getByText('重试'))
      expect(handleRetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('EmptyState edge cases', () => {
    it('should render with default icon when not provided', () => {
      render(<EmptyState title="Test" />)

      expect(screen.getByText('📭')).toBeInTheDocument()
    })

    it('should not render description when not provided', () => {
      const { container } = render(<EmptyState title="Test" />)

      // Should only have title, no description paragraph
      const descriptions = container.querySelectorAll('p.text-sm.text-gray-600')
      expect(descriptions.length).toBe(0)
    })

    it('should not render buttons when no actions provided', () => {
      render(<EmptyState title="Test" />)

      const buttons = screen.queryAllByRole('button')
      expect(buttons.length).toBe(0)
    })
  })

  describe('Button', () => {
    it('should render with children', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('should handle click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      fireEvent.click(screen.getByText('Click me'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)

      const button = screen.getByText('Disabled')
      expect(button).toBeDisabled()
    })

    it('should apply variant classes', () => {
      const { container } = render(<Button variant="outline">Outline</Button>)

      expect(container.firstChild).toHaveClass('border')
    })
  })
})
