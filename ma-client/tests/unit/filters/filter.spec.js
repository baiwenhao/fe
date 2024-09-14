import { formatTime, parseTime } from '@/common/filters/index.js';

describe('filter', () => {
    const d = new Date('2018-07-13 17:54:01'); // "2018-07-13 17:54:01"

    it('test formatTime', () => {
        expect(formatTime((d / 1000).toFixed(0))).toBe('7月13日17时54分');
    });

    it('test parseTime', () => {
        expect(parseTime(d)).toBe('2018-07-13 17:54:01');
    });
});
