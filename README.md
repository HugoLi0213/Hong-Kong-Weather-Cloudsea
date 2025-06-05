# 香港天氣和雲海 Hong Kong Weather & Cloudsea

本網站是一個現代化、無廣告的香港天氣與雲海預測平台，整合了香港天文台（HKO）及 Open-Meteo API，並提供18區天氣、雲海預測、空氣質素（AQHI）等功能。介面簡潔，手機與桌面皆友好，讓你快速獲得所需天氣資訊。

This is a modern, ad-free weather and cloudsea forecast site for Hong Kong, integrating HKO and Open-Meteo APIs. It provides 18-district weather, cloudsea prediction, AQHI, and more. The UI is clean and mobile-friendly, so you get what you need, fast.

---

## 主要功能 Features
- 18區天氣（香港天文台 API）/ 18-district weather (HKO API)
- 天氣總覽（Open-Meteo API）/ Weather overview (Open-Meteo API)
- 雲海預測（Open-Meteo API，支援逆溫層查詢教學）/ Cloudsea prediction (Open-Meteo API, with inversion layer info)
- 空氣質素指數（AQHI）/ Air Quality Health Index (AQHI)
- 行動裝置友善設計 / Mobile-friendly design

---

## 常見問題 FAQ

### Q: 資料來源是什麼？ What are the data sources?
- 天氣與雲海資料來自香港天文台開放數據及 Open-Meteo API。
- Weather and cloudsea data are from HKO Open Data and Open-Meteo API.

### Q: 這個網站有廣告嗎？ Is this site ad-free?
- 完全無廣告，純粹為天氣愛好者與攝影人設計。
- 100% ad-free, designed for weather enthusiasts and photographers.

### Q: 如何查詢逆溫層？ How to check for inversion layers?
- 請參考雲海預測頁的「逆溫層資料」彈窗，或直接查閱
  [天文台高空氣象觀測](https://www.hko.gov.hk/tc/out_photo/upper-air-weather.htm)。
- See the "Inversion Layer Info" popup in the cloudsea page, or check the
  [HKO Upper-air Weather Observation](https://www.hko.gov.hk/en/out_photo/upper-air-weather.htm).

---

## 頁面截圖 Screenshot

![網站截圖 Screenshot](public/Screenshot%202025-06-06%20at%2004.30.23.png)

---

## 開發與部署 Development & Deployment

### 本地開發環境 Setup a Development Environment locally

1. 安裝 Node.js / Install Node.js
   - https://nodejs.org
2. 安裝依賴 / Install dependencies
   - npm install
3. 啟動開發伺服器 / Start the app
   - npm run dev
   - 預設網址 http://localhost:5173

### 建立正式版 Build the app
- npm run build
- 產出於 dist/ 目錄，可直接部署。

### Docker
- 可參考 docker.md 以 Docker 方式部署。
- See docker.md for Docker deployment.

---

## 注意 Note
- 本專案為 React + Tailwind CSS 開發。
- 可自由 clone 與自架，僅供個人與學術用途。
- This project is built with React + Tailwind CSS. You can clone and self-host for personal/academic use.

---

> 天氣資料來源：香港天文台、Open-Meteo。
> Weather data sources: HKO, Open-Meteo.
