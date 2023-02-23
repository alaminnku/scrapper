import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

async function scrapeCBDJewellers() {
  try {
    // Create browser
    const browser = await puppeteer.launch({});

    try {
      // Create page
      const page = await browser.newPage();

      try {
        // Go to the page
        await page.goto("https://cbdjewellers.com/collections/mens-watches");

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

            // initiate watches details array
            const watchesDetails = [];

            // Loop through the urls and extract the data
            for (let i = 0; i < urls.length; i++) {
              try {
                // Go to watch page
                await page.goto(urls[i]);

                try {
                  // Scrape the details
                  const watchDetails = await page.evaluate(() => {
                    // Get the title
                    const title = document.querySelector(
                      "#shopify-section-product-template > div > div.container.container-fluid-mobile > div > div div > h1"
                    )?.textContent;

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
                    return { name: title, ...descriptionObject };
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

            console.log(watchesDetails);

            // Once done close the browser
            await browser.close();
          } catch (err) {
            throw err;
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
  } catch (err) {
    throw err;
  }
}

export default scrapeCBDJewellers;
