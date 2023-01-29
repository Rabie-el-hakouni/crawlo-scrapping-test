const puppeteer = require("puppeteer");
const Category = require("../models/category");
const Product = require("../models/product");

const url_category =
  "https://www.mediamarkt.es/es/category/inform%C3%A1tica-9.html";

//accepting
const acceptCoockies = async (page) => {
  try {
    console.log("accepting coockies");
    await page.waitForSelector('[data-test="pwa-consent-layer-accept-all"]');
    const coockieBtn = await page.$(
      '[data-test="pwa-consent-layer-accept-all"]'
    );
    if (coockieBtn) {
      await coockieBtn?.evaluate((form) => form.click());
    }
  } catch (error) {
    console.error("Accepting coockies :", error);
  }
};

const waitForSeconds = async (s) => {
  return await new Promise((resolve) => setTimeout(resolve, s * 1000));
};

const InfiniteScrollIetms = async (page) => {
  console.log("loading infinite scroll");
  await page.evaluate(async () => {
    const distance = 80;
    let totalHeight = 0;
    while (totalHeight < document.body.scrollHeight) {
      totalHeight += distance;
      window.scrollBy(0, distance);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  });
};

const getCategorie = async (page, url) => {
  try {
    await page.goto(url, { waitUntil: "load" });
    await page.waitForSelector("#main-content");
    await waitForSeconds(3);
    await acceptCoockies(page);
    // await page.$eval("#mms-app-header-category-button", (form) => form.click());

    const title = await page.evaluate(() => {
      return document.querySelector(
        "#main-content > div.StyledPageContent-sc-1x4mhgt-0.jhIfaI > div.StyledGrid-fs0zc2-0.glkuSS > div.StyledHead-h0srjn-0.fXJcOo > div.StyledHeadline-h0srjn-3.kZCMNb > div.StyledHeadingWrapper-sc-1phlfya-0.hBLzht > h1"
      ).textContent;
    });

    return { title, href: url };
  } catch (error) {
    console.error("getCategories :", error);
  }
};

const getSubCategories = async (page, category) => {
  await page.goto(category.href);
  const subcategories = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        "#main-content > div.StyledPageContent-sc-1x4mhgt-0.jhIfaI > div.StyledGrid-fs0zc2-0.glkuSS > div.StyledRow-x4c83j-0.dkJwDz > div.StyledCell-sc-1wk5bje-0.kfZaiK > div:nth-child(1) > div > div > div.BaseTypo-sc-1jga2g7-0.dbMgHm.StyledInfoTypo-sc-1jga2g7-1.gqYMkD > a"
      ),
      (subcategory) => {
        return {
          name: subcategory.textContent.trim(),
          href: subcategory.href,
        };
      }
    );
  });

  return subcategories;
};

const getBrands = async (page) => {
  console.log("getBrands");
  await page.waitForSelector(
    "#facet-Marca-content > div > div > div > div.StyledFacetWrapper-sc-10z95lj-0.fcOEDv > button"
  );
  const moreBrands = await page.$(
    "#facet-Marca-content > div > div > div > div.StyledFacetWrapper-sc-10z95lj-0.fcOEDv > button"
  );
  await moreBrands?.evaluate((form) => form.click());
};

const getProducts = async (page, subcategory, numberOfPages) => {
  var products = [];
  const category = subcategory;

  for (let i = 0; i < numberOfPages; i++) {
    console.log(`scrapping  : ${subcategory.href}?page=${i + 1}`);
    await page.goto(`${subcategory.href}?page=${i + 1}`);
    await getBrands(page);
    await InfiniteScrollIetms(page);
    await waitForSeconds(2);
    let products_scrapped = await page.evaluate(() => {
      const names = Array.from(
        document.querySelectorAll('[data-test="product-title"]'),
        (el) => el?.textContent ?? ""
      );

      const urls_products = Array.from(
        document.querySelectorAll('[data-test="mms-product-list-item-link"]'),
        (el) => "https://www.mediamarkt.es" + el?.getAttribute("href") ?? ""
      );

      const images_urls = Array.from(
        document.querySelectorAll("div > picture > img"),
        (el) => el?.getAttribute("src") ?? ""
      );

      const prices = Array.from(
        document.querySelectorAll(
          "#main-content > div.StyledPageContent-sc-1x4mhgt-0.jhIfaI > div.StyledGrid-fs0zc2-0.glkuSS > div > div.StyledCell-sc-1wk5bje-0.cWzVTa > div.ProductContainer-hvvgwa-1.iOKzCq > div > div> div > a > div > div.StyledCard-sc-1b4w28x-1.fuuvGx > div > div.StyledBox-sc-1vld6r2-0.knQzst.StyledFlexBox-sc-1w38xrp-2.fUYSPZ > div.StyledFlexItem-sc-1vld6r2-1.bCeaBK.StyledFlexItem-sc-1w38xrp-3.StyledPriceFlexItem-sc-1w38xrp-7.eKFLMV.faqpli > div.StyledPriceWrapper-sc-1h7lp7p-1.fVfjjJ > div > div > div > div:nth-child(2) > div > span.ScreenreaderTextSpan-sc-11hj9ix-0.dbaUJY"
        ),
        (el) => el?.outerText ?? ""
      );

      const specifications = Array.from(
        document.querySelectorAll(
          "#main-content > div.StyledPageContent-sc-1x4mhgt-0.jhIfaI > div.StyledGrid-fs0zc2-0.glkuSS > div > div.StyledCell-sc-1wk5bje-0.cWzVTa > div.ProductContainer-hvvgwa-1.iOKzCq > div > div > div > a > div > div.StyledCard-sc-1b4w28x-1.fuuvGx > div > div.StyledBox-sc-1vld6r2-0.knQzst.StyledFlexBox-sc-1w38xrp-2.fUYSPZ > div.StyledFlexItem-sc-1vld6r2-1.bCeaBK.StyledFlexItem-sc-1w38xrp-3.StyledFlexItemFeatureList-sc-1w38xrp-4.eKFLMV.bBiDDv > div > ul"
        ),
        (el) => {
          const spec = el?.outerText.split("\n") ?? "";
          const newArray = [];
          if (spec?.length > 0) {
            for (let i = 0; i < spec.length; i += 2) {
              let key = spec[i];
              let value = spec[i + 1];
              newArray.push({ key, value });
            }
          }
          return newArray;
        }
      );

      const availabilityAndDelivery = Array.from(
        document.querySelectorAll(
          "#main-content > div.StyledPageContent-sc-1x4mhgt-0.jhIfaI > div.StyledGrid-fs0zc2-0.glkuSS > div > div.StyledCell-sc-1wk5bje-0.cWzVTa > div.ProductContainer-hvvgwa-1.iOKzCq > div > div > div > a > div > div.StyledCard-sc-1b4w28x-1.fuuvGx > div > div.StyledBox-sc-1vld6r2-0.knQzst.StyledFlexBox-sc-1w38xrp-2.fUYSPZ > div.StyledFlexItem-sc-1vld6r2-1.bCeaBK.StyledFlexItem-sc-1w38xrp-3.StyledPriceFlexItem-sc-1w38xrp-7.eKFLMV.faqpli > div.StyledMediaStyleSwitch-sc-1s1z6np-0.brLofF.StyledMediaStyleSwitch-sc-1w38xrp-8.cjetwk > div > div:nth-child(1) > div > div"
        ),
        (el) => {
          if (el.outerText.split("\n").length == 2) {
            return {
              availability: el.outerText.split("\n")[0],
              delivery: el.outerText.split("\n")[1],
            };
          }
          return {
            availability: "",
            delivery: el.outerText,
          };
        }
      );

      let result = names.map((name, index) => {
        return {
          name,
          url: urls_products[index],
          price: prices[index],
          img_url: images_urls[index],
          availability: availabilityAndDelivery[index].availability,
          delivery: availabilityAndDelivery[index].delivery,
          specifications: specifications[index],
        };
      });
      return result;
    });
    const brands = await page.evaluate(() => {
      const brands =
        document.querySelector("#facet-Marca-content")?.outerText ?? "";
      const brandArray = brands
        .split("\n")
        .filter((brand) => brand !== "Buscar...")
        .map((brand) => brand.split(" ")[0]);
      return brandArray;
    });

    products = [...products, ...products_scrapped];
    products.map((product) => {
      let brand =
        brands.find((b) =>
          product.name.toLowerCase().includes(b.toLowerCase())
        ) ||
        product.name
          .match(/-\s*(\w+\s*\w+)/)[1]
          .split(" ")[0]
          .toUpperCase();
      product.brand = brand;
      product.category = category;
    });
    console.log(products);
  }
  return products;
};

const saveDataScrapped = async (data_products) => {
  try {
    let category;
    if (data_products?.length > 0) {
      category = await Category.findOne({
        name: data_products[0].category.name,
      });
      if (!category) {
        category = new Category({
          name: data_products[0].category.name,
          href: data_products[0].category.href,
        });
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
    console.log("Drop products collection");
    await Product.db.dropCollection("products");
    console.log("Drop categories collection");
    await Category.db.dropCollection("categories");
  } catch (error) {
    console.log("clearCollections : " + error);
  }
};

const scrapData = async (numberOfCategories = 1, numberOfPages = 1) => {
  console.log(
    `start scrapping ${numberOfCategories} categor(y)(ies) and ${numberOfPages} page(s) for each category`
  );
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  var category = await getCategorie(page, url_category);
  await waitForSeconds(1);
  var subcategories = await getSubCategories(page, category);
  await waitForSeconds(1);
  await clearCollections();
  for (let i = 0; i < numberOfCategories; i++) {
    const products = await getProducts(page, subcategories[i], numberOfPages);
    await await waitForSeconds(1);
    await saveDataScrapped(products);
  }
  //browser.close();
};

module.exports = scrapData;
