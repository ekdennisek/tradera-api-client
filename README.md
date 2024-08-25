# Tradera API client

This package enables a user to use the official Tradera SOAP API from withing their JavaScript/TypeScript projects.
**At the moment, only a subset of the _PublicService_ has been implemented**.

Please be aware that the API may change drastically until version 1.0.0 has been reached.

## Installation

```
npm install tradera-api-client
```

## Usage

Make sure to set the environment variables `TRADERA_APP_ID` and `TRADERA_APP_KEY`.

### Calling API methods

The Tradera API is divided into six SOAP services: `BuyerService`, `ListingService`, `OrderService`, `PublicService`, `RestrictedService` and `SearchService`. Import the one(s) you wish to use. For instance, this is how you call `GetOfficalTime` to retrieve the time from Tradera:

```
import { PublicService } from "tradera-api-client";

const publicService = new PublicService();
const officalTime = await publicService.GetOfficalTime();
```

# Contributing

Feel free to send pull requests. The WSDL description of the SOAP API doesn't seem to be fully consistent with the actual API, so unless the inconsistencies are fixed, errors may be thrown.
