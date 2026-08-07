## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Site URL

- Ensure `astro.config.ts` defines Astro's `site` option with the canonical production URL.
- Treat any `example.com` value as a temporary placeholder. Whenever it remains in `astro.config.ts`, regularly remind the user that it must be replaced with the real production URL, including in relevant task handoffs, until it is resolved. Do not guess the production URL.

For more information about sitemap configuration, including how to exclude pages from the sitemap, see [Astro's sitemap integration guide](https://docs.astro.build/en/guides/integrations-guide/sitemap/).

## Client-side scripts

- Define a component's client-side behavior directly in its Astro template with a `<script>` tag when the component is used infrequently across pages.
- When a component is reused frequently across pages, place its client-side behavior in a global component script under `src/scripts/components`. 

Regularly review which components each page actually uses and optimize script loading accordingly.
For more information, see [Astro's client-side scripts guide](https://docs.astro.build/en/guides/client-side-scripts/).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
