// Mapeo de logos de fabricantes
const BRAND_LOGOS = {
    'INSPIRE': 'https://www.leroymerlin.es/dw/image/v2/BCJL_PRD/on/demandware.static/-/Library-Sites-LeroyMerlinSharedLibrary/default/dw0a8f9c0d/marques/inspire.webp',
    'PHILIPS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Philips_logo_new.svg/320px-Philips_logo_new.svg.webp',
    'OSRAM': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/OSRAM_logo.svg/320px-OSRAM_logo.svg.webp',
    'BOSCH': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Bosch-logo.svg/320px-Bosch-logo.svg.webp',
    'MAKITA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Makita_logo.svg/320px-Makita_logo.svg.webp',
    'BLACK+DECKER': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Black_%26_Decker_logo.svg/320px-Black_%26_Decker_logo.svg.webp',
    'STANLEY': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Stanley_Black_%26_Decker_logo.svg/320px-Stanley_Black_%26_Decker_logo.svg.webp',
    'DEXTER': 'https://www.leroymerlin.es/dw/image/v2/BCJL_PRD/on/demandware.static/-/Library-Sites-LeroyMerlinSharedLibrary/default/dw6d8e8c8e/marques/dexter.webp',
    'FISCHER': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Fischer_Logo.svg/320px-Fischer_Logo.svg.webp',
    'WOLFCRAFT': 'https://www.wolfcraft.de/typo3conf/ext/template/Resources/Public/Images/logo.svg',
    'SENSEA': 'https://www.leroymerlin.es/dw/image/v2/BCJL_PRD/on/demandware.static/-/Library-Sites-LeroyMerlinSharedLibrary/default/dw8e9f9c0d/marques/sensea.webp',
    'COOKE&LEWIS': 'https://www.leroymerlin.es/dw/image/v2/BCJL_PRD/on/demandware.static/-/Library-Sites-LeroyMerlinSharedLibrary/default/dw7a8b9c0d/marques/cooke-lewis.webp',
    'GROHE': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Grohe_logo.svg/320px-Grohe_logo.svg.webp',
    'ROCA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Roca_logo.svg/320px-Roca_logo.svg.webp',
    'JACOB DELAFON': 'https://www.jacobdelafon.fr/sites/all/themes/jd_theme/logo.webp',
    'SIEMENS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Siemens-logo.svg/320px-Siemens-logo.svg.webp',
    'DELINIA': 'https://www.leroymerlin.es/dw/image/v2/BCJL_PRD/on/demandware.static/-/Library-Sites-LeroyMerlinSharedLibrary/default/dw9e8f9c0d/marques/delinia.webp',
    'LUXENS': 'https://www.leroymerlin.es/dw/image/v2/BCJL_PRD/on/demandware.static/-/Library-Sites-LeroyMerlinSharedLibrary/default/dw1a2b3c4d/marques/luxens.webp',
    'TOLLENS': 'https://www.tollens.com/sites/default/files/logo-tollens.webp',
    'V33': 'https://www.v33.fr/themes/custom/v33/logo.svg',
    'HAMMERITE': 'https://www.hammerite.fr/sites/hammerite_fr/themes/akzonobel/logo.svg',
    'XILAZEL': 'https://www.leroymerlin.es/dw/image/v2/BCJL_PRD/on/demandware.static/-/Library-Sites-LeroyMerlinSharedLibrary/default/dw2b3c4d5e/marques/xylazel.webp',
    'PATTEX': 'https://www.pattex.es/content/dam/brands/pattex/spain_es/Pattex_Master_Logo.png.rendition.767.767.webp',
    'SPIT': 'https://www.spit.fr/themes/custom/spit/logo.svg',
    'LEXMAN': 'https://www.leroymerlin.es/dw/image/v2/BCJL_PRD/on/demandware.static/-/Library-Sites-LeroyMerlinSharedLibrary/default/dw3c4d5e6f/marques/lexman.webp',
    'LEDVANCE': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/LEDVANCE_logo.svg/320px-LEDVANCE_logo.svg.webp'
};

// Logo por defecto si no encontramos la marca
const DEFAULT_LOGO = 'https://www.leroymerlin.es/dw/image/v2/BCJL_PRD/on/demandware.static/-/Library-Sites-LeroyMerlinSharedLibrary/default/dw0f1e2d3c/logo-leroy-merlin.webp';

function getBrandLogo(brand) {
    return BRAND_LOGOS[brand] || DEFAULT_LOGO;
}
