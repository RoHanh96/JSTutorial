const puppeteer = require('puppeteer');
const download = require('image-downloader');

(async () => {

    //Open a new browser and go to kenh14.vn page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://kenh14.vn/ai-roi-cung-khac-cac-hot-girl-nay-cung-khong-ngoai-le-khi-vong-1-cu-ngay-cang-phong-phao-20171207193958533.chn';
    await page.goto(url, { waitUntil: 'networkidle2' });

    //Get 'veu' img
    const imgLinks = await page.evaluate(() => {
        let imgElements = document.querySelectorAll('.sp-img-zoom > img, .sp-img-lightbox > img, .detail-img-lightbox > img');
        imgElements = [...imgElements];
        let imgLinks = imgElements.map(i => i.getAttribute('src'));
        return imgLinks;
    });    
    console.log(imgLinks);
    
    //Download img to current folder
    await Promise.all(imgLinks.map(imgUrl => download.image({
        url: imgUrl,
        dest: __dirname
    })));
    
    await browser.close();
})();