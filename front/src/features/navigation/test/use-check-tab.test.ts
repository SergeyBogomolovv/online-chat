import { Mock } from 'vitest';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { renderHook } from '@testing-library/react';
import { useCheckTab } from '../model/use-check-tab';

vi.mock('next/navigation');

describe('useCheckTab', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (usePathname as Mock).mockReturnValue('/current-path');
    (useSearchParams as Mock).mockReturnValue(mockSearchParams);
  });

  it('should set default tab if current tab is invalid', () => {
    mockSearchParams.get = vi.fn().mockReturnValue('invalid-tab');

    renderHook(() => useCheckTab());

    expect(mockRouter.push).toHaveBeenCalledWith('/current-path?tab=chats');
  });

  it('should not change the tab if it is valid', () => {
    mockSearchParams.get = vi.fn().mockReturnValue('chats');

    renderHook(() => useCheckTab());

    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
