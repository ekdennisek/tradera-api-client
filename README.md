# Tradera API client

This package enables a user to use the official Tradera API from withing their JavaScript/TypeScript projects. **At the moment, only a subset of the *PublicService* has been implemented**.

## Installation

```
npm install tradera-api-client
```

## Usage

### Initialization

```
import { TraderaApiClient } from "tradera-api-client";

try {
    const appId = "secret"; // Retrieved from Tradera's developer center
    const appKey = "also secret"; // Retrieved from Tradera's developer center
    const apiClient = new TraderaApiClient(appId, appKey);
    await apiClient.init();
} catch (e) {
    console.log(`Error while initializing the API client: ${e});
}
```

### Calling API methods

The Tradera API is divided into six SOAP services: `BuyerService`, `ListingService`, `OrderService`, `PublicService`, `RestrictedService` and `SearchService`. These are exposed through instance variables of TraderaApiClient. For instance, this is how you call `GetOfficialTime` to retrieve the time from Tradera:

```
try {
    const officialTime = await apiClient.publicService.GetOfficalTime();
    console.log(`Official time is ${officialTime}`);
} catch (e) {
    console.log(`Error while fetching the time from Tradera: ${e});
}
```

# Contributing

Feel free to send pull requests.
