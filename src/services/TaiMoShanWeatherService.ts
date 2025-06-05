// 大帽山專用天氣數據服務
export interface TaiMoShanWeatherData {
    temperature: number | null;
    humidity: number | null;
    windSpeed: number | null;
    windDirection: string | null;
    pressure: number | null;
    updateTime: string;
    dataAvailable: {
        temperature: boolean;
        humidity: boolean;
        wind: boolean;
    };
}

export class TaiMoShanWeatherService {
    private readonly baseUrl = 'https://data.weather.gov.hk/weatherAPI/opendata';
    
    async getTaiMoShanWeatherData(): Promise<TaiMoShanWeatherData> {
        try {
            const response = await fetch(
                `${this.baseUrl}/weather.php?dataType=rhrread&lang=tc`
            );
            if (!response.ok) {
                throw new Error(`天文台API錯誤: ${response.status}`);
            }
            const data = await response.json();
            return this.extractTaiMoShanData(data);
        } catch (error) {
            throw new Error(`獲取大帽山天氣數據失敗: ${error}`);
        }
    }
    
    private extractTaiMoShanData(apiData: any): TaiMoShanWeatherData {
        const tempData = apiData.temperature?.data?.find((item: any) => 
            item.place === '大帽山' || item.place.includes('大帽山')
        );
        const humidityData = apiData.humidity?.data?.find((item: any) => 
            item.place === '大帽山' || item.place.includes('大帽山')
        );
        const windData = apiData.wind?.data?.find((item: any) => 
            item.place === '大帽山' || item.place.includes('大帽山')
        );
        const pressureData = apiData.pressure?.data?.find((item: any) => 
            item.place === '大帽山' || item.place.includes('大帽山')
        );
        return {
            temperature: tempData?.value ?? null,
            humidity: humidityData?.value ?? null,
            windSpeed: windData?.value ?? null,
            windDirection: windData?.direction ?? null,
            pressure: pressureData?.value ?? null,
            updateTime: apiData.updateTime || new Date().toISOString(),
            dataAvailable: {
                temperature: !!tempData,
                humidity: !!humidityData,
                wind: !!windData
            }
        };
    }

    private calculateDewPoint(temperature: number, humidity: number): number {
        const a = 17.27;
        const b = 237.7;
        const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
        return (b * alpha) / (a - alpha);
    }

    // 取得詳細報告字串
    async getTaiMoShanDetailedReport(): Promise<string> {
        const weatherData = await this.getTaiMoShanWeatherData();
        let report = `大帽山天氣報告 (${new Date(weatherData.updateTime).toLocaleString('zh-HK')})\n`;
        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        if (weatherData.dataAvailable.temperature) {
            report += `🌡️ 氣溫: ${weatherData.temperature}°C\n`;
        } else {
            report += `🌡️ 氣溫: 數據暫不可用\n`;
        }
        if (weatherData.dataAvailable.humidity) {
            report += `💧 相對濕度: ${weatherData.humidity}%\n`;
        } else {
            report += `💧 相對濕度: 數據暫不可用\n`;
        }
        if (weatherData.dataAvailable.wind) {
            report += `💨 風速: ${weatherData.windSpeed} km/h\n`;
            report += `🧭 風向: ${weatherData.windDirection}\n`;
        } else {
            report += `💨 風速/風向: 數據暫不可用\n`;
        }
        if (weatherData.pressure) {
            report += `📊 氣壓: ${weatherData.pressure} hPa\n`;
        }
        if (weatherData.temperature && weatherData.humidity) {
            const dewPoint = this.calculateDewPoint(weatherData.temperature, weatherData.humidity);
            report += `🌫️ 露點溫度: ${dewPoint.toFixed(1)}°C\n`;
            report += `📏 溫度露點差: ${(weatherData.temperature - dewPoint).toFixed(1)}°C\n`;
        }
        return report;
    }
}
