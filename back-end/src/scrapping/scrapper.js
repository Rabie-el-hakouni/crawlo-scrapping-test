const puppeteer = require("puppeteer");
const Category = require("../models/category");
const Product = require("../models/product");

const url_category = "https://www.mediamarkt.es/es/category";

//wait for seconds
const waitForSeconds = async (s) => {
  return await new Promise((resolve) => setTimeout(resolve, s * 1000));
};

//scroll to the bottom of the page for load images
const InfiniteScrollIetms = async (page) => {
  await page.evaluate(async () => {
    const distance = 50;
    let totalHeight = 0;
    while (totalHeight < document.body.scrollHeight) {
      totalHeight += distance;
      window.scrollBy(0, distance);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  });
};
//start the scraping for each category
const startScrapping = async (url) => {
  try {
    console.log("start scrapping");
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url, { waitUntil: "load" });
    await page.waitForSelector("#main-content");
    try {
      await waitForSeconds(5);
      //accept coockies
      console.log("accepting coockies");
      await page.waitForSelector('[data-test="pwa-consent-layer-accept-all"]');
      const coockie_btn = await page.$(
        '[data-test="pwa-consent-layer-accept-all"]'
      );
      await coockie_btn?.evaluate((form) => form.click());
      //InfiniteScrollIetms;
      await waitForSeconds(4);
      console.log("scrolling");
      await InfiniteScrollIetms(page);
    } catch (error) {
      console.log("StartScrapping Function Error : " + error);
    }
    const products_data = await page.evaluate(() => {
      //get name of category
      const category = {
        name: document.querySelector("div > h1")?.outerText ?? "",
      };
      //get Products
      const data_products = [];
      const selected_products = document.querySelectorAll(
        '[data-test="mms-search-srp-productlist-item"]'
      );
      selected_products.forEach((handle_product) => {
        let product = {};
        //get name of product
        const name =
          handle_product.querySelector('[data-test="product-title"]')
            ?.outerText ?? "";
        //get url of product
        const url =
          handle_product
            .querySelector('[data-test="mms-product-list-item-link"]')
            ?.getAttribute("href") ?? "";
        //get image url of product
        const img_url =
          handle_product
            .querySelector("div > picture > img")
            ?.getAttribute("src") ?? "";
        //extract brand from name of product
        const brand = name.match(/-\s*(\w+\s*\w+)/)[1].split(" ")[0];
        //get specifications of product
        const specifications =
          handle_product
            .querySelector('[data-test="feature-list"]')
            ?.outerText.split("\n") ?? "";
        //convert the array of specifications to array of object [{"key" , "value"}]
        const newArray = [];
        if (specifications?.length > 0) {
          for (let i = 0; i < specifications.length; i += 2) {
            let key = specifications[i];
            let value = specifications[i + 1];
            newArray.push({ key, value });
          }
        }
        //get price of product
        const price = handle_product.querySelector(".dbaUJY")?.outerText ?? 0;
        //get availability of product
        const availability =
          handle_product.querySelector(
            '[data-test="mms-delivery-online-availability_AVAILABLE"] > div'
          )?.outerText ?? "";

        //get delivery of product
        let delivery = handle_product.querySelector(".ghLrFT")?.outerText ?? "";
        //create a product with the specified caracteristics
        product = {
          category,
          name,
          url: "https://www.mediamarkt.es" + url,
          img_url,
          specifications: newArray,
          price,
          brand,
          availability,
          delivery,
        };
        //add the product to the list of products
        data_products.push(product);
      });
      return data_products;
    });
    //clode the browser window
    browser.close();
    console.log("products scraped successfully");
    //just for debug
    products_data.forEach((product) => {
      console.log(product);
    });
    return products_data;
  } catch (error) {
    console.log("StartScrapping Function Error : " + error);
  }
};

//save data scrapped to database
const saveDataScrapped = async (data_products) => {
  try {
    let category;
    if (data_products?.length > 0) {
      category = await Category.findOne({
        name: data_products[0].category.name,
      });
      if (!category) {
        category = new Category({ name: data_products[0].category.name });
        category = await category.save();
      }
      data_products.forEach(async (product) => {
        product.category = category;
        const newProduct = new Product(product);
        await newProduct.save();
      });
    }
  } catch (error) {
    console.log("Save Data Function Error : " + error);
  }
};

//clear collections of products and categories
const clearCollections = async () => {
  try {
    await Product.db.dropCollection("products");
    await Category.db.dropCollection("categories");
  } catch (error) {
    console.log("clearCollections : " + error);
  }
};

//scrap specific categories url
const scrappAllUrls = async () => {
  try {
    const urls = [
      `${url_category}/ssd-198.html`,
      `${url_category}/pendrives-y-memorias-usb-207.html`,
      `${url_category}/port%C3%A1tiles-gaming-158.html`,
    ];
    //clear collection
    await clearCollections();
    for (let url of urls) {
      const data = await startScrapping(url);
      await saveDataScrapped(data);
    }
  } catch (error) {
    console.log("scrappAllUrls : " + error);
  }
};

module.exports = scrappAllUrls;
