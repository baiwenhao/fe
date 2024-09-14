import getPageTitle from '@/common/utils/get-page-title.js';

describe('test page title', () => {
    it('page title exist', () => {
        const pageTitle = getPageTitle('test');
        console.log('pageTitle', pageTitle);
        expect(pageTitle).toBe('test - MA开发管理平台');
    });
    // it('page title not exist', () => {
    //     const pageTitle = getPageTitle('');
    //     expect(pageTitle).toBe('MA开发管理平台');
    // });
});
