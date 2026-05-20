import {
  getRelatedCourses,
  moveIdToFront,
  toggleId,
} from '../utils/recommendations';

describe('recommendations utilities', () => {
  test('toggleId adds and removes ids consistently', () => {
    expect(toggleId(['1', '2'], 3)).toEqual(['1', '2', 3]);
    expect(toggleId(['1', '2'], 2)).toEqual(['1']);
  });

  test('moveIdToFront keeps the list unique and respects the limit', () => {
    expect(moveIdToFront(['1', '2', '3'], '2', 2)).toEqual(['2', '1']);
  });

  test('getRelatedCourses returns courses with shared categories', () => {
    const book = {
      category: 'frontend',
      genres: ['algorithms'],
    };
    const courses = [
      { id: 'react', category: 'frontend' },
      { id: 'backend', category: 'backend' },
      { id: 'algo', category: 'algorithms' },
    ];

    expect(getRelatedCourses(book, courses)).toEqual([
      { id: 'react', category: 'frontend' },
      { id: 'algo', category: 'algorithms' },
    ]);
  });
});
