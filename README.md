Weather API

A NestJS-based weather API that fetches current weather and forecast data from the OpenWeatherMap API and caches it for efficient performance.

## Features

- Fetch current weather data
- Fetch weather forecast data
- Caching for improved performance

## Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
- Redis (>= 6.x)
- PostgreSQL (>= 12.x)
- OpenWeatherMap API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd weather-api
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## API Endpoints

- `GET /weather/{city}`: Fetch current weather data for a city
- `GET /forecast/{city}`: Fetch weather forecast data for a city
- `POST /locations`: Add a new location
- `GET /locations`: Get all locations
- `DELETE /locations/{id}`: Remove a location by ID

## Caching Strategy (Stale-While-Revalidate)

The Weather API uses a Stale-While-Revalidate caching strategy to improve performance and reduce latency. When a request is made, cached data is served immediately while fresh data is fetched in the background and updated in the cache.

### Benefits:

- **Improved Response Time:** Immediate response with cached data.
- **Always Fresh Data:** Background updates ensure fresh data.
- **Reduced API Calls:** Optimizes API usage and minimizes rate-limiting issues.

## Usage

1. Obtain an API key from OpenWeatherMap.
2. Create a `.env` file in the root directory and add your API key and other variables:
   ```env
   OPENWEATHERMAP_API_KEY=your_api_key_here
   ```
3. Start the application:
   ```bash
   npm run start
   ```
4. Run the test:
   ```bash
   npm run test
   ```
5. The API will be available at `http://localhost:3000`.

## Testing

Postman collections for testing the API are provided in the `thunder-collections` folder in the root directory. You can import these collections into Postman or Thunder Client to test the API endpoints.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
