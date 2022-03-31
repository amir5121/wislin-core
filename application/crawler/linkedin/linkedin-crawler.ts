import { Browser, HTTPRequest, HTTPResponse, Page } from "puppeteer"
import { browserDefaults, linkedinCrawlLocations } from "./linkedin-constants"
import { logger } from "../../utils/logger"
import { LINKEDIN } from "../../config/constants"
import Job, { JobSchema } from "../../models/job"

const puppeteer = require("puppeteer")

class LinkedinCrawler {
  private static tag = "LinkedinCrawlerTag"
  private _browser: Browser | undefined = undefined

  private static async puppeteerResponseWatch(response: HTTPResponse) {
    if (response.status() === 429) {
      logger.warn(LinkedinCrawler.tag, "Error 429 too many requests")
    } else if (response.status() >= 400) {
      logger.warn(
        LinkedinCrawler.tag,
        response.status(),
        `Error for request ${response.request().url()}`
      )
    }
  }
  private static async puppeteerRequestFilter(request: HTTPRequest) {
    const url = new URL(request.url())
    const domain = url.hostname.split(".").slice(-2).join(".").toLowerCase()

    if (
      url.pathname.includes("li/track") ||
      !["linkedin.com", "licdn.com"].includes(domain)
    ) {
      return request.abort()
    }

    if (
      [
        "image",
        "stylesheet",
        "media",
        "font",
        "texttrack",
        "object",
        "beacon",
        "csp_report",
        "imageset",
      ].some((r) => request.resourceType() === r) ||
      request.url().includes(".jpg") ||
      request.url().includes(".jpeg") ||
      request.url().includes(".png") ||
      request.url().includes(".gif") ||
      request.url().includes(".svg") ||
      request.url().includes(".css")
    ) {
      return request.abort()
    }

    return request.continue()
  }

  async crawl(): Promise<void> {
    try {
      this._browser = await puppeteer.launch({
        ...browserDefaults,
        headless: false,
      })
    } catch (err) {
      console.log("Could not create a browser instance => : ", err)
      return
    }
    if (typeof this._browser !== "undefined") {
      const page = (await this._browser.pages())[0]
      await page.setRequestInterception(true)
      page.on("request", LinkedinCrawler.puppeteerRequestFilter)
      page.on("response", LinkedinCrawler.puppeteerResponseWatch)
      const pagesDetail = await LinkedinCrawler.listPageDetails(page, 1)
      for (let job of pagesDetail) {
        await Job.updateOne(
          { guid: job.guid, type: LINKEDIN },
          { ...job },
          { upsert: true, setDefaultsOnInsert: true }
        )
      }
    }
    await this.close()
  }

  private static async listPageDetails(
    page: Page,
    pageCount: number = 1
  ): Promise<JobSchema[]> {
    process.stdout.write(".")
    let pageDetails: JobSchema[] = []
    for (const location of linkedinCrawlLocations) {
      for (let i = 0; i < pageCount * 25; i += 25) {
        await page.goto(
          `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?geoId=${location}&f_TPR=r86400&position=25&pageNum=1&start=${i}`,
          {
            waitUntil: "load",
          }
        )
        const newJobLinks = await page.$$eval(".base-card__full-link", (x) => {
          return x.map((el) => el.getAttribute("href"))
        })
        console.log(
          "looking at",
          location,
          "found",
          newJobLinks.length,
          "links to crawl on",
          i,
          "iteration"
        )
        if (newJobLinks && newJobLinks.length > 0) {
          for (let link of newJobLinks as string[]) {
            logger.info(LinkedinCrawler.tag, `Scraping ${link}`)
            const pageDetail = await LinkedinCrawler.fetchDetail(page, link)
            pageDetails.push(pageDetail)
          }
        }
      }
    }
    return pageDetails
  }
  private static async fetchDetail(
    page: Page,
    pageUrl: string
  ): Promise<JobSchema> {
    await page.goto(pageUrl, {
      waitUntil: "load",
    })

    function extractCommentedJobId(element: string) {
      return element.split("-")[2]
    }
    const guid = extractCommentedJobId(
      await page.$$eval(
        "#jobId,#decoratedJobPostingId",
        (x) => x && (x[0] as HTMLElement).innerHTML
      )
    )
    let preparedJSON = undefined
    try {
      preparedJSON = await page.$eval(
        'script[type="application/ld+json"]',
        (x) => x && (x as HTMLElement).innerText
      )
    } catch (e) {
      logger.debug(LinkedinCrawler.tag, "Could not find prepared ld+json")
    }
    if (typeof preparedJSON !== "undefined" && Boolean(preparedJSON)) {
      const parsed = JSON.parse(preparedJSON)
      return {
        guid: guid,
        link: pageUrl,
        type: LINKEDIN,
        author: parsed.hiringOrganization.name,
        skills: [],
        title: parsed.title,
        description: parsed.description,
        publicationDate: new Date(parsed.datePosted),
        referenceUpdatedDate: new Date(),
        location: [
          parsed.jobLocation.address.addressLocality,
          parsed.jobLocation.address.addressRegion,
          parsed.jobLocation.address.addressCountry,
        ]
          .filter(Boolean)
          .join(", "),
        salaryMinValue: parsed.estimatedSalary?.value?.minValue,
        salaryMaxValue: parsed.estimatedSalary?.value?.maxValue,
        currency: parsed.estimatedSalary?.currency,
      }
    } else {
      let salary = undefined
      let currency: string = "USD"
      let salaryMinValue: number = 0
      let salaryMaxValue: number = 0
      try {
        salary = await page.$eval(
          ".compensation__salary",
          (x) => x && (x as HTMLElement).innerText
        )
        const salaryMinValueString = salary
          ?.split("-")[0]
          ?.match(/\d/g)
          ?.join("")
        if (typeof salaryMinValueString !== "undefined")
          salaryMinValue = parseInt(salaryMinValueString)
        const salaryMaxValueString = salary
          ?.split("-")[1]
          ?.match(/\d/g)
          ?.join("")
        if (typeof salaryMaxValueString !== "undefined")
          salaryMaxValue = parseInt(salaryMaxValueString)
        switch (salary[0]) {
          case "$":
            currency = "USD"
            break
          default:
            currency = "USD"
            break
        }
      } catch (e) {
        logger.info(`error parsing salary ${guid}`, this.tag, e)
      }
      return {
        guid: guid,
        link: pageUrl,
        type: LINKEDIN,
        skills: [],
        author: await page.$eval(
          ".sub-nav-cta__optional-url",
          (x) => x && (x as HTMLElement).innerText
        ),
        title: await page.$eval(
          ".top-card-layout__title",
          (x) => x && (x as HTMLElement).innerText
        ),
        description: await page.$eval(
          ".show-more-less-html__markup",
          (x) => x && (x as HTMLElement).innerText
        ),
        publicationDate: new Date(),
        referenceUpdatedDate: new Date(),
        location: await page.$eval(
          ".main-job-card__location",
          (x) => x && (x as HTMLElement).innerText
        ),
        salaryMinValue: salaryMinValue,
        salaryMaxValue: salaryMaxValue,
        currency: currency,
      }
    }
  }

  private close = async (): Promise<void> => {
    try {
      if (this._browser) {
        this._browser.removeAllListeners() && (await this._browser.close())
      }
    } finally {
      this._browser = undefined
    }
  }
}

new LinkedinCrawler().crawl().then(() => console.log("DONE"))
