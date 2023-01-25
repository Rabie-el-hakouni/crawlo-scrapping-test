const puppeteer = require("puppeteer");
const Category = require("./src/models/category");
const Product = require("./src/models/product");

const waitForSeconds = async (s) => {
  return await new Promise((resolve) => setTimeout(resolve, s * 1000));
};

const InfiniteScrollIetms = async (page) => {
  await page.evaluate(async () => {
    const distance = 50;
    let totalHeight = 0;
    while (totalHeight < document.body.scrollHeight) {
      totalHeight += distance;
      window.scrollBy(0, distance);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  });
};

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
      const cookie_btn = await page.$(
        '[data-test="pwa-consent-layer-accept-all"]'
      );
      await cookie_btn?.evaluate((form) => form.click());
      // await page.waitForNavigation();
      //InfiniteScrollIetms;
      await waitForSeconds(5);
      await InfiniteScrollIetms(page);
    } catch (error) {
      console.log("2 - StartScrapping Function Error : " + error);
    }
    const products_data = await page.evaluate(() => {
      //get name of category
      const category = {
        name: document.querySelector("div > h1")?.outerText ?? "",
      };
      const data_products = [];
      const selected_products = document.querySelectorAll(
        '[data-test="mms-search-srp-productlist-item"]'
      );
      selected_products.forEach((handle_product) => {
        let product = {};
        const name =
          handle_product.querySelector('[data-test="product-title"]')
            ?.outerText ?? "";
        const url =
          handle_product
            .querySelector('[data-test="mms-product-list-item-link"]')
            ?.getAttribute("href") ?? "";
        const img_url =
          handle_product
            .querySelector("div > picture > img")
            ?.getAttribute("src") ?? "";
        const brand = name.match(/-\s*(\w+\s*\w+)/)[1].split(" ")[0];
        const specifications =
          handle_product
            .querySelector('[data-test="feature-list"]')
            ?.outerText.split("\n") ?? "";
        const newArray = [];
        for (let i = 0; i < specifications.length; i += 2) {
          let key = specifications[i];
          let value = specifications[i + 1];
          newArray.push({ key, value });
        }

        const price = handle_product.querySelector(".dbaUJY")?.outerText ?? 0;
        const availability = handle_product.querySelector(
          '[data-test="mms-delivery-online-availability_AVAILABLE"] > div'
        )
          ? "Instock"
          : "not Instock";
        let delivery = handle_product.querySelector(".ghLrFT")?.outerText ?? "";

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
        data_products.push(product);
      });
      return data_products;
    });
    browser.close();
    console.log("products scraped successfully");
    products_data.forEach((product) => {
      console.log(product);
    });
    // console.log(products_data)
    return products_data;
  } catch (error) {
    console.log("1 - StartScrapping Function Error : " + error);
  }
};

const saveDataScrapped = async (data_products) => {
  try {
    let category;
    if (data_products.length > 0) {
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

const clearCollections = async () => {
  try {
    await Product.db.dropCollection("products");
    await Category.db.dropCollection("categories");
  } catch (error) {
    console.log(error);
  }
};

const scrappAllUrls = async () => {
  try {
    const urls = [
      "https://www.mediamarkt.es/es/category/ssd-198.html",
      "https://www.mediamarkt.es/es/category/pendrives-y-memorias-usb-207.html",
      "https://www.mediamarkt.es/es/category/port%C3%A1tiles-gaming-158.html",
    ];
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
