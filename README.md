# Answers to Quizes

## Tutorial II - Apify SDK

1. Question: Where and how you can use JQuery with the SDK?

- Answer: JQuery can be used inside `pageFunction` on `apify/webscraper` actor. It will be passed by SDK as `$` argument.
  \*NOTE: Even though I answered this question it is still vague for me. I am working on it.

2. Question: What is the main difference between `Cheerio` and `JQuery`?

- Answer: `JQuery` runs inside a browser and `Cheerio` is developed for use with `Node.js` server. We cannot use `JQuery` on server side so `Cheerio` is create for server side usage.

3. Question: When would you use `CheerioCrawler` and what are its limitations?

- Answer: You should use `CheerioCrawler` when html content display does not depend on javascript, because `CheerioCrawler` is blind to javascript and
  cannot handle javascript.

4. Question: What are the main classes for managing requests and when and why would you use one instead of another?

- Answer:
  - `Request` class : determines where the crawler will go and holds information about single url. And as far as I understood it is mostly used
    with `RequestList` and `RequestQueue` classes;
  - `RequestList` class: is a container for predetermined `urls` for a `crawler`. `RequestList` holds static (immutable) list of `Request` class instances
    and is used when the actual urs to be crawled are khown beforhand.
  - `RequestQueue` class: is a container for dynamically generated urls. `RequestQueue` contains dynamically generated(added) list of `Request` class instances. `RequestQueue` is used when the actual urls to be crawled is unkhown and will be discovered during the crawling process.
  - One example is: when crawling a website with millions of pages.

5. Question: How can you extract data from a page in Puppeteer without JQuery?

- Answer: With Puppeteer you extract data using features built into Puppeteer itself. As far as I know you are not required to use JQuery with Puppeteer. The data could be queried and extracted with following list of functions and one way of accessing them is
  from `Puppeteer's` `page` instance :
  - `page.$(selector)`,
  - `page.$$(selector)`,
  - `page.$$eval(selector, pageFunction[, ...args])`,
  - `page.$eval(selector, pageFunction[, ...args])`,
  - `page.title()`,
  - `page.evaluate()`
    ! IMPORTANT. Also `$` and `$$` signs are used by Puppeteer API it has nothing todo with JQuery. These signs are shortcuts for `document.querySelector()` and `document.querySelectorAll()`

6. Question: What is the default concurrency/parallelism the SDK uses?

- Answer: the default concurrency/parallelism is 50. But it also could be less, if there is less CPU reasources available than required.

## Tutorial III Apify Actors & Webhooks

1. Question: How do you allocate more CPU for your actor run?

- Answer:

  1. First option (by setting actor run options):

     1. Navigate to Apify app dashboard;
     2. Select an actor and navigate to actor's detail page;
     3. Under source tab, below Developer console, select options tab.
     4. from there you can set timeout, memory or CPU.

  2. Second option(by setting task run options):

     1. Navigate to Apify app dashboard;
     2. Select a task of a specific actor and navigate to it's detail page;
     3. navigate to setting tab;
     4. from there you can set timeout, memory or CPU.

     Note: And I think memory allocation to an actor also should be possible from Apify API enpoint. But I have not exlored Apify API fully yet.

2. Question: How can you get exact time when the actor was started from within the running actor process?

- Answer: By accessing `process.env.APIFY_STARTED_AT` environment variable you can get exact time when the actor was started.

3. Which are the default storages an actor run is allocated (connected to)?

- Answer: There are currently three types of default storages allocated to an actor run:
  - `default key-value`
  - `default dataset`
  - `default request queue`

4. Question: Can you change the memory allocated to a running actor?

- Answer: You cannot change the memory allocated to an actor if the actor is already running. But you can run the actor with a new set of configurations
  (like timeout, memory or CPU).

5. Question: How can you run actor with Puppeteer in a headful (non-headless) mode?

- Answer:

  - First option: (Synchronous run)

  ```
  const browser = await Apify.launchPuppeteer({ headless: false })

  ```

  - Second option:

  ```
  const crawler = new Apify.PuppeteerCrawler({
   launchPuppeteerOptions: {
   headless: false
   }
   })

  ```

6. Question: Imagine the server/instance the container is running on has a 32 GB, 8-core CPU.What would be the most performant (speed/cost)
   memory allocation for CheerioCrawler? (Hint: Nodejs process cannot user user created thread)

- Answer:
