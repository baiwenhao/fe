import { param2Obj, isEmpty, awaitWrap, hasPermission } from '@/common/utils/index.js';

jest.mock('@/common/store', () => ({
    getters: {
        permissions: [1]
    }
}));

describe('utils test', () => {
    it('test empty param2Obj', () => {
        const result = param2Obj('param20bj?');
        expect(result).toEqual({});
    });
    it('test not empty param2Obj', () => {
        const result = param2Obj('param20bj?a=1&b=2');
        expect(result).toEqual({
            'a': '1',
            'b': '2'
        });
    });
    it('empty obj shoud get true', () => {
        const result = isEmpty({});
        expect(result).toBe(true);
    });
    it('not empty obj shoud get false', () => {
        const result = isEmpty({ a: 1 });
        expect(result).toBe(false);
    });
    it('has permission get true', () => {
        window.accessMap = { 'test': [1] };
        expect(hasPermission('test')).toBe(true);
    });
    it('not permission get false', () => {
        window.accessMap = { 'test': [1] };
        expect(hasPermission('another')).toBe(false);
    });
    it('test awaitWrap resove', async() => {
        const [err, response] = await awaitWrap(new Promise((resove) => { resove(true); }));
        expect(response).toBe(true);
    });

    it('test awaitWrap reject', async() => {
        const [err] = await awaitWrap(new Promise((resove, reject) => { reject(true); }));
        expect(null).not.toEqual(err);
    });
});
