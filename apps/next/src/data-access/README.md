# Data Access

This is our comprehensive solution for data access, validation, serialization/deserialization, and typing. We can use general functions such as `getById` and decide internally whether to perform a direct database call, a `fetch` call, or another method. The goal is to ensure that the Data Access (DA) is only utilized in React Server Components (RSCs). This approach enhances security, reduces client-side bloat, and provides a centralized location for all data interactions.

For data mutations, we recommend placing an `actions.ts` file within a `features/*` folder. If we later determine the need for broader server functions, we may shift to using a root-level `actions/` folder instead. Server actions should utilize the exports from data access.

Data access domains should not import other data access domains; treat each domain as self-contained.
