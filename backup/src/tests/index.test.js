describe('Structure HTML de base', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    require('../js/index.js');
  });

  test('devrait avoir une en-tête avec le logo Oguste', () => {
    const header = document.querySelector('header');
    const logo = header.querySelector('.logo');
    expect(header).toBeTruthy();
    expect(logo).toBeTruthy();
    expect(logo.textContent).toContain('Oguste');
  });

  test('devrait avoir une zone de navigation principale', () => {
    const nav = document.querySelector('nav.main-nav');
    expect(nav).toBeTruthy();
    const menuItems = nav.querySelectorAll('ul li');
    expect(menuItems.length).toBeGreaterThan(0);
  });

  test('devrait avoir une zone principale de contenu', () => {
    const main = document.querySelector('main');
    const uploadSection = main.querySelector('#upload-section');
    const documentList = main.querySelector('#document-list');
    expect(main).toBeTruthy();
    expect(uploadSection).toBeTruthy();
    expect(documentList).toBeTruthy();
  });
});
