const express = require('express');
const router = express.Router();
const { promotionsAxios } = require('../functions/axios');
const { getCurrentUrl, appendImageUrlPrefix } = require('../functions/general');

const getPromotion = async (slug, axios) => {
    const response = await axios.get(`/promotions/${slug}`);
    return response.data;
}

router.get('/', async (req, res) => {
    try {
        let currentUrl = getCurrentUrl(req.originalUrl, req.query.page);
        const response = await promotionsAxios(req).get(`/promotions`, { params: req.query });
        let data = response.data;

        const docs = [];
        const { limit, page } = data;

        let initPoint = (limit * page) - limit;

        for (x of data.docs) {
            initPoint += 1;
            const displayImage = appendImageUrlPrefix(x.displayImage);
            const newPage = { ...x, position: initPoint, displayImage };
            docs.push(newPage);
        }

        data.docs = docs;

        res.render('index', {
            pageTitle: "Promotions",
            data,
            currentUrl,
            home: true,
            activeMenu: 'home'
        });
        
    } catch (e) {
        console.log(e.message);
        res.sendStatus(500);
    }
});

router.get('/view/:slug', async (req, res) => {
    try {
        const promotion = await getPromotion(req.params.slug, req.promotionsAxios);
        promotion.displayImage = appendImageUrlPrefix(promotion.displayImage);
        res.render('promotion', {
            pageTitle: promotion.title,
            promotion
        });
    } catch (e) {
        console.log(e.message);
        res.sendStatus(500);
    }
});

router.get('/search', async (req, res) => {
    try {
        res.render('search', {
            pageTitle: 'Search Promotions',
            activeMenu: 'search',
            js: [
                "/scripts/axios.min.js",
                "/scripts/search.js"
            ]
        });
    } catch (e) {
        console.log(e.message);
        res.sendStatus(500);
    }
});

router.get('/search-promotions', async (req, res) => {
    try {
        const searchResponse = await promotionsAxios(req).get(`/promotions?query=${req.query.query}`);
        const results = searchResponse.data;
        const docs = [];
        for (x of results.docs) {
            const displayImage = appendImageUrlPrefix(x.displayImage);
            const newPromotion = { ...x, displayImage };
            docs.push(newPromotion);
        }
        results.docs = docs;
        res.json(results);
    } catch (e) {
        console.log(e.message);
        res.sendStatus(500);
    }
});

module.exports = router;