import { Browser, HTTPRequest, HTTPResponse, Page } from "puppeteer"
import { browserDefaults } from "./linkedin-constants"
import { logger } from "../../utils/logger"

const puppeteer = require("puppeteer")

class LinkedinCrawler {
  private static tag = "LinkedinCrawlerTag"
  private _browser: Browser | undefined = undefined

  private static async puppeteerResponseWatch(response: HTTPResponse) {
    if (response.status() === 429) {
      logger.warn(
        LinkedinCrawler.tag,
        "Error 429 too many requests. You would probably need to use a higher 'slowMo' value and/or reduce the number of concurrent queries."
      )
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

    // Block tracking and 3rd party requests
    if (
      url.pathname.includes("li/track") ||
      !["linkedin.com", "licdn.com"].includes(domain)
    ) {
      return request.abort()
    }

    // It optimization is enabled, block other resource types
    const resourcesToBlock = [
      "image",
      "stylesheet",
      "media",
      "font",
      "texttrack",
      "object",
      "beacon",
      "csp_report",
      "imageset",
    ]

    if (
      resourcesToBlock.some((r) => request.resourceType() === r) ||
      request.url().includes(".jpg") ||
      request.url().includes(".jpeg") ||
      request.url().includes(".png") ||
      request.url().includes(".gif") ||
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
      await LinkedinCrawler.listLinks(page, 2)
    }
    await this.close()
  }

  private static async listLinks(
    page: Page,
    pageCount: number = 1
  ): Promise<string[]> {
    let links: string[] = []
    for (let i = 0; i < pageCount * 25; i += 25) {
      await page.goto(
        `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?geoId=103644278&f_TPR=r86400&position=25&pageNum=1&start=${i}`,
        {
          waitUntil: "load",
        }
      )
      const newJobLinks = await page.$$eval(".base-card__full-link", (x) => {
        return x.map((el) => el.getAttribute("href"))
      })

      links = links.concat(newJobLinks as string[])
    }
    console.log("@#!@#links", links.length)
    return links
  }

  private close = async (): Promise<void> => {
    // try {
    //   if (this._browser) {
    //     this._browser.removeAllListeners() && (await this._browser.close())
    //   }
    // } finally {
    //   this._browser = undefined
    // }
  }
}

new LinkedinCrawler().crawl().then((r) => console.log("DONE"))

const x = {
  "@context": "http://schema.org",
  "@type": "JobPosting",
  datePosted: "2022-03-29T05:21:22.000Z",
  description:
    "Entry Level Electrical Engineer needed for rapidly growing Green Energy Engineering firm. This is a permanent opportunity with excellent benefits.&lt;br&gt;&lt;br&gt;&lt;strong&gt;Who:&lt;/strong&gt; Green Energy Consulting Firm&lt;br&gt;&lt;br&gt;&lt;strong&gt;What:&lt;/strong&gt; Entry Level Electrical Engineer&lt;br&gt;&lt;br&gt;&lt;strong&gt;When:&lt;/strong&gt; Immediate Need&lt;br&gt;&lt;br&gt;&lt;strong&gt;Where:&lt;/strong&gt; Atlanta, GA&lt;br&gt;&lt;br&gt;&lt;strong&gt;Why:&lt;/strong&gt; Growth&lt;br&gt;&lt;br&gt;&lt;strong&gt;Salary&lt;/strong&gt;: $65k +/- plus benefits&lt;br&gt;&lt;br&gt;&lt;strong&gt;Duties&lt;/strong&gt;:&lt;br&gt;&lt;br&gt;The candidate will provide engineering support work and project management. This will include design and drafting of contract drawings, responding to contractor Requests for Information, reviewing shop drawings to ensure compliance with design requirements and other related design/engineering duties. The candidate should have a good understanding of the National Electrical Code and electrical power engineering principles and will utilize electrical engineering knowledge related to voltage, current, power, voltage drop, cable sizes, and conduit size requirements per NEC.&lt;br&gt;&lt;br&gt;&lt;strong&gt;Requirements:&lt;br&gt;&lt;/strong&gt;&lt;ul&gt;&lt;li&gt;The client is looking for 0-2 years of experience&lt;/li&gt;&lt;li&gt;Strong Organizational Skills&lt;/li&gt;&lt;li&gt;Strong Excel skills - ability to manage large complex spreadsheets&lt;br&gt;&lt;br&gt;&lt;/li&gt;&lt;/ul&gt;Powered by JazzHR&lt;br&gt;&lt;br&gt;mRLqKnevS9",
  employmentType: "FULL_TIME",
  hiringOrganization: {
    "@type": "Organization",
    name: "NorthPoint Search Group",
    sameAs: "https://www.linkedin.com/company/northpointsearchgroup",
    logo: "https://media-exp1.licdn.com/dms/image/C4E0BAQH4LOo2AnYAoA/company-logo_200_200/0/1529624256009?e=1656547200&amp;v=beta&amp;t=YnjQx_4a0FJgU6_FZHqkM2eORLN1tI5yuQ5Aohjkzxo",
  },
  identifier: {
    "@type": "PropertyValue",
    name: "NorthPoint Search Group",
    value: "4494763",
  },
  image:
    "https://media-exp1.licdn.com/dms/image/C4E0BAQH4LOo2AnYAoA/company-logo_100_100/0/1529624256009?e=1656547200&amp;v=beta&amp;t=W9NKdnqWoYXb5sZiwidOZlurpQMEiYAn18oarUcMb88",
  industry: "Staffing and Recruiting",
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressLocality: "Atlanta",
      addressRegion: "GA",
      streetAddress: null,
    },
    latitude: 33.748547,
    longitude: -84.3915,
  },
  skills: "",
  title: "Entry Level Electrical Engineer",
  validThrough: "2022-04-28T05:21:22.000Z",
  educationRequirements: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "bachelor degree",
  },
  experienceRequirements: "no requirements",
  estimatedSalary: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: {
      "@type": "QuantitativeValue",
      minValue: 58000,
      maxValue: 84000,
      unitText: "YEAR",
    },
  },
}

const vx = {
  "@context": "http://schema.org",
  "@type": "JobPosting",
  datePosted: "2022-03-29T04:15:47.000Z",
  description:
    "Lockheed Martin is looking for passionate and high performing Software Engineers to become part of the Operations Analysis (OA) and Laser Weapon System Simulation (LWSSim) development team within the Rotary &amp;amp; Mission Systems Business area. OA and LWSSim efforts help shape the future of Lockheed Martin and the Customer’s strategies by conducting studies and analysis on wide ranging scenarios that the warfighter may engage in, identifying gaps, and proposing solutions. Being part of this organization will allow an individual to help shape and impact the future of military tactics and technology.&lt;br&gt;&lt;br&gt;A developer within this role will focus on creating the building blocks of virtual battlefield simulations, including developing new capabilities and updating the Directed Energy Laser Weapon System Simulation (LWSSim), creating new models (to support the analyst team), and conducting integration of various models &amp;amp; simulations. Directed Energy efforts will be in conjunction with laser weapon programs such as HELIOS and allow the selected individual to work with and learn from program representatives as they support required development and analysis on the effects of adding Directed Energy to the battlefield.&lt;br&gt;&lt;br&gt;The team is looking for self-sufficient Software Engineers that can effectively utilize skills in C++, Python, Amazon Web Services (AWS), Git and Linux. The team values learning and talented individuals who are passionate about working on cutting-edge design or technology, comfortable with ambiguity, enjoy being part of a team, driven to learn and explore new areas, and willing to think strategically / creatively with proven analytical &amp;amp; engineering problem-solving skills.&lt;br&gt;&lt;br&gt;As a member of the development team, you will work in an Agile environment and have the opportunity for projects at the RMS business area level and also with the Corporate team (cross-business area opportunities). These efforts will drive/support various studies, quantify the impact of new operational concepts (CONOPS), system design variants, payloads, weapons and tactics, and force size/mix on survivability and mission effectiveness.&lt;br&gt;&lt;br&gt;&lt;strong&gt;&lt;u&gt;Responsibilities Will Include But Are Not Limited To&lt;br&gt;&lt;/u&gt;&lt;/strong&gt;&lt;ul&gt;&lt;li&gt; Software Development on the advancement of Laser Weapon System Simulation (LWSSim)&lt;/li&gt;&lt;li&gt; Creating models of current and future products to be utilized in multiple Modeling &amp;amp; Simulation tools&lt;/li&gt;&lt;li&gt; Development of plug-ins for existing Modeling &amp;amp; Simulation tools&lt;/li&gt;&lt;li&gt; Integrating multiple tools together to create interoperability, pipelines and automation&lt;/li&gt;&lt;li&gt; Researching military systems performance and operations&lt;/li&gt;&lt;li&gt; Modeling military systems and scenarios in digital environments&lt;/li&gt;&lt;li&gt; Conducting battlefield simulations at various mission scales&lt;/li&gt;&lt;li&gt; Analyzing simulation results to draw meaningful conclusions&lt;/li&gt;&lt;li&gt; Preparing reports/briefings and presenting analysis results&lt;/li&gt;&lt;li&gt; Support RMS and cross-LM business area constructive digital simulations, virtual reconstructive events, and studies&lt;br&gt;&lt;/li&gt;&lt;/ul&gt;The selected candidate will be expected to work with some oversight/direction, help determine sprint objectives and team approaches to execution. This Software Engineer will develop and provide solutions to a variety of technical problems of moderate to advanced scope and complexity, be up to date on the latest developments in the subject areas and take initiative to improve the overarching development environment. Occasional travel to support cross business area events or Laser Weapon System efforts may be required.",
  employmentType: "FULL_TIME",
  hiringOrganization: {
    "@type": "Organization",
    name: "Lockheed Martin",
    sameAs: "https://www.linkedin.com/company/lockheed-martin",
    logo: "https://media-exp1.licdn.com/dms/image/C4D0BAQH-F0QK2LbBzw/company-logo_200_200/0/1519855895078?e=1656547200&amp;v=beta&amp;t=HffZy4f9Oes3gLjV-3ZADLii11DrYkl9DN9iJPuiUC4",
  },
  identifier: {
    "@type": "PropertyValue",
    name: "Lockheed Martin",
    value: "9a2e43854ea28ec30ce4573475452a08",
  },
  image:
    "https://media-exp1.licdn.com/dms/image/C4D0BAQH-F0QK2LbBzw/company-logo_100_100/0/1519855895078?e=1656547200&amp;v=beta&amp;t=fVfhzREy4RI8lC3zh1BhhJFRqRhMygz2l6wALwCypfk",
  industry: "Defense and Space Manufacturing",
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressLocality: "Bothell East",
      addressRegion: "WA",
      streetAddress: null,
    },
    latitude: 47.812515,
    longitude: -122.179726,
  },
  skills: "",
  title: "Software Engineer",
  validThrough: "2022-04-28T04:15:47.000Z",
  educationRequirements: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "bachelor degree",
  },
}
