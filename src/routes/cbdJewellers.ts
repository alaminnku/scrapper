import puppeteer from "puppeteer";
import express, { Request, Response } from "express";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

// Initiate router
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    // Launch browser
    const browser = await puppeteer.launch();

    try {
      // Create new page
      const page = await browser.newPage();

      // Target URLs
      const targets = [
        "https://cbdjewellers.com/collections/mens-watches",
        "https://cbdjewellers.com/collections/womens-watches",
      ];

      // initiate watches details array
      const watchesDetails = [];

      // Loop through the target URLs
      for (let i = 0; i < targets.length; i++) {
        try {
          // Go to the page
          await page.goto(targets[i], { timeout: 0 });

          try {
            // Scroll bottom of the page
            //@ts-ignore
            await scrollPageToBottom(page, {
              size: 500,
              delay: 500,
            });

            try {
              // Get all watch page urls
              const urls = await page.evaluate(() => {
                const linkNodes = document.querySelectorAll(
                  "#tt-pageContent > div > div > div > div > div > div.tt-product-listing.row > div > div > div > h2 > a"
                );

                // Convert and format DOM node list to array
                return Array.from(linkNodes).map(
                  (linkNode) =>
                    `https://cbdjewellers.com${linkNode.getAttribute("href")}`
                );
              });

              // Loop through the urls and extract the data
              for (let i = 0; i < urls.length; i++) {
                try {
                  // Go to watch page
                  await page.goto(urls[i], { timeout: 0 });

                  try {
                    // Scrape the details
                    const watchDetails = await page.evaluate(() => {
                      // Get the name
                      const name = document.querySelector(
                        "#shopify-section-product-template > div > div.container.container-fluid-mobile > div > div div > h1"
                      )?.textContent;

                      // Get the price
                      const price = document.querySelector(
                        "#shopify-section-product-template > div > div.container.container-fluid-mobile > div > div > div > div.tt-price > span.new-price > span"
                      )?.textContent;

                      // Get images
                      const imageNodes = document.querySelectorAll(
                        "#smallGallery > div > div > li.slick-slide a"
                      );

                      // Convert and format image DOM nodes to array
                      const images = Array.from(imageNodes).map(
                        (imageNode) =>
                          `http:${imageNode.getAttribute("data-image")}`
                      );

                      // Get the description
                      const descriptionNodes = document.querySelectorAll(
                        "#shopify-section-product-template > div > div.container.container-fluid-mobile > div > div > div > div.tt-collapse-block.prpage-tabs > div > div.tt-collapse-content > table > tbody > tr > td"
                      );

                      // Convert and format description DOM nodes to object
                      const descriptionObject = Array.from(descriptionNodes)
                        .map((detail) => (detail.textContent as string).trim())
                        .reduce((acc, curr, index, array) => {
                          // When index is even, add the element
                          // to the acc, else return the acc
                          if (index % 2 === 0 && curr) {
                            return { ...acc, [curr]: array[index + 1] };
                          } else {
                            return acc;
                          }
                        }, {});

                      // Return watch details object
                      return { name, ...descriptionObject, price, images };
                    });

                    // Add the watch details object to watches details array
                    watchesDetails.push(watchDetails);
                  } catch (err) {
                    throw err;
                  }
                } catch (err) {
                  throw err;
                }
              }
            } catch (err) {
              throw err;
            }
          } catch (err) {
            throw err;
          }
        } catch (err) {
          throw err;
        }
      }

      // Send the data with response
      res.status(200).json(watchesDetails);

      // Close the browser
      await browser.close();
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
});

export default router;
