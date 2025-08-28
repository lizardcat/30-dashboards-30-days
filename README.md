# 30 Dashboards in 30 Days Challenge

Welcome to my **30 Dashboards in 30 Days** challenge! This repository contains 30 unique, functional dashboards built with real data sources and deployed on Netlify.

## Challenge Overview

The goal is simple: build one dashboard every day for 30 days, each solving a real problem or providing valuable insights using live data. Every dashboard is fully functional, responsive, and deployed as a separate Netlify site.

<a href="https://30-dashboards-30-days.netlify.app/" target="_blank">
  <img src="https://img.shields.io/badge/LIVE_DEMO-Click_Here-blue?style=for-the-badge&logo=github" />
</a>

## 📊 Dashboard Collection

| Day | Dashboard               | Description                                           | Live Demo                                                           | Status         |
| --- | ----------------------- | ----------------------------------------------------- | ------------------------------------------------------------------- | -------------- |
| 01  | GitHub Activity Tracker | Personal GitHub contribution and repository analytics | [View Demo](https://30-dashboards-30-days.netlify.app/dashboard-01) | ✅ Complete    |
| 02  | Weather Multi-City      | Real-time weather data for multiple locations         | [View Demo](https://30-dashboards-30-days.netlify.app/dashboard-02) | ✅ Complete    |
| 03  | Crypto Portfolio        | Cryptocurrency tracking and portfolio analysis        | [View Demo](https://30-dashboards-30-days.netlify.app/dashboard-03) | ✅ Complete    |
| 04  | Stock Market Watchlist  | Real-time stock prices and market trends              | [View Demo](https://30-dashboards-30-days.netlify.app/dashboard-04) | ✅ Complete    |
| 05  | News Aggregator         | Curated news from multiple sources                    | [View Demo](https://30-dashboards-30-days.netlify.app/dashboard-05) | ✅ Complete    |
| 06  | Air Quality Monitor     | Global air quality index tracker                      | [View Demo](#)                                                      | 🚧 In Progress |
| 07  | COVID-19 Statistics     | Regional pandemic data visualization                  | [View Demo](#)                                                      | ⏳ Planned     |
| 08  | NASA Space Gallery      | Astronomy picture of the day archive                  | [View Demo](#)                                                      | ⏳ Planned     |
| 09  | Transit Tracker         | Public transportation status and delays               | [View Demo](#)                                                      | ⏳ Planned     |
| 10  | Energy Consumption      | Global energy usage by country                        | [View Demo](#)                                                      | ⏳ Planned     |
| 11  | Website Analytics       | Mock analytics dashboard with insights                | [View Demo](#)                                                      | ⏳ Planned     |
| 12  | Social Media Metrics    | Engagement tracking dashboard                         | [View Demo](#)                                                      | ⏳ Planned     |
| 13  | E-commerce Sales        | Sales performance visualization                       | [View Demo](#)                                                      | ⏳ Planned     |
| 14  | Project Management      | Team productivity and task tracking                   | [View Demo](#)                                                      | ⏳ Planned     |
| 15  | Movie Ratings Hub       | Film ratings from multiple sources                    | [View Demo](#)                                                      | ⏳ Planned     |
| 16  | Recipe Nutrition        | Nutritional analysis of recipes                       | [View Demo](#)                                                      | ⏳ Planned     |
| 17  | Fitness Activity        | Personal workout and activity tracker                 | [View Demo](#)                                                      | ⏳ Planned     |
| 18  | Reading Progress        | Book tracking and reading analytics                   | [View Demo](#)                                                      | ⏳ Planned     |
| 19  | Music Statistics        | Listening habits and music discovery                  | [View Demo](#)                                                      | ⏳ Planned     |
| 20  | Habit Tracker           | Daily habit formation and streaks                     | [View Demo](#)                                                      | ⏳ Planned     |
| 21  | Budget Monitor          | Personal finance tracking dashboard                   | [View Demo](#)                                                      | ⏳ Planned     |
| 22  | Learning Progress       | Course completion and skill tracking                  | [View Demo](#)                                                      | ⏳ Planned     |
| 23  | Health Metrics          | Wellness and health data visualization                | [View Demo](#)                                                      | ⏳ Planned     |
| 24  | Travel Planner          | Trip planning and expense tracking                    | [View Demo](#)                                                      | ⏳ Planned     |
| 25  | Recipe Collection       | Meal planning and grocery lists                       | [View Demo](#)                                                      | ⏳ Planned     |
| 26  | Game Statistics         | Gaming performance and achievements                   | [View Demo](#)                                                      | ⏳ Planned     |
| 27  | Plant Care Tracker      | Garden and houseplant management                      | [View Demo](#)                                                      | ⏳ Planned     |
| 28  | Time Tracker            | Productivity and time management                      | [View Demo](#)                                                      | ⏳ Planned     |
| 29  | Goal Tracker            | Personal and professional goal tracking               | [View Demo](#)                                                      | ⏳ Planned     |
| 30  | Challenge Reflection    | Analytics of the entire 30-day journey                | [View Demo](#)                                                      | ⏳ Planned     |

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla & React)
- **Styling:** Tailwind CSS, Custom CSS
- **Charts:** Chart.js, D3.js
- **Deployment:** Netlify

## 📈 Progress Tracking

- **Start Date:** 10/08/25
- **Target Completion:** 10/09/25
- **Current Progress:** 2/30 dashboards complete
- **Streak:** 2 days

## 📝 Daily Log

### Day 1 - GitHub Activity Tracker

- **Focus:** Personal GitHub analytics and contribution visualization
- **Key Features:** Commit history, repository stats, language breakdown
- **Challenges:** GitHub API rate limiting (it's supposed to be 60 requests an hour, but I seem to get limited way faster), data visualization (It seems GitHub doesn't allow scraping data older than 30 days?)
- **Learnings:** Creating a working heatmap for contributions that's similar to GitHub's is proving to be difficult. I gave up.

### Day 2 - Multi-City Weather Tracker

- **Focus:** A simple weather tracker that uses the OpenWeather API to pull real-time data for various cities in Africa and the world.
- **Key Features:** Weather data + temperature in C & F, search functionality for any city in the world
- **Challenges:** Setting up OpenWeather API and securely using it with Netlify
- **Learnings:** It's actually pretty easy to integrate the OpenWeather API. Like Streamlit, Netlify lets you easily add secret variables like API keys.

### Day 3 - Cryptocurrency Tracker

- **Focus:** A simple crypto tracker that uses CoinGecko's free API to pull 7-day data for various coins. Supports personal portfolio holdings
- **Key Features:** CoinGecko API-powered chart and prices + portfolio holdings section
- **Challenges:** Making the portfolio holdings section proved challenging, but AI proved useful for learning.
- **Learnings:** It's nice that CoinGecko let's people use their API for free. You don't even need to sign up!

### Day 4 - Stock Market Watchlist

- **Focus:** Real-time stock market dashboard using Alpha Vantage's free API to track stock prices, changes, and basic market data with an interactive watchlist feature.
- **Key Features:** Live stock price updates, search functionality for adding stocks, expandable 30-day price charts, market overview with sector distribution, and portfolio-style watchlist management.
- **Challenges:** Alpha Vantage's free tier limits you to 5 API calls per minute, so I had to implement smart rate limiting and use mock data for most stocks to avoid hitting quotas. The environment variable setup for Vite (using import.meta.env instead of process.env) was also a learning curve.
- **Learnings:** API rate limiting is a real constraint that affects UX design - you have to balance live data with performance. Alpha Vantage provides solid financial data but requires an API key and careful request management. The stock market visualization patterns are quite different from crypto - more focus on traditional metrics like P/E ratios and market cap.

**### Day 5 - Global News Hub**

- **Focus:** A comprehensive news aggregator dashboard using NewsAPI to deliver real-time headlines with search, filtering, and bookmarking capabilities across multiple countries and categories.
- **Key Features:** Live news feeds from 150,000+ sources, intelligent search with fallback mechanisms, country/category filtering with priority given to high-coverage markets, session-based bookmarking system, and responsive card-based layout with image previews and relative timestamps.
- **Challenges:** NewsAPI's free tier restricts the `/everything` endpoint for production use, requiring fallback strategies between different endpoints. Rate limiting (1000 requests/day) meant implementing search debouncing and smart caching. The API's inconsistent data quality required extensive filtering to remove `[Removed]` content and handle missing images gracefully.
- **Learnings:** News APIs have different coverage quality by region - US/UK sources are much more reliable than smaller markets. User experience suffers when search feels laggy, so debouncing search input (500ms delay) dramatically improves the feel while reducing API calls. Bookmarking without localStorage teaches you to appreciate browser storage - managing state in memory works for demos but highlights the need for persistence in real apps. The visual hierarchy of news content (headline > source > timestamp > description) follows established patterns that users expect.

_[Daily entries will be added as each dashboard is completed]_

## 🔗 Connect

- **LinkedIn:** [linkedin.com/in/aa-raza](https://www.linkedin.com/in/aa-raza)
- **Bluesky:** [bsky.app/profile/alexraza.tech](https://bsky.app/profile/alexraza.tech)

---

_Follow along as I build 30 dashboards in 30 days and document the entire journey!_
